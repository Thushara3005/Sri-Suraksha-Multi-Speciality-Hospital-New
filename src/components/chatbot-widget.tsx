'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { addDays, format, isSameDay } from 'date-fns'
import { Bot, CalendarDays, Languages, Loader2, MapPin, MessageCircle, Phone, SendHorizonal, X } from 'lucide-react'
import { DEPARTMENTS, DEFAULT_TIME_SLOTS, DOCTORS, getDoctorsByDepartment } from '@/lib/constants'
import { buildWhatsAppUrl, HOSPITAL_PHONE } from '@/lib/whatsapp-message'
import { Calendar } from '@/components/ui/calendar'

type Language = 'en' | 'te' | 'hi'
type BookingStage =
    | 'idle'
    | 'name'
    | 'age'
    | 'gender'
    | 'mobile'
    | 'location'
    | 'symptoms'
    | 'recommendation'
    | 'department'
    | 'doctor'
    | 'date'
    | 'time'
    | 'summary'
    | 'success'

type ChatMessage = {
    id: number
    sender: 'bot' | 'user'
    text: string
    isAction?: boolean
}

type ConversationData = {
    name: string
    age: string
    gender: string
    mobile: string
    location: string
    symptoms: string
    department: string
    doctor: string
    date: string
    time: string
}

const initialData: ConversationData = {
    name: '',
    age: '',
    gender: '',
    mobile: '',
    location: '',
    symptoms: '',
    department: '',
    doctor: '',
    date: '',
    time: '',
}

const MAPS_URL = 'https://maps.google.com/?q=Sri+Suraksha+Multi+Speciality+Hospital+Metpally+Main+Rd+near+Old+Bus+Stop+Metpally+Telangana+505325'

