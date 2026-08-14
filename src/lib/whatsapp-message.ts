/**
 * WhatsApp message templates for Sri Suraksha Multi Speciality Hospital.
 *
 * FLOWS:
 *   FLOW 1: buildHospitalNewAppointmentMsg()  → NEW APPOINTMENT REQUEST → Hospital
 *   FLOW 2: buildPatientConfirmationMsg()         → APPOINTMENT CONFIRMED → Patient
 */

export const HOSPITAL_PHONE = '9390989540'

export function cleanPhoneForWhatsApp(raw: string): string {
    const digits = raw.replace(/[^0-9]/g, '')
    if (digits.length >= 12 && digits.startsWith('91')) {
        return digits
    }
    if (digits.length === 10) {
        return '91' + digits
    }
    return digits
}

interface AppointmentData {
    patientName: string
    phone: string
    age?: string | number | null
    gender?: string | null
    place?: string | null
    department: string
    doctor: string
    date: string
    time: string
    reason?: string | null
    referenceId: string
}

export function buildHospitalNewAppointmentMsg(data: AppointmentData): string {
    const lines: string[] = [
        '🏥 *SRI SURAKSHA MULTI SPECIALITY HOSPITAL*',
        '',
        '📢 *NEW APPOINTMENT REQUEST*',
        '',
        '━━━━━━━━━━━━━━━━━━━━━',
        '',
        `👤 *Patient:* ${data.patientName}`,
    ]

    if (data.age) lines.push(`🎂 *Age:* ${data.age}`)
    if (data.gender) lines.push(`🚻 *Gender:* ${data.gender}`)
    lines.push(`📱 *Phone:* +91 ${data.phone}`)
    if (data.place) lines.push(`📍 *Place:* ${data.place}`)
    lines.push(`🏥 *Department:* ${data.department}`)
    lines.push(`👨‍⚕️ *Doctor:* ${data.doctor}`)
    lines.push(`📅 *Date:* ${data.date}`)
    lines.push(`🕐 *Time:* ${data.time}`)
    if (data.reason) lines.push(`🩺 *Reason:* ${data.reason}`)
    lines.push(`🔹 *Reference ID:* ${data.referenceId}`)
    lines.push('', '━━━━━━━━━━━━━━━━━━━━━', '', 'Please verify the appointment from the Admin Dashboard.', '', '📞 +91 93909 89540')

    return lines.join('\n')
}

interface PatientConfirmData {
    patientName: string
    age?: string | number | null
    gender?: string | null
    place?: string | null
    department: string
    doctor: string
    date: string
    time: string
}

export function buildPatientConfirmationMsg(data: PatientConfirmData): string {
    const lines: string[] = [
        '🏥 *SRI SURAKSHA MULTI SPECIALITY HOSPITAL*',
        '',
        '✅ *APPOINTMENT CONFIRMED*',
        '',
        `Dear *${data.patientName}*,`,
        '',
        'Your appointment has been confirmed successfully.',
        '',
        `👤 *Name:* ${data.patientName}`,
    ]

    if (data.age) lines.push(`🎂 *Age:* ${data.age}`)
    if (data.gender) lines.push(`🚻 *Gender:* ${data.gender}`)
    if (data.place) lines.push(`📍 *Place:* ${data.place}`)
    lines.push(`🏥 *Department:* ${data.department}`)
    lines.push(`👨‍⚕️ *Doctor:* ${data.doctor}`)
    lines.push(`📅 *Date:* ${data.date}`)
    lines.push(`🕐 *Time:* ${data.time}`)
    lines.push('', '━━━━━━━━━━━━━━━━━━━━━', '', '⏰ *Please come 30 minutes before your appointment time.*', '', '🙏 Thank you for choosing', '*SRI SURAKSHA MULTI SPECIALITY HOSPITAL*', '', '📞 *Contact:* +91 93909 89540')

    return lines.join('\n')
}

export function buildWhatsAppUrl(toPhone: string, message: string): string {
    const cleanNumber = cleanPhoneForWhatsApp(toPhone)
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}
