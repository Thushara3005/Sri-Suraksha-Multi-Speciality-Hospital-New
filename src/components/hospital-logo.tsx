import Image from 'next/image'

interface HospitalLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

const sizes = {
    sm: { w: 36, h: 36 },
    md: { w: 44, h: 44 },
    lg: { w: 56, h: 56 },
    xl: { w: 96, h: 96 },
}

export function HospitalLogo({ size = 'md', className = '' }: HospitalLogoProps) {
    const { w, h } = sizes[size]
    return (
        <Image
            src="/hospital-logo.jpg"
            alt="Sri Suraksha Multi Speciality Hospital"
            width={w}
            height={h}
            className={`object-contain ${className}`}
            priority
        />
    )
}
