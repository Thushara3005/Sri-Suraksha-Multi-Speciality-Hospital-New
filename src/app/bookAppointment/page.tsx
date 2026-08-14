import { BookingForm } from '@/components/booking-form'
import { ChatbotWidget } from '@/components/chatbot-widget'

export default function BookAppointmentPage() {
    return (
        <div id="booking-form-root">
            <BookingForm />
            <ChatbotWidget />
        </div>
    )
}
