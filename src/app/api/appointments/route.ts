import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { buildHospitalNewAppointmentMsg, buildWhatsAppUrl, HOSPITAL_PHONE } from '@/lib/whatsapp-message'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const department = searchParams.get('department')
        const date = searchParams.get('date')
        const doctor = searchParams.get('doctor')
        const search = searchParams.get('search')
        const slotsOnly = searchParams.get('slots_only') === 'true'

        const where: Record<string, unknown> = {}

        if (status && status !== 'all') {
            where.status = status
        }
        if (department && department !== 'all') {
            where.department = department
        }
        if (doctor) {
            where.doctor = doctor
        }
        if (date) {
            where.preferredDate = date
        }
        if (search) {
            where.OR = [
                { patientName: { contains: search } },
                { phoneNumber: { contains: search } },
            ]
        }

        if (slotsOnly && date && doctor) {
            const booked = await db.appointment.findMany({
                where: {
                    preferredDate: date,
                    doctor,
                    status: { notIn: ['Cancelled'] },
                },
                select: { preferredTime: true },
            })
            return NextResponse.json({ bookedSlots: booked.map((b) => b.preferredTime) })
        }

        const appointments = await db.appointment.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ appointments })
    } catch (error) {
        console.error('Appointment Fetch Error:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch appointments',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            patientName,
            phoneNumber,
            age,
            gender,
            department,
            doctor,
            preferredDate,
            preferredTime,
            reason,
            place,
            language,
        } = body

        const missing: string[] = []
        if (!patientName?.trim()) missing.push('Patient Name')
        if (!phoneNumber?.trim()) missing.push('Phone Number')
        if (!department?.trim()) missing.push('Department')
        if (!preferredDate?.trim()) missing.push('Date')
        if (!preferredTime?.trim()) missing.push('Time')

        if (missing.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Missing required field(s): ${missing.join(', ')}`,
                    details: `The following fields are required but were empty or not provided: ${missing.join(', ')}`,
                },
                { status: 400 }
            )
        }

        if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid phone number. Must be a 10-digit Indian number starting with 6, 7, 8, or 9.',
                    details: `Received phone number: "${phoneNumber}" does not match pattern /^[6-9]\d{9}$/`,
                },
                { status: 400 }
            )
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const selectedDate = new Date(preferredDate + 'T00:00:00')
        if (selectedDate < today) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid appointment date. Cannot book a past date.',
                    details: `Selected date ${preferredDate} is before today ${today.toISOString().split('T')[0]}`,
                },
                { status: 400 }
            )
        }

        const existingAppointment = await db.appointment.findFirst({
            where: {
                phoneNumber,
                doctor,
                preferredDate,
                preferredTime,
                status: { notIn: ['Cancelled'] },
            },
        })

        if (existingAppointment) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'This time slot is already booked for the selected doctor. Please choose a different time.',
                    details: `Duplicate booking detected: phone=${phoneNumber}, doctor=${doctor}, date=${preferredDate}, time=${preferredTime}, existing appointment ID=${existingAppointment.id}`,
                },
                { status: 409 }
            )
        }

        const appointment = await db.appointment.create({
            data: {
                patientName: patientName.trim(),
                phoneNumber: phoneNumber.trim(),
                age: age ? parseInt(age) : null,
                gender: gender?.trim() || null,
                department: department.trim(),
                doctor: doctor?.trim() || null,
                preferredDate: preferredDate.trim(),
                preferredTime: preferredTime.trim(),
                reason: reason?.trim() || null,
                place: place?.trim() || null,
                language: ['en', 'te', 'hi'].includes(language) ? language : 'en',
                status: 'Pending',
                paymentStatus: 'Unpaid',
            },
        })

        const referenceId = appointment.id.slice(-8).toUpperCase()

        const hospitalWhatsAppUrl = buildWhatsAppUrl(
            HOSPITAL_PHONE,
            buildHospitalNewAppointmentMsg({
                patientName: appointment.patientName,
                phone: appointment.phoneNumber,
                age: appointment.age,
                gender: appointment.gender,
                place: appointment.place,
                department: appointment.department,
                doctor: appointment.doctor || 'To be assigned',
                date: appointment.preferredDate,
                time: appointment.preferredTime,
                reason: appointment.reason,
                referenceId,
            })
        )

        try {
            await fetch(`http://localhost:3004/notify?XTransformPort=3004`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'NEW_APPOINTMENT',
                    appointment: {
                        id: appointment.id,
                        patientName: appointment.patientName,
                        department: appointment.department,
                        preferredDate: appointment.preferredDate,
                        preferredTime: appointment.preferredTime,
                    },
                }),
            })
        } catch (wsError) {
            console.error('WebSocket notification failed (non-critical):', wsError)
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Appointment created successfully',
                referenceId,
                appointment,
                hospitalWhatsAppUrl,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Appointment Creation Error:', error)

        let message = 'Failed to create appointment'
        let details = 'Unknown error'

        if (error instanceof Error) {
            details = `${error.message}\n${error.stack || 'No stack trace available'}`

            const msg = error.message.toLowerCase()
            if (msg.includes('unknown argument')) {
                const match = error.message.match(/unknown argument `(")?([\w]+)(")?`/i)
                message = match
                    ? `Database schema error: field "${match[2]}" is not recognized by the database. The schema may be out of sync.`
                    : 'Database schema error: A field is not recognized. The schema may be out of sync.'
            } else if (msg.includes('unique constraint')) {
                message = 'A duplicate appointment already exists for this slot.'
            } else if (msg.includes('not null constraint')) {
                const match = error.message.match(/column "(\w+)"/i)
                message = match
                    ? `Database error: Missing required field "${match[1]}"`
                    : 'Database error: A required field is missing.'
            } else if (msg.includes('connection') || msg.includes('connect') || msg.includes('econnrefused')) {
                message = 'Database connection failed. Please try again in a moment.'
            } else if (msg.includes('timeout')) {
                message = 'Database request timed out. Please try again.'
            } else {
                message = error.message
            }
        } else if (typeof error === 'string') {
            details = error
            message = error
        }

        return NextResponse.json(
            { success: false, message, details },
            { status: 500 }
        )
    }
}