const translations = {
    en: {
        online: 'Online',
        header: 'Sri Suraksha Hospital Assistant',
        placeholder: 'Type your message...',
        welcome: 'Hello! Welcome to Sri Suraksha Multi Speciality Hospital. How can I help you today?',
        defaultFallback: "I'm sorry, I didn't understand that. Please choose one of the options below or ask about appointments, doctors, departments, timings, fees, or contact information.",
        appointmentAction: 'Book an Appointment',
        quickActions: ['Book an Appointment', 'Our Doctors', 'Consultation Fee', 'Departments', 'Hospital Timings', 'Hospital Location', 'Contact Us', 'FAQs'],
        fee: 'Please contact the hospital reception for the latest consultation fee.',
        timings: 'Hospital timings: Open 24 Hours. Emergency care is available 24/7.',
        location: 'Hospital location: Gaddam Linga Reddy Complex, Metpally, Jagtial District, Telangana.',
        contact: 'You can contact the hospital at +91 93909 89540 or use WhatsApp.',
        directions: 'Get Directions',
        whatsappAction: 'WhatsApp',
        language: 'Language',
        openAssistant: 'Open hospital assistant',
        closeChat: 'Close chat',
        send: 'Send message',
        selectAppointmentDate: 'Select appointment date',
        open: 'Open',
        hide: 'Hide',
        today: 'Today',
        clear: 'Clear',
        selectDepartment: 'Select Department',
        selectDoctor: 'Select Doctor',
        selectDate: 'Select Date',
        selectTime: 'Select Time',
        bookingStart: "Sure! I'll help you book an appointment. What is your name?",
        askAge: 'What is your age?',
        askGender: 'What is your gender?',
        genderOptions: ['Male', 'Female', 'Other'],
        askMobile: 'Please share your mobile number.',
        askLocation: 'What city or locality are you from? (optional)',
        askSymptoms: 'What symptoms or reason are you visiting for? (optional, but helps us guide you to the right department.)',
        askDepartment: 'Which department would you like to consult?',
        askDoctor: 'Which doctor would you like to consult?',
        recommendationTitle: 'Recommended Department',
        recommendationMessage: 'Based on the symptoms you described, {department} may be the appropriate department.',
        recommendationContinue: 'Yes, Continue',
        recommendationAnother: 'Choose Another Department',
        requestMoreDetails: 'No problem. Please describe your main symptoms in a little more detail.',
        fallbackGeneralMedicine: 'I recommend starting with General Medicine, where a doctor can assess your symptoms and guide you to the appropriate specialist if needed.',
        emergencyWarning: 'These symptoms may require urgent medical attention. Please seek emergency medical care immediately rather than waiting for a routine appointment.',
        doctorsInDepartment: 'Here are the doctors available in',
        noDoctorAvailable: 'Currently no doctor is available for this department. Please choose another department.',
        askDate: 'What is your preferred appointment date?',
        askTime: 'Please choose an available time slot.',
        noSlots: 'There are no available slots for that date with the selected doctor. Please choose another date.',
        summaryTitle: 'APPOINTMENT SUMMARY',
        summaryPatient: 'Patient',
        summaryAge: 'Age',
        summaryGender: 'Gender',
        summaryMobile: 'Mobile',
        summaryLocation: 'Location',
        summaryReason: 'Reason',
        summaryDepartment: 'Department',
        summaryDoctor: 'Doctor',
        summaryDate: 'Date',
        summaryTime: 'Time',
        askConfirm: 'Please confirm your appointment details.',
        confirm: 'Confirm Appointment',
        changeDetails: 'Change Details',
        successTitle: '✓ Appointment Request Submitted!',
        successIntro: 'Your appointment request has been submitted. We will contact you to confirm the slot.',
        openWhatsApp: 'Open WhatsApp',
        bookingError: 'Please enter a valid value.',
        suggestedDepartment: 'Based on what you have described, you may want to consult',
        chooseAnother: 'You can choose another department if you prefer.',
        invalidAge: 'Please enter a valid age between 14 and 90.',
        invalidMobile: 'Please enter a valid 10-digit mobile number beginning with 6, 7, 8, or 9.',
        invalidDate: 'Please choose a valid future date within 30 days.',
        invalidDateSelection: 'Please select a valid appointment date.',
        slotPrompt: 'Please choose an available time slot.',
        slotSummary: 'Great! Here are the available time slots for',
        chooseAnotherDate: 'Choose Another Date',
        changeDate: 'Change Date',
        changeTime: 'Change Time',
        doctorNotFound: 'Please choose a doctor from the list.',
        invalidDepartment: 'Please choose a valid department from the real hospital departments.',
        skipOptional: 'Skip',
    },
    te: {
        online: 'ఆన్‌లైన్',
        header: 'శ్రీ సురక్ష హాస్పిటల్ సహాయకుడు',
        placeholder: 'మీ సందేశం వ్రాయండి...',
        welcome: 'నమస్కారం! శ్రీ సురక్ష మల్టీ స్పెషాలిటీ హాస్పిటల్‌కు స్వాగతం. నేను మీకు ఎలా సహాయం చేయగలను?',
        defaultFallback: 'క్షమించండి, నేను దానిని అర్థం చేసుకోలేకపోయాను. కిందివాటిలో ఒకటి ఎంచుకోండి లేదా అపాయింట్మెంట్, డాక్టర్లు, విభాగాలు, టైమింగ్స్, ఫీజులు లేదా కాంటాక్ట్ గురించి అడగండి.',
        appointmentAction: 'అపాయింట్మెంట్ బుక్ చేయండి',
        quickActions: ['అపాయింట్మెంట్ బుక్ చేయండి', 'మా డాక్టర్లు', 'కన్సల్టేషన్ ఫీ', 'విభాగాలు', 'హాస్పిటల్ టైమింగ్స్', 'హాస్పిటల్ లొకేషన్', 'సంప్రదించండి', 'తరచుగా అడిగే ప్రశ్నలు'],
        fee: 'చివరి కన్సల్టేషన్ ఫీ కోసం హాస్పిటల్ రిసెప్షన్‌ను సంప్రదించండి.',
        timings: 'హాస్పిటల్ టైమింగ్స్: 24 గంటలు తెరుస్తుంది. ఎమర్జెన్సీ సేవలు 24/7 అందుబాటులో ఉన్నాయి.',
        location: 'హాస్పిటల్ స్థానం: గడ్డం లింగారెడ్డి కాంప్లెక్స్, మెట్‌పల్లి, జగ్గియాల్ జిల్లా, తెలంగాణ.',
        contact: 'మీరు హాస్పిటల్‌ను +91 93909 89540 వద్ద సంప్రదించవచ్చు లేదా WhatsApp ఉపయోగించవచ్చు.',
        directions: 'దిశలు పొందండి',
        whatsappAction: 'WhatsApp',
        language: 'భాష',
        openAssistant: 'హాస్పిటల్ సహాయకుడిని తెరవండి',
        closeChat: 'చాట్ మూసివేయండి',
        send: 'సందేశం పంపండి',
        selectAppointmentDate: 'అపాయింట్మెంట్ తేదీ ఎంచుకోండి',
        open: 'తెరువు',
        hide: 'మూసివేయండి',
        today: 'ఈరోజు',
        clear: 'చెరిపివేయండి',
        selectDepartment: 'విభాగాన్ని ఎంచుకోండి',
        selectDoctor: 'డాక్టర్‌ను ఎంచుకోండి',
        selectDate: 'తేదీ ఎంచుకోండి',
        selectTime: 'సమయాన్ని ఎంచుకోండి',
        bookingStart: 'సరే! నేను మీకు అపాయింట్మెంట్ బుక్ చేయడంలో సహాయం చేస్తాను. మీ పేరు ఏమిటి?',
        askAge: 'మీ వయస్సు ఎంత?',
        askGender: 'మీ లింగాన్ని ఎంచుకోండి.',
        genderOptions: ['మగవాడు', 'స్త్రీ', 'ఇతరులు'],
        askMobile: 'మీ మొబైల్ నంబర్ ఇవ్వండి.',
        askLocation: 'మీ నగరం లేదా ప్రాంతం ఏది? (వికల్పం)',
        askSymptoms: 'మీకు ఏ సమస్య ఉంది? మీ లక్షణాలను వివరించండి. (వికల్పం, కానీ సరైన విభాగాన్ని ఎంచుకోవడంలో సహాయం చేస్తుంది.)',
        askDepartment: 'మీరు ఏ విభాగంలో 상담 చేయాలనుకుంటున్నారు?',
        askDoctor: 'మీరు ఏ డాక్టర్‌ను సంప్రదించాలనుకుంటున్నారు?',
        recommendationTitle: 'సిఫార్సు చేసిన విభాగం',
        recommendationMessage: 'మీ వివరించిన లక్షణాల ఆధారంగా, {department} విభాగం మీకు సరిపోవచ్చు.',
        recommendationContinue: 'అవును, కొనసాగించండి',
        recommendationAnother: 'మరో విభాగాన్ని ఎంచుకోండి',
        requestMoreDetails: 'సరే. మీ ప్రధాన లక్షణాలను మరింత వివరంగా చెప్పండి.',
        fallbackGeneralMedicine: 'నేను General Medicine से ప్రారంభించమని సూచిస్తున్నాను, అక్కడ డాక్టర్ మీ లక్షణాలను అంచనా వేచి సరైన స్పెషలిస్ట్‌కు మార్గనిర్దేశం చేస్తారు.',
        emergencyWarning: 'ఈ లక్షణాలు అత్యవసర వైద్య సహాయం అవసరం. వేగంగా అత్యవసర వైద్యుడిని సంప్రదించండి.',
        doctorsInDepartment: 'ఈ విభాగంలో అందుబాటులో ఉన్న డాక్టర్లు',
        noDoctorAvailable: 'ఈ విభాగంలో ప్రస్తుతం డాక్టర్ అందుబాటులో లేరు. మరొక విభాగాన్ని ఎంచుకోండి.',
        askDate: 'మీకు కావాల్సిన అపాయింట్మెంట్ తేదీ ఏమిటి?',
        askTime: 'దొరికే సమయాన్ని ఎంచుకోండి.',
        noSlots: 'ఆ తేదీకి ఎలాంటి ఖాళీలు లేవు. దయచేసి వేరే తేదీ ఎంచుకోండి.',
        summaryTitle: 'అపాయింట్మెంట్ సమీక్ష',
        summaryPatient: 'రోగి',
        summaryAge: 'వయస్సు',
        summaryGender: 'లింగం',
        summaryMobile: 'మొబైల్',
        summaryLocation: 'స్థానం',
        summaryReason: 'కారణం',
        summaryDepartment: 'విభాగం',
        summaryDoctor: 'డాక్టర్',
        summaryDate: 'తేదీ',
        summaryTime: 'సమయం',
        askConfirm: 'దయచేసి మీ అపాయింట్మెంట్ వివరాలను నిర్ధారించండి.',
        confirm: 'అపాయింట్మెంట్ ధృవీకరించండి',
        changeDetails: 'వివరాలను మార్చండి',
        successTitle: '✓ అపాయింట్మెంట్ అభ్యర్థన నమోదు చేయబడింది!',
        successIntro: 'మీ అపాయింట్మెంట్ అభ్యర్థన నమోదు చేయబడింది. స్లాట్ నిర్ధారణ కోసం మేము మీకు కనెక్ట్ అవుతాం.',
        openWhatsApp: 'WhatsApp తెరవండి',
        bookingError: 'దయచేసి సరైన విలువ నమోదు చేయండి.',
        suggestedDepartment: 'మీ వివరాల ప్రకారం, మీరు ఈ విభాగాన్ని పరిశీలించవచ్చు:',
        chooseAnother: 'మీకు కావలసినట్లైతే వేరే విభాగాన్ని కూడా ఎంచుకోవచ్చు.',
        invalidAge: 'దయచేసి 14 నుండి 90 మధ్య వయస్సు తెలియజేయండి.',
        invalidMobile: 'దయచేసి 10 అంకెల మొబైల్ నంబర్ ఇవ్వండి. ఇది 6, 7, 8, లేదా 9తో ప్రారంభించాలి.',
        invalidDate: 'దయచేసి సరైన భవిష్యత్తు తేదీ ఎంచుకోండి.',
        invalidDateSelection: 'దయచేసి సరైన అపాయింట్మెంట్ తేదీ ఎంచుకోండి.',
        slotPrompt: 'దయచేసి అందుబాటులో ఉన్న సమయం ఎంచుకోండి.',
        slotSummary: 'బాగుంది! ఈ తేదీ కోసం అందుబాటులో ఉన్న టైమ్ స్లాట్లు ఉన్నాయి',
        chooseAnotherDate: 'మరో తేదీ ఎంచుకోండి',
        changeDate: 'తేదీ మార్చండి',
        changeTime: 'సమయం మార్చండి',
        doctorNotFound: 'దయచేసి జాబితాలో ఉన్న డాక్టర్‌ను ఎంచుకోండి.',
        invalidDepartment: 'దయచేసి హాస్పిటల్ విభాగాలలో ఒకదాన్ని ఎంచుకోండి.',
        skipOptional: 'విడిచివేయండి',
    },
    hi: {
        online: 'ऑनलाइन',
        header: 'श्री सुरक्ष अस्पताल सहायक',
        placeholder: 'अपना संदेश लिखें...',
        welcome: 'नमस्ते! श्री सुरक्ष मल्टी स्पेशलिटी हॉस्पिटल में आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूँ?',
        defaultFallback: 'मुझे माफ कीजिए, मुझे यह समझ नहीं आया। कृपया नीचे दी गई विकल्पों में से एक चुनें या अपॉइंटमेंट, डॉक्टर, विभाग, समय, फीस या संपर्क जानकारी के बारे में पूछें।',
        appointmentAction: 'अपॉइंटमेंट बुक करें',
        quickActions: ['अपॉइंटमेंट बुक करें', 'हमारे डॉक्टर', 'कन्सल्टेशन फीस', 'विभाग', 'हॉस्पिटल समय', 'हॉस्पिटल स्थान', 'संपर्क करें', 'सामान्य प्रश्न'],
        fee: 'नवीनतम कन्सल्टेशन फीस के लिए हॉस्पिटल रिसेप्शन से संपर्क करें।',
        timings: 'हॉस्पिटल समय: 24 घंटे खुला रहता है। इमरजेंसी सेवा 24/7 उपलब्ध है।',
        location: 'हॉस्पिटल का स्थान: गड्डम लिंग रeddy कॉम्प्लेक्स, मेत्पल्ली, जगतियल जिला, तेलंगाना।',
        contact: 'आप हॉस्पिटल से +91 93909 89540 पर संपर्क कर सकते हैं या WhatsApp का उपयोग कर सकते हैं।',
        directions: 'दिशाएँ देखें',
        whatsappAction: 'WhatsApp',
        language: 'भाषा',
        openAssistant: 'हॉस्पिटल सहायक खोलें',
        closeChat: 'चैट बंद करें',
        send: 'संदेश भेजें',
        selectAppointmentDate: 'अपॉइंटमेंट तारीख चुनें',
        open: 'खोलें',
        hide: 'छिपाएँ',
        today: 'आज',
        clear: 'साफ करें',
        selectDepartment: 'विभाग चुनें',
        selectDoctor: 'डॉक्टर चुनें',
        selectDate: 'तारीख चुनें',
        selectTime: 'समय चुनें',
        bookingStart: 'ज़रूर! मैं आपकी मदद से अपॉइंटमेंट बुक करूँगा। आपका नाम क्या है?',
        askAge: 'आपकी उम्र कितनी है?',
        askGender: 'आपका लिंग क्या है?',
        genderOptions: ['पुरुष', 'महिला', 'अन्य'],
        askMobile: 'आपका मोबाइल नंबर क्या है?',
        askLocation: 'आपका शहर या क्षेत्र क्या है? (वैकल्पिक)',
        askSymptoms: 'आप किस समस्या के लिए डॉक्टर से मिलना चाहते हैं? आपके लक्षण लिखें। (वैकल्पिक, लेकिन सही विभाग चुनने में मदद करता है.)',
        askDepartment: 'आप किस विभाग से परामर्श करना चाहते हैं?',
        askDoctor: 'आप किस डॉक्टर से मिलना चाहते हैं?',
        recommendationTitle: 'सुझाया गया विभाग',
        recommendationMessage: 'आपके बताए गए लक्षणों के आधार पर, {department} विभाग आपके लिए उपयुक्त हो सकता है।',
        recommendationContinue: 'हाँ, जारी रखें',
        recommendationAnother: 'दूसरा विभाग चुनें',
        requestMoreDetails: 'कोई बात नहीं। कृपया अपनी मुख्य समस्या को थोड़ा और विस्तार से बताएं।',
        fallbackGeneralMedicine: 'मैं General Medicine से शुरू करने की सलाह देता हूँ, जहाँ डॉक्टर आपके लक्षणों का आकलन करके आवश्यक विशेषज्ञता के लिए मार्गदर्शन करेगा।',
        emergencyWarning: 'इन लक्षणों के लिए तुरंत महत्वपूर्ण चिकित्सा ध्यान की आवश्यकता हो सकती है। कृपया रूटीन अपॉइंटमेंट के बजाय तुरंत आपातकालीन चिकित्सा सहायता लें।',
        doctorsInDepartment: 'इस विभाग के उपलब्ध डॉक्टर',
        noDoctorAvailable: 'इस विभाग के लिए वर्तमान में कोई डॉक्टर उपलब्ध नहीं है। कृपया दूसरा विभाग चुनें।',
        askDate: 'आपकी पसंदीदा अपॉइंटमेंट तारीख क्या है?',
        askTime: 'कृपया उपलब्ध समय स्लॉट चुनें।',
        noSlots: 'उस तारीख के लिए उपलब्ध स्लॉट नहीं हैं। कृपया कोई दूसरी तारीख चुनें।',
        summaryTitle: 'अपॉइंटमेंट सारांश',
        summaryPatient: 'रोगी',
        summaryAge: 'उम्र',
        summaryGender: 'लिंग',
        summaryMobile: 'मोबाइल',
        summaryLocation: 'स्थान',
        summaryReason: 'कारण',
        summaryDepartment: 'विभाग',
        summaryDoctor: 'डॉक्टर',
        summaryDate: 'तारीख',
        summaryTime: 'समय',
        askConfirm: 'कृपया अपने अपॉइंटमेंट विवरण की पुष्टि करें।',
        confirm: 'अपॉइंटमेंट की पुष्टि करें',
        changeDetails: 'विवरण बदलें',
        successTitle: '✓ अपॉइंटमेंट अनुरोध सफलतापूर्वक जमा हुआ!',
        successIntro: 'आपका अपॉइंटमेंट अनुरोध जमा हो गया है। हम आपके स्लॉट की पुष्टि करेंगे।',
        openWhatsApp: 'WhatsApp खोलें',
        bookingError: 'कृपया सही जानकारी दर्ज करें।',
        suggestedDepartment: 'आपके विवरण के आधार पर, आप इस विभाग से परामर्श करना चाह सकते हैं:',
        chooseAnother: 'यदि आप चाहें तो कोई दूसरा विभाग चुन सकते हैं।',
        invalidAge: 'कृपया 14 से 90 के बीच सही उम्र दर्ज करें।',
        invalidMobile: 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें, जो 6, 7, 8 या 9 से शुरू होता है।',
        invalidDate: 'कृपया सही भविष्य की तारीख चुनें।',
        invalidDateSelection: 'कृपया सही अपॉइंटमेंट तारीख चुनें।',
        slotPrompt: 'कृपया उपलब्ध समय स्लॉट चुनें।',
        slotSummary: 'बहुत अच्छा! इस तारीख के लिए उपलब्ध समय स्लॉट हैं',
        chooseAnotherDate: 'कोई दूसरी तारीख चुनें',
        changeDate: 'तारीख बदलें',
        changeTime: 'समय बदलें',
        doctorNotFound: 'कृपया सूची से डॉक्टर चुनें।',
        invalidDepartment: 'कृपया हॉस्पिटल के वास्तविक विभागों में से चुनें।',
        skipOptional: 'छोड़ें',
    },
} as const

