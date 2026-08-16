export const DEPARTMENTS = [
    'General Medicine',
    'Gynecology',
    'Orthopedics',
    'General Surgery',
] as const

export const DEFAULT_TIME_SLOTS = [
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
    '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
    '05:00 PM', '05:15 PM', '05:30 PM', '05:45 PM',
    '06:00 PM', '06:15 PM', '06:30 PM', '06:45 PM',
] as const

export const RAMESH_TIME_SLOTS = [
    '10:00 AM', '10:10 AM', '10:20 AM', '10:30 AM', '10:40 AM', '10:50 AM',
    '11:00 AM', '11:10 AM', '11:20 AM', '11:30 AM', '11:40 AM', '11:50 AM',
    '12:00 PM', '12:10 PM', '12:20 PM', '12:30 PM', '12:40 PM', '12:50 PM',
    '01:00 PM', '01:10 PM', '01:20 PM', '01:30 PM', '01:40 PM', '01:50 PM',
    '02:00 PM', '02:10 PM', '02:20 PM', '02:30 PM', '02:40 PM', '02:50 PM',
    '03:00 PM', '03:10 PM', '03:20 PM', '03:30 PM', '03:40 PM', '03:50 PM',
    '04:00 PM',
    '06:10 PM', '06:20 PM', '06:30 PM', '06:40 PM', '06:50 PM',
    '07:00 PM', '07:10 PM', '07:20 PM', '07:30 PM', '07:40 PM', '07:50 PM',
    '08:00 PM', '08:10 PM', '08:20 PM', '08:30 PM', '08:40 PM', '08:50 PM',
    '09:00 PM',
] as const

export const HARIKRISHNA_TIME_SLOTS = [
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
    '12:00 PM', '12:15 PM', '12:45 PM',
    '01:20 PM', '01:35 PM',
    '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM',
    '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM',
    '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM',
] as const

export const TRIVENI_TIME_SLOTS = [
    '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
    '12:00 PM', '12:15 PM', '12:30 PM',
    '01:00 PM', '01:15 PM', '01:30 PM',
    '02:30 PM', '02:45 PM',
    '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM',
    '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM',
    '05:00 PM', '05:15 PM', '05:30 PM', '05:45 PM',
    '06:00 PM', '06:15 PM', '06:30 PM',
] as const

export const SUMAN_RAO_TIME_SLOTS = [
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
    '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
    '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM',
    '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM',
    '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM',
    '05:00 PM', '05:15 PM',
] as const

export interface Doctor {
    name: string
    department: string
    qualification: string
    specialties: string[]
    image: string
    timeSlots: readonly string[]
}

export const DOCTORS: Doctor[] = [
    {
        name: 'Dr. G Ramesh Reddy',
        department: 'General Medicine',
        qualification: 'MBBS, MD',
        specialties: ['General Medicine', 'Diabetology', 'Critical Care'],
        image: '/dr-ramesh-reddy.png',
        timeSlots: RAMESH_TIME_SLOTS,
    },
    {
        name: 'Dr. G Triveni Reddy',
        department: 'Gynecology',
        qualification: 'MBBS, DGO, DNB',
        specialties: ['Gynecology', 'Infertility', 'Laparoscopic Surgery'],
        image: '/dr-triveni-reddy-new.png',
        timeSlots: TRIVENI_TIME_SLOTS,
    },
    {
        name: 'Dr. Harikrishna',
        department: 'Orthopedics',
        qualification: 'MBBS, MS Ortho',
        specialties: ['Joint Replacement', 'Spine Surgery', 'Sports Injury'],
        image: '/dr-harikrishna.png',
        timeSlots: HARIKRISHNA_TIME_SLOTS,
    },
    {
        name: 'Dr. A. Suman Rao',
        department: 'General Surgery',
        qualification: 'MBBS, MS (General Surgery)',
        specialties: ['General Surgery', 'Laparoscopic Surgery', 'Hernia Surgery'],
        image: '/dr-a-suman-rao.png',
        timeSlots: SUMAN_RAO_TIME_SLOTS,
    },
]

export function getDoctorsByDepartment(dept: string): Doctor[] {
    return DOCTORS.filter((d) => d.department === dept)
}

export const DEPARTMENT_DOCTORS: Record<string, string[]> = {
    'General Medicine': ['Dr. G Ramesh Reddy'],
    'Gynecology': ['Dr. G Triveni Reddy'],
    'Orthopedics': ['Dr. Harikrishna'],
    'General Surgery': ['Dr. A. Suman Rao'],
}

export const STATUS_COLORS: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Confirmed: 'bg-emerald-100 text-emerald-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-red-100 text-red-700',
}

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
    Paid: 'bg-emerald-100 text-emerald-700',
    Unpaid: 'bg-red-100 text-red-700',
}
