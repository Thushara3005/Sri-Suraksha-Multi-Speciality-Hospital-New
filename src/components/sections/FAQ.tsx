"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is the Consultation Fee?",
    answer:
      "Our consultation fees are affordable and transparent. Please contact our reception for detailed fee information. We accept cash and all major payment methods.",
  },
  {
    question: "What are the Hospital's available timings?",
    answer:
      "Sri Suraksha Multi Speciality Hospital is open 24 hours, 7 days a week. Emergency services are available around the clock. We recommend booking an appointment in advance for consultations.",
  },
  {
    question: "What services are provided at Sri Suraksha Multi Speciality Hospital?",
    answer:
      "We provide comprehensive medical services including General Medicine, Gynecology, and a fully equipped Diagnostics Laboratory. Our hospital is open 24/7 with emergency services always available.",
  },
  {
    question: "Do I need to make an appointment before my visit?",
    answer:
      "It is preferable to book an appointment in advance to minimize wait times. However, walk-ins are also accommodated. In case of emergency, please visit directly or call our reception at 9014759130.",
  },
  {
    question: "How can I contact the Hospital in case of emergency?",
    answer:
      "Our hospital is open 24 hours, 7 days a week with emergency services available around the clock. You can call our reception at 9014759130 anytime. Walk-in emergencies are immediately attended to.",
  },
  {
    question: "Are Lab and Diagnostics services available at your hospital?",
    answer:
      "Yes, we have a fully equipped Diagnostics Laboratory offering comprehensive blood tests, pathology, ultrasound, and imaging services. Results are provided with accurate and timely reporting.",
  },
  {
    question: "Can I schedule a video consultation?",
    answer:
      "Yes, we offer teleconsultation services. Please contact us via WhatsApp to schedule a video consultation. Our team will coordinate a convenient time for your virtual appointment.",
  },
  {
    question: "What types of doctors are available at Sri Suraksha?",
    answer:
      "We have Dr. Ramesh Reddy (MBBS, MD - General Physician, Diabetologist & Critical Care) and Dr. Triveni Reddy (MBBS, MS Obs & Gyn - Infertility & Laparoscopic Surgeon), each with over 12 years of clinical experience.",
  },
];

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal-600 font-semibold text-xs sm:text-sm tracking-wider uppercase">
            FAQs
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mt-2 sm:mt-3 font-[family-name:var(--font-inter)]">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 leading-relaxed">
            Find answers to common questions about our services, appointments,
            and patient care.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-6 max-w-6xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? "border-teal-200 bg-teal-50/50 shadow-lg"
                  : "border-gray-100 bg-white hover:border-teal-100 hover:shadow-md"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-start justify-between gap-3 sm:gap-4 p-4 sm:p-6 text-left"
                aria-expanded={openIndex === index}
              >
                <span
                  className={`font-semibold transition-colors text-sm sm:text-base ${
                    openIndex === index
                      ? "text-teal-700"
                      : "text-gray-800"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                    openIndex === index
                      ? "bg-teal-600 text-white rotate-0"
                      : "bg-teal-100 text-teal-600"
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