function formatDepartmentList(lang: Language) {
    return DEPARTMENTS.join(', ')
}

function formatDoctorList(lang: Language) {
    return DOCTORS.map((doctor) => `${doctor.name} — ${doctor.department}`).join('\n')
}

function getBotReply(input: string, lang: Language): string {
    const text = input.trim().toLowerCase()
    const t = translations[lang]

    if (!text) return t.defaultFallback

    const multilingualPatterns = {
        book: [
            'book', 'appointment', 'apointment', 'apoinment', 'appoint', 'appointment book',
            'బుక్', 'అపాయింట్మెంట్', 'అపాయింట్‌మెంట్', 'అపాయింట్', 'సంబంధం',
            'बुक', 'अपॉइंटमेंट', 'अपॉइंटमेन्ट', 'अपॉइंट', 'बुक करना', 'बुक',
        ],
        doctor: ['doctor', 'doctors', 'డాక్టర్', 'డాక్టర్స్', 'डॉक्टर', 'डॉक्टर्स'],
        department: ['department', 'departments', 'విభాగం', 'విభాగాలు', 'विभाग', 'विभागों'],
        fee: ['fee', 'fees', 'cost', 'price', 'ఫీ', 'చెల్లింపు', 'कीमत', 'फीस', 'प्रति', 'दर'],
        timing: ['timing', 'times', 'open', 'hours', 'సమయం', 'టైమింగ్', 'తెరుస్తుంది', 'समय', 'खुला', 'घंटे'],
        location: ['location', 'address', 'map', 'where', 'స్థానం', 'చిరునామా', 'మ్యాప్', 'स्थान', 'पता', 'मैप'],
        contact: ['contact', 'phone', 'call', 'reach', 'కాంటాక్', 'ఫోన్', 'కాల్', 'संपर्क', 'फोन', 'कॉल'],
        whatsapp: ['whatsapp', 'chat', 'చాట్', 'व्हाट्सऐप', 'चैट'],
    } as const

    const matchesAny = (keywords: readonly string[]) => keywords.some((keyword) => text.includes(keyword))

    if (matchesAny(multilingualPatterns.book)) return t.bookingStart
    if (matchesAny(multilingualPatterns.doctor)) return formatDoctorList(lang)
    if (matchesAny(multilingualPatterns.department)) return formatDepartmentList(lang)
    if (matchesAny(multilingualPatterns.fee)) return t.fee
    if (matchesAny(multilingualPatterns.timing)) return t.timings
    if (matchesAny(multilingualPatterns.location)) return `${t.location} ${t.directions}`
    if (matchesAny(multilingualPatterns.contact)) return t.contact
    if (matchesAny(multilingualPatterns.whatsapp)) return t.whatsappAction
    return t.defaultFallback
}

