'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import Image from 'next/image'
import {
    CalendarCheck,
    CheckCircle2,
    Loader2,
    MessageCircle,
    Phone,
    User,
    Mail,
    Hash,
    Stethoscope,
    MapPin,
} from 'lucide-react'
import {
    DEPARTMENTS,
    DOCTORS,
    getDoctorsByDepartment,
    DEFAULT_TIME_SLOTS,
} from '@/lib/constants'

import { HospitalLogo } from '@/components/hospital-logo'
import { format, addDays, isToday, parse } from 'date-fns'

const bookingSchema = z.object({
    patientName: z.string().min(2, 'Name must be at least 2 characters'),
    phoneNumber: z
        .string()
        .min(10, 'Phone number must be 10 digits')
        .max(10, 'Phone number must be 10 digits')
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
    department: z.string().min(1, 'Please select a department'),
    doctor: z.string().min(1, 'Please select a doctor'),
    preferredDate: z.string().min(1, 'Please select a date'),
    preferredTime: z.string().min(1, 'Please select a time slot'),
    age: z.string()
        .optional()
        .refine(
            (val) => !val || (parseInt(val) >= 14 && parseInt(val) <= 90),
            'Age must be between 14 and 90 years'
        ),
    gender: z.string().min(1, 'Please select gender'),
    place: z.string().optional(),
    message: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

const STEPS = ['Department & Doctor', 'Schedule', 'Your Details']

function ProgressStepper({ currentStep }: { currentStep: number }) {
    return (
        <div className="w-full max-w-[620px] mx-auto mb-8 sm:mb-10">
            <div className="flex items-start justify-center">
                {STEPS.map((step, i) => {
                    const stepNum = i + 1
                    const isCompleted = stepNum < currentStep
                    const isCurrent = stepNum === currentStep
                    const isLast = i === STEPS.length - 1

                    return (
                        <div key={step} className="flex items-start flex-1 justify-center min-w-0">
                            <div className="flex flex-col items-center min-w-0">
                                <div className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isCompleted || isCurrent
                                            ? 'bg-[#10b981] text-white shadow-sm'
                                            : 'bg-[#e5e7eb] text-[#9ca3af]'
                                            }`}
                                    >
                                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                                    </div>
                                </div>
                                <span
                                    className={`mt-2 text-[10px] sm:text-[11px] font-medium whitespace-nowrap ${isCurrent ? 'text-[#10b981]' : isCompleted ? 'text-[#6b7280]' : 'text-[#94a3b8]'
                                        }`}
                                >
                                    {step}
                                </span>
                            </div>
                            {!isLast && (
                                <div className="flex items-center pt-4 px-2 sm:px-4">
                                    <div
                                        className={`h-[2px] w-12 sm:w-20 ${stepNum < currentStep ? 'bg-[#10b981]' : 'bg-[#e5e7eb]'
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function timeSlotToMinutes(slot: string): number {
    const cleaned = slot.trim().replace(/^0/, '')
    const date = parse(cleaned, 'h:mm a', new Date())
    return date.getHours() * 60 + date.getMinutes()
}

export function BookingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState('')
    const [selectedDoctor, setSelectedDoctor] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [bookedSlots, setBookedSlots] = useState<string[]>([])
    const [lastAppointment, setLastAppointment] = useState<{
        id: string
        patientName: string
        phone: string
        department: string
        doctor: string
        date: string
        time: string
        reason?: string | null
        age?: string | null
        gender?: string | null
        place?: string | null
        hospitalWhatsAppUrl?: string
    } | null>(null)
    const dateInputRef = useRef<HTMLInputElement>(null)

    const doctors = selectedDepartment ? getDoctorsByDepartment(selectedDepartment) : []

    const minDate = format(addDays(new Date(), 0), 'yyyy-MM-dd')
    const maxDate = format(addDays(new Date(), 30), 'yyyy-MM-dd')

    const fetchBookedSlots = useCallback(async (date: string, doctor: string) => {
        if (!date || !doctor) {
            setBookedSlots([])
            return
        }
        try {
            const res = await fetch(`/api/appointments?date=${date}&doctor=${encodeURIComponent(doctor)}&slots_only=true`)
            const data = await res.json()
            if (res.ok && data.bookedSlots) {
                setBookedSlots(data.bookedSlots)
            }
        } catch {
            // silently fail
        }
    }, [])

    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            patientName: '',
            phoneNumber: '',
            department: '',
            doctor: '',
            preferredDate: '',
            preferredTime: '',
            age: '',
            gender: '',
            place: '',
            message: '',
        },
    })

    const watchName = form.watch('patientName')
    const watchPhone = form.watch('phoneNumber')
    const watchDept = form.watch('department')
    const watchDoc = form.watch('doctor')
    const watchDate = form.watch('preferredDate')
    const watchTime = form.watch('preferredTime')

    useEffect(() => {
        if (watchDate && watchDoc) {
            fetchBookedSlots(watchDate, watchDoc)
        } else {
            setBookedSlots([])
        }
    }, [watchDate, watchDoc, fetchBookedSlots])

    const isSlotPast = (slot: string): boolean => {
        if (!watchDate) return false
        const selectedDate = new Date(watchDate + 'T00:00:00')
        if (!isToday(selectedDate)) return false
        const now = new Date()
        const currentMinutes = now.getHours() * 60 + now.getMinutes()
        return timeSlotToMinutes(slot) <= currentMinutes
    }

    const isSlotBooked = (slot: string): boolean => bookedSlots.includes(slot)

    useEffect(() => {
        if (selectedTime && watchDate && (isSlotPast(selectedTime) || isSlotBooked(selectedTime))) {
            setSelectedTime('')
            form.setValue('preferredTime', '')
        }
    }, [selectedTime, watchDate, bookedSlots, form])

    const computedStep = (() => {
        if (watchDept && watchDoc) {
            if (watchDate && watchTime && watchName && /^[6-9]\d{9}$/.test(watchPhone)) return 3
            return 2
        }
        return 1
    })()
    const isPhoneComplete = /^\d{10}$/.test(watchPhone || '')

    const [submitError, setSubmitError] = useState('')

    const handleWhatsAppSubmit = async () => {
        const valid = await form.trigger()
        if (!valid) return

        const data = form.getValues()
        setIsSubmitting(true)
        setSubmitError('')
        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const result = await res.json()
            if (res.ok && result.success && result.appointment) {
                const apt = result.appointment
                setLastAppointment({
                    id: apt.id,
                    patientName: apt.patientName,
                    phone: apt.phoneNumber,
                    department: apt.department,
                    doctor: apt.doctor || '',
                    date: apt.preferredDate,
                    time: apt.preferredTime,
                    reason: apt.reason,
                    age: apt.age,
                    gender: apt.gender,
                    place: apt.place,
                    hospitalWhatsAppUrl: result.hospitalWhatsAppUrl,
                })
                setIsSuccess(true)
            } else {
                setSubmitError(result.message || 'Something went wrong. Please try again.')
                console.error('Appointment creation failed:', result.message, result.details)
            }
        } catch (err) {
            setSubmitError('Network error. Please check your connection and try again.')
            console.error('Submit error:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getCallbackMessage = () => {
        const hour = new Date().getHours()
        if (hour >= 20 || hour < 8) {
            return 'Our team will call you tomorrow morning around 8:00 AM to confirm your appointment.'
        }
        return 'Our team will call you within 15 minutes to confirm your appointment.'
    }

    if (isSuccess && lastAppointment) {
        const whatsappUrl = lastAppointment.hospitalWhatsAppUrl || '#'

        return (
            <div className="bg-white min-h-screen flex items-center justify-center px-4 py-10">
                <div className="max-w-md w-full">
                    <div className="text-center mb-5">
                        <div className="mx-auto w-20 h-20 bg-[#dcfce7] rounded-full flex items-center justify-center mb-5">
                            <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a3b5c] mb-2">Appointment Request Submitted!</h2>
                        <p className="text-[#6b7280] text-sm leading-relaxed">
                            {getCallbackMessage()}
                        </p>
                    </div>

                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-5 mb-6">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-[#6b7280] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] text-[#9ca3af] uppercase font-medium">Patient</p>
                                    <p className="text-sm font-semibold text-[#1a3b5c]">{lastAppointment.patientName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-[#6b7280] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] text-[#9ca3af] uppercase font-medium">Phone</p>
                                    <p className="text-sm font-semibold text-[#1a3b5c]">+91 {lastAppointment.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CalendarCheck className="w-4 h-4 text-[#6b7280] mt-0.5 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-[11px] text-[#9ca3af] uppercase font-medium">Schedule</p>
                                    <p className="text-sm font-semibold text-[#1a3b5c]">{lastAppointment.date} at {lastAppointment.time}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Stethoscope className="w-4 h-4 text-[#6b7280] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] text-[#9ca3af] uppercase font-medium">Department</p>
                                    <p className="text-sm font-semibold text-[#1a3b5c]">{lastAppointment.department}</p>
                                </div>
                            </div>
                            {lastAppointment.doctor && (
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-[#6b7280] mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[11px] text-[#9ca3af] uppercase font-medium">Doctor</p>
                                        <p className="text-sm font-semibold text-[#1a3b5c]">{lastAppointment.doctor}</p>
                                    </div>
                                </div>
                            )}
                            {lastAppointment.reason && (
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-[#6b7280] mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[11px] text-[#9ca3af] uppercase font-medium">Reason</p>
                                        <p className="text-sm font-semibold text-[#1a3b5c]">{lastAppointment.reason}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <Hash className="w-4 h-4 text-[#6b7280] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[11px] text-[#9ca3af] uppercase font-medium">Reference ID</p>
                                    <p className="text-xs font-mono font-semibold text-[#1a3b5c]">{lastAppointment.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-lg transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Open WhatsApp
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f2f5f7] text-slate-800">
            <div className="relative overflow-hidden bg-gradient-to-b from-[#0b4b79] via-[#0d5d90] to-[#0f4b73] pb-18">
                <div className="absolute inset-x-0 bottom-[-1px]">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-20 w-full fill-[#f2f5f7]">
                        <path d="M0,80 C180,40 300,40 480,70 C660,100 780,80 960,60 C1160,40 1280,45 1440,70 L1440,120 L0,120 Z" />
                    </svg>
                </div>

                <div className="relative mx-auto max-w-[1200px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
                    <div className="mx-auto flex w-[64px] h-[64px] items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                        <HospitalLogo size="lg" className="h-12 w-12 rounded-full object-cover" />
                    </div>

                    <div className="mt-4 text-center">
                        <h2 className="text-lg font-semibold text-white sm:text-2xl">Sri Suraksha Multi Speciality Hospital</h2>
                    </div>

                    <div className="mt-6 flex items-end justify-center gap-4 sm:gap-8">
                        {DOCTORS.map((doc) => (
                            <div key={doc.name} className="flex flex-col items-center">
                                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white/40 bg-white/10 sm:h-20 sm:w-20">
                                    <Image src={doc.image} alt={doc.name} fill sizes="80px" className="object-cover object-top" />
                                </div>
                                <p className="mt-2 text-center text-[10px] font-semibold text-[#9be0d1] sm:text-sm">{doc.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Book an Appointment</h1>
                        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
                            Follow the steps below to schedule your visit. Your request will be sent instantly to our reception.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative mx-auto -mt-1 max-w-[1100px] px-4 pb-10 pt-2 sm:px-6 lg:px-8">
                <ProgressStepper currentStep={computedStep} />

                <div className="rounded-[18px] bg-[#f5f6f7] p-4 shadow-sm ring-1 ring-slate-200/80 sm:p-6 lg:p-8">
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#1f2937] sm:text-[12px]">
                                    Select Department <span className="text-red-500">*</span>
                                </label>
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select
                                                onValueChange={(val) => {
                                                    field.onChange(val)
                                                    setSelectedDepartment(val)
                                                    setSelectedDoctor('')
                                                    form.setValue('doctor', '')
                                                }}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-12 w-full rounded-xl border border-[#dfe3e8] bg-white text-sm text-[#334155] shadow-sm transition focus:border-[#10b981] focus:ring-0">
                                                        <SelectValue placeholder="Select Department" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {DEPARTMENTS.map((dept) => (
                                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {selectedDepartment && (
                                <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#1f2937] sm:text-[12px]">
                                        Select Doctor <span className="text-red-500">*</span>
                                    </label>
                                    <FormField
                                        control={form.control}
                                        name="doctor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="space-y-3">
                                                    {doctors.map((doc) => {
                                                        const isSelected = selectedDoctor === doc.name
                                                        return (
                                                            <button
                                                                key={doc.name}
                                                                type="button"
                                                                onClick={() => {
                                                                    field.onChange(doc.name)
                                                                    setSelectedDoctor(doc.name)
                                                                    setSelectedTime('')
                                                                    form.setValue('preferredTime', '')
                                                                }}
                                                                className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${isSelected
                                                                    ? 'border-[#10b981] bg-[#ecfdf5] shadow-sm'
                                                                    : 'border-[#e5e7eb] bg-white hover:border-[#cbd5e1]'
                                                                    }`}
                                                            >
                                                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#dfe3e8] bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe]">
                                                                    <Image src={doc.image} alt={doc.name} fill sizes="48px" className="object-cover object-top" />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="text-sm font-semibold text-[#1a3b5c]">{doc.name}</div>
                                                                    <div className="mt-0.5 text-[11px] text-[#6b7280]">{doc.qualification}</div>
                                                                    <div className="mt-1 text-[11px] text-[#4b5563]">{doc.specialties.join(' • ')}</div>
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {watchDept && watchDoc && (
                                <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#1f2937] sm:text-[12px]">
                                        Select Preferred Date <span className="text-red-500">*</span>
                                    </label>
                                    <FormField
                                        control={form.control}
                                        name="preferredDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            ref={dateInputRef}
                                                            type="date"
                                                            min={minDate}
                                                            max={maxDate}
                                                            value={field.value}
                                                            onChange={(e) => {
                                                                field.onChange(e.target.value)
                                                                setSelectedTime('')
                                                                form.setValue('preferredTime', '')
                                                            }}
                                                            className="h-12 w-full rounded-xl border border-[#dfe3e8] bg-white pr-11 text-sm text-[#334155] shadow-sm transition focus:border-[#10b981] focus:ring-0"
                                                        />
                                                    </FormControl>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#6b7280]">
                                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                            <path d="M7 2.75v3.5M17 2.75v3.5M3.5 8.5h17M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7A1.5 1.5 0 0 1 5 5.5Z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {watchDate && watchDoc && (
                                <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#1f2937] sm:text-[12px]">
                                        Available Time Slots <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
                                        {DEFAULT_TIME_SLOTS.map((slot) => {
                                            const past = isSlotPast(slot)
                                            const booked = isSlotBooked(slot)
                                            const disabled = past || booked
                                            const selected = selectedTime === slot || watchTime === slot
                                            return (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => {
                                                        if (disabled) return
                                                        setSelectedTime(slot)
                                                        form.setValue('preferredTime', slot)
                                                    }}
                                                    disabled={disabled}
                                                    className={`h-10 rounded-lg border text-xs font-medium transition-all duration-200 ${booked
                                                        ? 'cursor-not-allowed border-[#f7c7d2] bg-[#fff1f2] text-[#c55d6d] line-through'
                                                        : selected
                                                            ? 'border-[#10b981] bg-[#10b981] text-white shadow-sm'
                                                            : 'border-[#5ecb9a] bg-white text-[#0f172a] hover:-translate-y-0.5 hover:border-[#10b981] hover:bg-[#10b981] hover:text-white hover:shadow-md'
                                                        } ${past ? 'cursor-not-allowed border-[#dfe3e8] bg-[#f3f4f6] text-[#c4c7cd] line-through' : ''}`}
                                                >
                                                    {slot}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-[#475569]">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-3 w-3 rounded-full border border-[#5ecb9a] bg-white" />
                                            Available
                                        </span>
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-3 w-3 rounded-full bg-[#10b981]" />
                                            Selected
                                        </span>
                                        <span className="inline-flex items-center gap-2">
                                            <span className="h-3 w-3 rounded-full border border-[#f7c7d2] bg-[#fff1f2]" />
                                            Booked
                                        </span>
                                    </div>

                                    <p className="mt-3 text-left text-[11px] leading-relaxed text-[#f59e0b]">
                                        * In emergency cases, the doctor may vary by 5 to 10 minutes from the scheduled time.
                                    </p>
                                </div>
                            )}

                            <div className="pt-2">
                                <div className="mb-5 h-px w-full bg-[#e5e7eb]" />
                                <h3 className="mb-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#1f2937] sm:text-[12px]">
                                    Your Details
                                </h3>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-[11px] font-bold text-[#1f2937] sm:text-[12px]">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="patientName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter your full name" className="h-12 rounded-xl border border-[#dfe3e8] bg-white text-sm text-[#334155] shadow-sm transition focus:border-[#10b981] focus:ring-0" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-[11px] font-bold text-[#1f2937] sm:text-[12px]">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="relative">
                                                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-[#64748b]">+91</span>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={field.value ?? ''}
                                                                onChange={(e) => {
                                                                    const sanitized = e.target.value.replace(/\D/g, '').slice(0, 10)
                                                                    field.onChange(sanitized)
                                                                }}
                                                                onPaste={(e) => {
                                                                    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 10)
                                                                    if (!pasted) {
                                                                        e.preventDefault()
                                                                        return
                                                                    }
                                                                    e.preventDefault()
                                                                    field.onChange(pasted)
                                                                }}
                                                                placeholder="10-digit number"
                                                                maxLength={10}
                                                                inputMode="numeric"
                                                                pattern="[0-9]*"
                                                                className="h-12 rounded-xl border border-[#dfe3e8] bg-white pl-12 text-sm text-[#334155] shadow-sm transition focus:border-[#10b981] focus:ring-0"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-[11px] font-bold text-[#1f2937] sm:text-[12px]">
                                            Age (Optional)
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="age"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter age" className="h-12 rounded-xl border border-[#dfe3e8] bg-white text-sm text-[#334155] shadow-sm transition focus:border-[#10b981] focus:ring-0" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-[11px] font-bold text-[#1f2937] sm:text-[12px]">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 w-full rounded-xl border border-[#dfe3e8] bg-white text-sm text-[#334155] shadow-sm transition focus:border-[#10b981] focus:ring-0">
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Male">Male</SelectItem>
                                                            <SelectItem value="Female">Female</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="mb-2 block text-[11px] font-bold text-[#1f2937] sm:text-[12px]">
                                        Place (Optional)
                                    </label>
                                    <FormField
                                        control={form.control}
                                        name="place"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Enter your city or locality"
                                                            className="h-12 w-full rounded-xl border border-[#dfe3e8] bg-white pr-12 text-sm text-[#334155] shadow-sm transition focus:border-[#10b981] focus:ring-0"
                                                        />
                                                    </FormControl>
                                                    <button
                                                        type="button"
                                                        aria-label="Use current location"
                                                        className="absolute inset-y-1.5 right-1.5 flex h-9 w-9 items-center justify-center rounded-lg border border-[#7dd3af] bg-[#ecfdf5] text-[#10b981] shadow-sm"
                                                    >
                                                        <MapPin className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="mt-5">
                                    <label className="mb-2 block text-[11px] font-bold text-[#1f2937] sm:text-[12px]">
                                        Reason for Visit (Optional)
                                    </label>
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Briefly describe your symptoms or reason for visit..."
                                                        className="min-h-[110px] w-full resize-none rounded-xl border border-[#dfe3e8] bg-white text-sm text-[#334155] shadow-sm transition focus:border-[#10b981] focus:ring-0"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {submitError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {submitError}
                                </div>
                            )}

                            <Button
                                type="button"
                                onClick={handleWhatsAppSubmit}
                                disabled={isSubmitting || !isPhoneComplete}
                                className="mt-2 h-12 w-full rounded-xl bg-[#22c55e] text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#16a34a] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Submitting...
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        Book & Open WhatsApp
                                    </span>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