function detectEmergencySymptoms(symptoms: string): boolean {
    const text = symptoms.toLowerCase()
    return /(severe chest pain|chest pain|shortness of breath|difficulty breathing|unconscious|unconsciousness|severe bleeding|bleeding heavily|stroke|slurred speech|sudden weakness|loss of consciousness|severe injury)/.test(text)
}

function detectDepartmentFromSymptoms(symptoms: string): string | null {
    const text = symptoms.toLowerCase()
    const departmentRules: Array<{ department: string; keywords: RegExp[] }> = [
        {
            department: 'Orthopedics',
            keywords: [
                /(knee|knees|joint|joints|bone|bones|back|spine|fracture|ankle|wrist|muscle|muscles|injury|difficulty walking|walking pain|hip pain|leg pain|shoulder pain|neck pain)/,
                /(pain in my knee|knee pain|back pain|hip pain|joint pain|bone pain|walking difficulty|cant walk|cannot walk)/,
            ],
        },
        {
            department: 'Gynecology',
            keywords: [
                /(pregnancy|pregnant|gyne|women's|women|period|periods|menstrual|ovary|uterus|pelvic|reproductive|infertility|vaginal|female problem|female issues)/,
            ],
        },
        {
            department: 'General Medicine',
            keywords: [
                /(fever|cold|cough|headache|weakness|body pain|illness|flu|migraine|sugar|diabetes|throat pain|vomiting|stomach pain|acidity|indigestion|digestive|skin rash|rash|itching|ulcer|infection)/,
            ],
        },
    ]

    let bestDepartment: { department: string; score: number } | null = null

    departmentRules.forEach(({ department, keywords }) => {
        const score = keywords.reduce((total, pattern) => total + (pattern.test(text) ? 1 : 0), 0)
        if (score > 0 && (!bestDepartment || score > bestDepartment.score)) {
            bestDepartment = { department, score }
        }
    })

    return bestDepartment?.department ?? null
}

function parseGender(input: string): string | null {
    const text = input.trim().toLowerCase()
    if (['male', 'm'].includes(text)) return 'Male'
    if (['female', 'f', 'woman', 'girl'].includes(text)) return 'Female'
    if (['other', 'transgender', 'non-binary'].includes(text)) return 'Other'
    return null
}

function parseDepartment(input: string): string | null {
    const text = input.trim().toLowerCase()
    return DEPARTMENTS.find((department) => department.toLowerCase() === text || department.toLowerCase().includes(text)) ?? null
}

function parseDoctor(input: string): string | null {
    const text = input.trim().toLowerCase()
    return DOCTORS.find((doctor) => doctor.name.toLowerCase() === text || doctor.name.toLowerCase().includes(text))?.name ?? null
}

function toLocalDate(dateValue: string): Date | null {
    if (!dateValue) return null

    const [year, month, day] = dateValue.split('-').map(Number)
    if (!year || !month || !day) return null

    const parsed = new Date(year, month - 1, day)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

function getBookingDateBounds() {
    const minDate = format(addDays(new Date(), 0), 'yyyy-MM-dd')
    const maxDate = format(addDays(new Date(), 30), 'yyyy-MM-dd')
    return { minDate, maxDate }
}

function isValidBookingDate(dateValue: string) {
    if (!dateValue) return false

    const selectedDate = toLocalDate(dateValue)
    if (!selectedDate) return false

    const minDate = new Date()
    minDate.setHours(0, 0, 0, 0)
    const maxDate = new Date(minDate)
    maxDate.setDate(maxDate.getDate() + 30)

    return selectedDate >= minDate && selectedDate <= maxDate
}

function timeSlotToMinutes(slot: string): number {
    const [timePart, meridian] = slot.split(' ')
    if (!timePart || !meridian) return 0
    const [hoursText, minutesText] = timePart.split(':')
    const hours = Number(hoursText)
    const minutes = Number(minutesText || '0')
    const total = hours * 60 + minutes

    if (meridian === 'PM' && hours !== 12) return total + 12 * 60
    if (meridian === 'AM' && hours === 12) return minutes
    return total
}

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [language, setLanguage] = useState<Language>('en')
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, sender: 'bot', text: translations.en.welcome },
    ])
    const [inputValue, setInputValue] = useState('')
    const [bookingStage, setBookingStage] = useState<BookingStage>('idle')
    const [bookingData, setBookingData] = useState<ConversationData>(initialData)
    const [bookingButtons, setBookingButtons] = useState<Array<{ label: string; value: string }>>([])
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitUrl, setSubmitUrl] = useState('')
    const [isDateCalendarOpen, setIsDateCalendarOpen] = useState(false)
    const [dateAvailabilityMap, setDateAvailabilityMap] = useState<Record<string, boolean>>({})
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)
    const scrollRef = useRef<HTMLDivElement | null>(null)

    const t = translations[language]
    const quickActions = useMemo(() => t.quickActions, [t.quickActions])
    const bookingDateBounds = useMemo(() => getBookingDateBounds(), [])

    const fetchDoctorDateAvailability = useCallback(async (doctorName: string) => {
        if (!doctorName) return
        setDateAvailabilityMap({})
        setIsLoadingAvailability(true)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const doc = DOCTORS.find((d) => d.name === doctorName)
        const docSlots = doc?.timeSlots || DEFAULT_TIME_SLOTS

        const dateStrings: string[] = []
        for (let i = 0; i <= 30; i++) {
            const d = addDays(today, i)
            dateStrings.push(format(d, 'yyyy-MM-dd'))
        }

        const availabilityMap: Record<string, boolean> = {}

        await Promise.all(
            dateStrings.map(async (dateStr) => {
                try {
                    const res = await fetch(`/api/appointments?date=${encodeURIComponent(dateStr)}&doctor=${encodeURIComponent(doctorName)}&slots_only=true`)
                    if (!res.ok) {
                        availabilityMap[dateStr] = false
                        return
                    }
                    const data = await res.json()
                    const booked: string[] = data.bookedSlots || []

                    const isSelectedToday = dateStr === format(today, 'yyyy-MM-dd')
                    const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes()

                    const remaining = docSlots.filter((slot) => {
                        if (booked.includes(slot)) return false
                        if (isSelectedToday && timeSlotToMinutes(slot) <= currentMinutes) return false
                        return true
                    })
                    availabilityMap[dateStr] = remaining.length > 0
                } catch {
                    availabilityMap[dateStr] = false
                }
            })
        )

        setDateAvailabilityMap(availabilityMap)
        setIsLoadingAvailability(false)
    }, [])

    useEffect(() => {
        if (bookingStage === 'date' && bookingData.doctor) {
            void fetchDoctorDateAvailability(bookingData.doctor)
        }
    }, [bookingStage, bookingData.doctor, fetchDoctorDateAvailability])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const addMessage = (text: string, sender: 'bot' | 'user') => {
        setMessages((prev) => [...prev, { id: Date.now() + Math.random(), sender, text }])
    }

    const pushMessage = (text: string, sender: 'bot' | 'user') => {
        addMessage(text, sender)
    }

    const formatSummary = (data: ConversationData) => {
        const formattedDate = data.date ? format(toLocalDate(data.date) ?? new Date(), 'dd MMMM yyyy') : '—'

        return [
            `${t.summaryPatient}: ${data.name || '—'}`,
            `${t.summaryAge}: ${data.age || '—'}`,
            `${t.summaryGender}: ${data.gender || '—'}`,
            `${t.summaryMobile}: +91 ${data.mobile || '—'}`,
            `${t.summaryLocation}: ${data.location || '—'}`,
            `${t.summaryReason}: ${data.symptoms || '—'}`,
            `${t.summaryDepartment}: ${data.department || '—'}`,
            `${t.summaryDoctor}: ${data.doctor || '—'}`,
            `${t.summaryDate}: ${formattedDate}`,
            `${t.summaryTime}: ${data.time || '—'}`,
        ].join('\n')
    }

    const promptForStage = (stage: BookingStage) => {
        setBookingStage(stage)

        if (stage !== 'date') {
            setIsDateCalendarOpen(false)
        }

        switch (stage) {
            case 'name':
                pushMessage(t.bookingStart, 'bot')
                return
            case 'age':
                pushMessage(t.askAge, 'bot')
                return
            case 'gender':
                setBookingButtons([
                    { label: t.genderOptions[0], value: 'Male' },
                    { label: t.genderOptions[1], value: 'Female' },
                    { label: t.genderOptions[2], value: 'Other' },
                ])
                pushMessage(t.askGender, 'bot')
                return
            case 'mobile':
                setBookingButtons([])
                pushMessage(t.askMobile, 'bot')
                return
            case 'location':
                pushMessage(t.askLocation, 'bot')
                return
            case 'symptoms':
                pushMessage(t.askSymptoms, 'bot')
                return
            case 'recommendation': {
                const recommendedDepartment = bookingData.department || 'General Medicine'
                setBookingButtons([
                    { label: t.recommendationContinue, value: 'continue_recommendation' },
                    { label: t.recommendationAnother, value: 'choose_another_department' },
                ])
                pushMessage(`${t.recommendationTitle}\n\n${t.recommendationMessage.replace('{department}', recommendedDepartment)}`, 'bot')
                return
            }
            case 'department':
                setBookingButtons(DEPARTMENTS.map((department) => ({ label: department, value: department })))
                pushMessage(t.askDepartment, 'bot')
                return
            case 'doctor': {
                const doctors = getDoctorsByDepartment(bookingData.department)
                if (!doctors.length) {
                    setBookingButtons([{ label: t.recommendationAnother, value: 'choose_another_department' }])
                    pushMessage(t.noDoctorAvailable, 'bot')
                    return
                }
                setBookingButtons(doctors.map((doctor) => ({ label: doctor.name, value: doctor.name })))
                pushMessage(`${t.doctorsInDepartment} ${bookingData.department}:`, 'bot')
                return
            }
            case 'date':
                setBookingButtons([])
                setIsDateCalendarOpen(true)
                pushMessage(t.askDate, 'bot')
                if (bookingData.doctor) {
                    void fetchDoctorDateAvailability(bookingData.doctor)
                }
                return
            case 'time': {
                setBookingButtons(availableSlots.map((slot) => ({ label: slot, value: slot })))
                pushMessage(t.askTime, 'bot')
                return
            }
            case 'summary':
                setBookingButtons([
                    { label: t.confirm, value: 'confirm' },
                    { label: t.changeDetails, value: 'change' },
                ])
                pushMessage(`${t.summaryTitle}\n\n${formatSummary(bookingData)}\n\n${t.askConfirm}`, 'bot')
                return
            default:
                return
        }
    }

    const startBookingFlow = () => {
        setBookingData(initialData)
        setBookingButtons([])
        setAvailableSlots([])
        setSubmitUrl('')
        setDateAvailabilityMap({})
        setBookingStage('name')
        pushMessage(t.bookingStart, 'user')
        pushMessage(t.bookingStart, 'bot')
    }

    const fetchAvailableSlots = async (date: string, doctorName: string) => {
        if (!date || !doctorName) return []

        try {
            const response = await fetch(`/api/appointments?date=${encodeURIComponent(date)}&doctor=${encodeURIComponent(doctorName)}&slots_only=true`)
            const payload = await response.json()
            if (!response.ok) return []
            const bookedSlots: string[] = payload.bookedSlots || []

            const doc = DOCTORS.find((d) => d.name === doctorName)
            const docSlots = doc?.timeSlots || DEFAULT_TIME_SLOTS

            const selectedDate = toLocalDate(date)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const filtered = docSlots.filter((slot) => {
                if (bookedSlots.includes(slot)) return false
                if (selectedDate && selectedDate.getTime() === today.getTime()) {
                    const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes()
                    return timeSlotToMinutes(slot) > currentMinutes
                }
                return true
            })

            setAvailableSlots(filtered)
            return filtered
        } catch {
            return []
        }
    }

    const handleDateSelection = async (dateValue: string) => {
        if (!dateValue || !isValidBookingDate(dateValue)) {
            pushMessage(t.invalidDateSelection, 'bot')
            setIsDateCalendarOpen(true)
            return
        }

        const formattedDate = format(toLocalDate(dateValue) ?? new Date(), 'dd MMM yyyy')

        const slots = await fetchAvailableSlots(dateValue, bookingData.doctor)

        if (!slots.length) {
            setBookingData((prev) => ({ ...prev, date: '' }))
            setBookingStage('date')
            setIsDateCalendarOpen(true)
            pushMessage(`Sorry, there are no available appointments for Dr. ${bookingData.doctor} on ${formattedDate}. Please select another date.`, 'bot')
            return
        }

        pushMessage(dateValue, 'user')
        setBookingData((prev) => ({ ...prev, date: dateValue }))
        setIsDateCalendarOpen(false)
        setBookingStage('time')
        setBookingButtons(slots.map((slot) => ({ label: slot, value: slot })))
        pushMessage(`${t.slotSummary} ${formattedDate}.`, 'bot')
        pushMessage(t.slotPrompt, 'bot')
    }

    const handleCalendarDateSelect = async (date: Date | undefined) => {
        if (!date) {
            setBookingData((prev) => ({ ...prev, date: '' }))
            return
        }

        const isoDate = format(date, 'yyyy-MM-dd')

        if (dateAvailabilityMap && isoDate in dateAvailabilityMap && !dateAvailabilityMap[isoDate]) {
            const formattedDate = format(date, 'dd MMM yyyy')
            pushMessage(`Sorry, there are no available appointments for Dr. ${bookingData.doctor} on ${formattedDate}. Please select another date.`, 'bot')
            setIsDateCalendarOpen(true)
            return
        }

        await handleDateSelection(isoDate)
    }

    const handleBookingResponse = async (rawInput: string) => {
        const input = rawInput.trim()

        if (bookingStage === 'name') {
            if (input.length < 2) {
                pushMessage(t.bookingError, 'bot')
                return
            }
            setBookingData((prev) => ({ ...prev, name: input }))
            pushMessage(input, 'user')
            setBookingStage('age')
            pushMessage(t.askAge, 'bot')
            return
        }

        if (bookingStage === 'age') {
            const parsedAge = Number(input.replace(/\D/g, ''))
            if (!parsedAge || parsedAge < 14 || parsedAge > 90) {
                pushMessage(t.invalidAge, 'bot')
                return
            }
            setBookingData((prev) => ({ ...prev, age: String(parsedAge) }))
            pushMessage(input, 'user')
            setBookingStage('gender')
            setBookingButtons([
                { label: t.genderOptions[0], value: 'Male' },
                { label: t.genderOptions[1], value: 'Female' },
                { label: t.genderOptions[2], value: 'Other' },
            ])
            pushMessage(t.askGender, 'bot')
            return
        }

        if (bookingStage === 'gender') {
            const parsed = parseGender(input)
            if (!parsed) {
                pushMessage(t.askGender, 'bot')
                return
            }
            setBookingData((prev) => ({ ...prev, gender: parsed }))
            pushMessage(input, 'user')
            setBookingStage('mobile')
            pushMessage(t.askMobile, 'bot')
            return
        }

        if (bookingStage === 'mobile') {
            const sanitized = input.replace(/\D/g, '').slice(0, 10)
            if (!/^[6-9]\d{9}$/.test(sanitized)) {
                pushMessage(t.invalidMobile, 'bot')
                return
            }
            setBookingData((prev) => ({ ...prev, mobile: sanitized }))
            pushMessage(input, 'user')
            setBookingStage('location')
            pushMessage(t.askLocation, 'bot')
            return
        }

        if (bookingStage === 'location') {
            setBookingData((prev) => ({ ...prev, location: input || '' }))
            pushMessage(input || t.skipOptional, 'user')
            setBookingStage('symptoms')
            pushMessage(t.askSymptoms, 'bot')
            return
        }

        if (bookingStage === 'symptoms') {
            const notes = input || ''
            const previousSymptoms = bookingData.symptoms?.trim()
            setBookingData((prev) => ({ ...prev, symptoms: notes }))
            pushMessage(notes || t.skipOptional, 'user')

            if (!notes.trim()) {
                setBookingStage('department')
                setBookingButtons(DEPARTMENTS.map((department) => ({ label: department, value: department })))
                pushMessage(t.askDepartment, 'bot')
                return
            }

            if (detectEmergencySymptoms(notes)) {
                setBookingData((prev) => ({ ...prev, department: 'General Medicine' }))
                setBookingStage('recommendation')
                setBookingButtons([
                    { label: t.recommendationContinue, value: 'continue_recommendation' },
                    { label: t.recommendationAnother, value: 'choose_another_department' },
                ])
                pushMessage(t.emergencyWarning, 'bot')
                pushMessage(`${t.recommendationTitle}\n\n${t.recommendationMessage.replace('{department}', 'General Medicine')}`, 'bot')
                return
            }

            const suggested = detectDepartmentFromSymptoms(notes)

            if (!suggested) {
                if (previousSymptoms) {
                    setBookingData((prev) => ({ ...prev, department: 'General Medicine' }))
                    setBookingStage('recommendation')
                    setBookingButtons([
                        { label: t.recommendationContinue, value: 'continue_recommendation' },
                        { label: t.recommendationAnother, value: 'choose_another_department' },
                    ])
                    pushMessage(t.fallbackGeneralMedicine, 'bot')
                    pushMessage(`${t.recommendationTitle}\n\n${t.recommendationMessage.replace('{department}', 'General Medicine')}`, 'bot')
                    return
                }

                setBookingStage('symptoms')
                setBookingButtons([])
                pushMessage(t.requestMoreDetails, 'bot')
                return
            }

            setBookingData((prev) => ({ ...prev, department: suggested }))
            setBookingStage('recommendation')
            setBookingButtons([
                { label: t.recommendationContinue, value: 'continue_recommendation' },
                { label: t.recommendationAnother, value: 'choose_another_department' },
            ])
            pushMessage(`${t.recommendationTitle}\n\n${t.recommendationMessage.replace('{department}', suggested)}`, 'bot')
            return
        }

        if (bookingStage === 'department') {
            const selectedDepartment = parseDepartment(input) || input
            if (!selectedDepartment || !DEPARTMENTS.includes(selectedDepartment as never)) {
                pushMessage(t.invalidDepartment, 'bot')
                return
            }
            setBookingData((prev) => ({ ...prev, department: selectedDepartment }))
            pushMessage(selectedDepartment, 'user')
            setBookingStage('doctor')
            const doctors = getDoctorsByDepartment(selectedDepartment)
            if (!doctors.length) {
                setBookingButtons([{ label: t.recommendationAnother, value: 'choose_another_department' }])
                pushMessage(t.noDoctorAvailable, 'bot')
                return
            }
            setBookingButtons(doctors.map((doctor) => ({ label: doctor.name, value: doctor.name })))
            pushMessage(`${t.doctorsInDepartment} ${selectedDepartment}:`, 'bot')
            return
        }

        if (bookingStage === 'doctor') {
            const doctorName = parseDoctor(input) || input
            if (!doctorName) {
                pushMessage(t.doctorNotFound, 'bot')
                return
            }
            setBookingData((prev) => ({ ...prev, doctor: doctorName }))
            pushMessage(doctorName, 'user')
            setBookingStage('date')
            setIsDateCalendarOpen(true)
            pushMessage(t.askDate, 'bot')
            void fetchDoctorDateAvailability(doctorName)
            return
        }

        if (bookingStage === 'date') {
            if (!input || !isValidBookingDate(input)) {
                pushMessage('Please select a valid appointment date.', 'bot')
                return
            }
            await handleDateSelection(input)
            return
        }

        if (bookingStage === 'time') {
            if (!input || !availableSlots.includes(input)) {
                pushMessage(t.askTime, 'bot')
                return
            }
            setBookingData((prev) => ({ ...prev, time: input }))
            pushMessage(input, 'user')
            setBookingStage('summary')
            setBookingButtons([
                { label: t.confirm, value: 'confirm' },
                { label: t.changeDate, value: 'change_date' },
                { label: t.changeTime, value: 'change_time' },
            ])
            pushMessage(`${t.summaryTitle}\n\n${formatSummary({ ...bookingData, time: input })}\n\n${t.askConfirm}`, 'bot')
            return
        }
    }

    const handleBookingButton = async (value: string) => {
        if (value === 'confirm') {
            const slotStillAvailable = async () => {
                if (!bookingData.date || !bookingData.doctor || !bookingData.time) {
                    return { isAvailable: false, latestSlots: [] }
                }
                const latestSlots = await fetchAvailableSlots(bookingData.date, bookingData.doctor)
                return { isAvailable: latestSlots.includes(bookingData.time), latestSlots }
            }

            const { isAvailable, latestSlots } = await slotStillAvailable()

            if (!isAvailable) {
                setBookingStage('time')
                setBookingButtons(latestSlots.map((slot) => ({ label: slot, value: slot })))
                pushMessage('Sorry, this time slot is no longer available. Please choose another available slot.', 'bot')
                return
            }

            const payload = {
                patientName: bookingData.name,
                phoneNumber: bookingData.mobile,
                age: bookingData.age,
                gender: bookingData.gender,
                department: bookingData.department,
                doctor: bookingData.doctor,
                preferredDate: bookingData.date,
                preferredTime: bookingData.time,
                reason: bookingData.symptoms,
                place: bookingData.location,
                language,
            }

            setIsSubmitting(true)
            pushMessage(t.confirm, 'user')

            try {
                const response = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
                const result = await response.json()

                if (!response.ok || !result.success) {
                    const message = String(result?.message || 'Appointment submission failed')
                    if (/already booked|slot.*available|no longer available|duplicate/i.test(message)) {
                        pushMessage('Sorry, this time slot is no longer available. Please choose another available slot.', 'bot')
                        setBookingStage('time')
                        setBookingButtons([])
                        if (bookingData.date && bookingData.doctor) {
                            await fetchAvailableSlots(bookingData.date, bookingData.doctor)
                        }
                        return
                    }
                    throw new Error(message)
                }

                const referenceId = result.referenceId || result.appointment?.id || 'N/A'
                const url = result.hospitalWhatsAppUrl || buildWhatsAppUrl(HOSPITAL_PHONE, `Appointment reference: ${referenceId}`)
                setSubmitUrl(url)
                setBookingStage('success')
                setBookingButtons([{ label: t.openWhatsApp, value: 'whatsapp' }])
                pushMessage(`${t.successTitle}\n\n${t.summaryPatient}: ${bookingData.name}\n${t.summaryDate}: ${bookingData.date}\n${t.summaryTime}: ${bookingData.time}\n${t.summaryDepartment}: ${bookingData.department}\n${t.summaryDoctor}: ${bookingData.doctor}\nReference ID: ${referenceId}`, 'bot')
            } catch (error) {
                const message = error instanceof Error ? error.message : t.defaultFallback
                pushMessage(`Submission failed: ${message}`, 'bot')
            } finally {
                setIsSubmitting(false)
            }
            return
        }

        if (value === 'continue_recommendation') {
            const selectedDepartment = bookingData.department || 'General Medicine'
            const doctors = getDoctorsByDepartment(selectedDepartment)
            if (!doctors.length) {
                setBookingStage('department')
                setBookingButtons(DEPARTMENTS.map((department) => ({ label: department, value: department })))
                pushMessage(t.noDoctorAvailable, 'bot')
                pushMessage(t.askDepartment, 'bot')
                return
            }
            setBookingStage('doctor')
            setBookingButtons(doctors.map((doctor) => ({ label: doctor.name, value: doctor.name })))
            pushMessage(`${t.doctorsInDepartment} ${selectedDepartment}:`, 'bot')
            return
        }

        if (value === 'choose_another_department') {
            setBookingButtons([])
            setBookingStage('department')
            pushMessage(t.recommendationAnother, 'user')
            setBookingButtons(DEPARTMENTS.map((department) => ({ label: department, value: department })))
            pushMessage(t.askDepartment, 'bot')
            return
        }

        if (value === 'change_date') {
            setBookingButtons([])
            setBookingStage('date')
            pushMessage(t.changeDate, 'user')
            pushMessage(t.askDate, 'bot')
            return
        }

        if (value === 'change_time') {
            if (!bookingData.date || !bookingData.doctor) {
                pushMessage('Please select a valid doctor and date first.', 'bot')
                return
            }
            setBookingButtons([])
            setBookingStage('time')
            await fetchAvailableSlots(bookingData.date, bookingData.doctor)
            return
        }

        if (value === 'choose_another_date') {
            setBookingButtons([])
            setBookingStage('date')
            pushMessage(t.chooseAnotherDate, 'user')
            pushMessage(t.askDate, 'bot')
            return
        }

        if (value === 'whatsapp') {
            if (submitUrl) {
                window.open(submitUrl, '_blank', 'noopener,noreferrer')
            }
            return
        }

        await handleBookingResponse(value)
    }

    const handleSend = async () => {
        if (!inputValue.trim()) return
        const currentValue = inputValue.trim()
        setInputValue('')

        if (bookingStage === 'idle' || bookingStage === 'success') {
            addMessage(currentValue, 'user')
            const reply = getBotReply(currentValue, language)
            addMessage(reply, 'bot')
            return
        }

        await handleBookingResponse(currentValue)
    }

    const handleQuickAction = (action: string) => {
        const normalized = action.toLowerCase()
        const isAppointmentAction = /appointment|అపాయింట్మెంట్|అపాయింట్|బుక్|अपॉइंटमेंट|अपॉइंट|बुक/i.test(normalized)
        const isDoctorAction = /doctor|డాక్టర్|डॉक्टर/i.test(normalized)
        const isDepartmentAction = /department|విభాగం|विभाग/i.test(normalized)
        const isFeeAction = /fee|fees|cost|price|ఫీ|कीमत|फीस|दर/i.test(normalized)
        const isTimingAction = /timing|time|open|hours|సమయం|టైమింగ్|తెరుస్తుంది|समय|खुला|घंटे/i.test(normalized)
        const isLocationAction = /location|address|map|where|స్థానం|చిరునామా|మ్యాప్|स्थान|पता|मैप/i.test(normalized)
        const isContactAction = /contact|call|phone|reach|కాంటాక్|ఫోన్|కాల్|संपर्क|फोन|कॉल/i.test(normalized)

        if (isAppointmentAction) {
            startBookingFlow()
            return
        }
        if (isDoctorAction) {
            pushMessage(action, 'user')
            pushMessage(formatDoctorList(language), 'bot')
            return
        }
        if (isDepartmentAction) {
            pushMessage(action, 'user')
            pushMessage(formatDepartmentList(language), 'bot')
            return
        }
        if (isFeeAction) {
            pushMessage(action, 'user')
            pushMessage(t.fee, 'bot')
            return
        }
        if (isTimingAction) {
            pushMessage(action, 'user')
            pushMessage(t.timings, 'bot')
            return
        }
        if (isLocationAction) {
            pushMessage(action, 'user')
            pushMessage(`${t.location}\n\n${t.directions}`, 'bot')
            return
        }
        if (isContactAction) {
            pushMessage(action, 'user')
            pushMessage(t.contact, 'bot')
            return
        }
        pushMessage(action, 'user')
        pushMessage(getBotReply(action, language), 'bot')
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen ? (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label={t.openAssistant}
                    title={t.openAssistant}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0d5d5d] text-white shadow-[0_10px_30px_rgba(13,93,93,0.35)] transition-transform duration-200 hover:scale-105"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            ) : (
                <div className="w-[calc(100vw-1.5rem)] max-w-[400px] overflow-hidden rounded-[24px] border border-[#d9f3ee] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
                    <div className="flex items-center justify-between bg-[#0a6c68] px-4 py-3 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dff7f5] text-[#0a6c68]">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{t.header}</p>
                                <div className="flex items-center gap-1.5 text-[10px] text-emerald-100">
                                    <span className="h-2 w-2 rounded-full bg-[#3fe37a]" />
                                    {t.online}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label={t.closeChat}
                            title={t.closeChat}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="border-b border-[#e5f0ee] bg-[#f2fbf9] px-3 py-2">
                        <label className="flex items-center gap-2 text-[11px] font-medium text-[#0f766e]">
                            <Languages className="h-3.5 w-3.5" />
                            {t.language}
                        </label>
                        <select
                            value={language}
                            onChange={(event) => {
                                const nextLanguage = event.target.value as Language
                                setLanguage(nextLanguage)
                                if (bookingStage !== 'idle' && bookingStage !== 'success') {
                                    pushMessage(translations[nextLanguage].bookingStart, 'bot')
                                }
                            }}
                            className="mt-1 w-full rounded-lg border border-[#d9f3ee] bg-white px-2 py-1.5 text-xs text-slate-700 outline-none"
                        >
                            <option value="en">English</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="hi">हिन्दी (Hindi)</option>
                        </select>
                    </div>

                    <div className="max-h-[440px] overflow-y-auto bg-[#f5fbfb] px-3 py-3" ref={scrollRef}>
                        <div className="space-y-3">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm ${message.sender === 'user' ? 'bg-[#0f9d8f] text-white' : 'bg-white text-slate-700'}`}>
                                        <div className="whitespace-pre-line text-[13px] leading-5">{message.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-[#e5f0ee] bg-white p-3">
                        {bookingStage === 'date' && (
                            <div className="mb-3 rounded-xl border border-[#dfe9e8] bg-[#f8fbfb] p-2">
                                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-[#0f5e5b]">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    {t.askDate}
                                </div>

                                {isLoadingAvailability && (
                                    <div className="mb-2 flex items-center justify-center gap-2 text-xs font-medium text-[#0f766e]">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Checking doctor availability...
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setIsDateCalendarOpen((prev) => !prev)}
                                    className="flex w-full items-center justify-between rounded-lg border border-[#dfe9e8] bg-white px-2.5 py-2 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#0f9d8f]"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <span aria-hidden="true">📅</span>
                                        {bookingData.date ? format(toLocalDate(bookingData.date) ?? new Date(), 'dd MMM yyyy') : t.selectAppointmentDate}
                                    </span>
                                    <span className="text-xs text-slate-500">{isDateCalendarOpen ? t.hide : t.open}</span>
                                </button>

                                {isDateCalendarOpen && (
                                    <div className="mt-3 overflow-hidden rounded-xl border border-[#dfe9e8] bg-white p-2 shadow-md">
                                        <Calendar
                                            mode="single"
                                            selected={bookingData.date ? toLocalDate(bookingData.date) ?? undefined : undefined}
                                            month={bookingData.date ? toLocalDate(bookingData.date) ?? new Date() : new Date()}
                                            onMonthChange={(date) => {
                                                if (date) {
                                                    const next = new Date(date)
                                                    next.setHours(0, 0, 0, 0)
                                                    return next
                                                }
                                                return date
                                            }}
                                            onSelect={async (date) => {
                                                await handleCalendarDateSelect(date)
                                            }}
                                            disabled={(date) => {
                                                const today = new Date()
                                                today.setHours(0, 0, 0, 0)
                                                const maxDate = addDays(today, 30)
                                                const value = new Date(date)
                                                value.setHours(0, 0, 0, 0)
                                                if (value < today || value > maxDate) return true
                                                if (isLoadingAvailability) return true
                                                const dateStr = format(value, 'yyyy-MM-dd')
                                                if (dateAvailabilityMap && dateStr in dateAvailabilityMap) {
                                                    return !dateAvailabilityMap[dateStr]
                                                }
                                                return true
                                            }}
                                            className="mx-auto w-full max-w-[300px]"
                                            classNames={{
                                                months: 'flex w-full justify-center',
                                                month: 'space-y-3',
                                                table: 'w-full border-collapse space-y-1',
                                                head_row: 'flex',
                                                head_cell: 'text-[10px] font-medium text-slate-500 w-8',
                                                row: 'mt-2 flex w-full',
                                                cell: 'relative flex w-8 items-center justify-center p-0',
                                                day: 'h-8 w-8 rounded-md text-xs font-medium text-slate-700 hover:bg-[#ecfbf8] aria-selected:bg-[#0f9d8f] aria-selected:text-white',
                                                day_selected: 'bg-[#0f9d8f] text-white hover:bg-[#0c8d80]',
                                                day_today: 'border border-[#0f9d8f] text-[#0f5e5b]',
                                                day_outside: 'text-slate-300',
                                                day_disabled: 'text-slate-300 opacity-60',
                                                caption_label: 'text-sm font-semibold text-slate-700',
                                                nav_button: 'h-7 w-7 rounded-md border border-[#dfe9e8] bg-white text-slate-600 hover:bg-[#ecfbf8]',
                                                nav: 'flex items-center justify-between px-1',
                                            }}
                                        />

                                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#eef4f3] pt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const today = new Date()
                                                    today.setHours(0, 0, 0, 0)
                                                    void handleCalendarDateSelect(today)
                                                }}
                                                className="rounded-md border border-[#dfe9e8] bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-[#ecfbf8]"
                                            >
                                                {t.today}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setBookingData((prev) => ({ ...prev, date: '' }))
                                                    setIsDateCalendarOpen(false)
                                                }}
                                                className="rounded-md border border-[#dfe9e8] bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-[#ecfbf8]"
                                            >
                                                {t.clear}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {bookingStage === 'recommendation' && (
                            <div className="mb-3 rounded-2xl border border-[#dfe9e8] bg-gradient-to-br from-[#f5fffe] to-[#effaf7] p-3 shadow-sm">
                                <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f5e5b]">
                                    <span aria-hidden="true">🩺</span>
                                    {t.recommendationTitle}
                                </div>
                                <div className="text-lg font-bold text-slate-800">{bookingData.department || 'General Medicine'}</div>
                                <p className="mt-2 text-[12px] leading-5 text-slate-600">
                                    {t.recommendationMessage.replace('{department}', bookingData.department || 'General Medicine')}
                                </p>
                            </div>
                        )}

                        {bookingButtons.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-2">
                                {bookingButtons.map((button) => (
                                    <button
                                        key={button.value}
                                        type="button"
                                        onClick={() => void handleBookingButton(button.value)}
                                        className="rounded-full border border-[#cfeae7] bg-[#ecfbf8] px-2.5 py-1 text-[11px] font-medium text-[#0f5e5b] transition hover:bg-[#dff8f3]"
                                    >
                                        {button.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {!bookingButtons.length && bookingStage !== 'date' && (
                            <div className="mb-2 flex flex-wrap gap-2">
                                {quickActions.map((action) => (
                                    <button
                                        key={action}
                                        type="button"
                                        onClick={() => handleQuickAction(action)}
                                        className="rounded-full border border-[#cfeae7] bg-[#ecfbf8] px-2.5 py-1 text-[11px] font-medium text-[#0f5e5b] transition hover:bg-[#dff8f3]"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}

                        {bookingStage === 'success' && submitUrl && (
                            <div className="mb-2">
                                <button
                                    type="button"
                                    onClick={() => window.open(submitUrl, '_blank', 'noopener,noreferrer')}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1aa949]"
                                >
                                    <Phone className="h-3.5 w-3.5" />
                                    {t.openWhatsApp}
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2 rounded-xl border border-[#dfe9e8] bg-[#f9fbfb] px-2.5 py-2">
                            <input
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault()
                                        void handleSend()
                                    }
                                }}
                                placeholder={t.placeholder}
                                className="flex-1 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                onClick={() => void handleSend()}
                                disabled={!inputValue.trim() || isSubmitting}
                                aria-label={t.send}
                                title={t.send}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0f9d8f] text-white transition hover:bg-[#0c8d80] disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                <SendHorizonal className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-2 flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    const url = buildWhatsAppUrl(HOSPITAL_PHONE, 'Hi, I would like to know more about the hospital.')
                                    window.open(url, '_blank', 'noopener,noreferrer')
                                }}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1aa949]"
                            >
                                <Phone className="h-3.5 w-3.5" />
                                {t.whatsappAction}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    window.open(MAPS_URL, '_blank', 'noopener,noreferrer')
                                }}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#cfeae7] bg-[#ecfbf8] px-3 py-2 text-xs font-semibold text-[#0f5e5b] transition hover:bg-[#dff8f3]"
                            >
                                <MapPin className="h-3.5 w-3.5" />
                                {t.directions}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
