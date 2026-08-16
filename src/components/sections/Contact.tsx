"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  User,
  List,
  Pencil,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const HOSPITAL_PHONE = "93909 89540";
const HOSPITAL_PHONE_LINK = "+919390989540";
const HOSPITAL_ADDRESS =
  "Gaddam Linga Reddy Complex, Metpally, Jagtial District, Telangana";
const WHATSAPP_URL = "https://wa.me/919390989540";

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Appointment",
  "Billing & Fees",
  "Emergency",
  "Feedback",
  "Other",
];

function MedicalCross({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ContactInfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group flex items-start gap-4 rounded-2xl border border-teal-100/80 bg-teal-50/80 p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-100/60 sm:p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm transition-all duration-300 group-hover:scale-110">
        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-gray-900 text-sm sm:text-base">{title}</p>
        <div className="mt-1.5 text-gray-600 text-sm sm:text-[15px] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

function IconInput({
  id,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  required,
}: {
  id: string;
  name: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-11 rounded-xl border-gray-200 bg-white pl-10 text-sm shadow-none focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
      />
    </div>
  );
}

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    const whatsappMessage = `Hi, I'd like to contact Sri Suraksha Hospital.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/919390989540?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="contact" className="overflow-x-clip bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/60">
        <MedicalCross className="pointer-events-none absolute left-[8%] top-6 h-8 w-8 text-teal-100/80 sm:top-8 sm:h-10 sm:w-10" />
        <MedicalCross className="pointer-events-none absolute right-[18%] top-8 h-10 w-10 text-teal-100/60 sm:top-12 sm:h-12 sm:w-12" />
        <MedicalCross className="pointer-events-none absolute bottom-6 left-[22%] h-7 w-7 text-teal-100/70 sm:bottom-8 sm:h-8 sm:w-8" />
        <MedicalCross className="pointer-events-none absolute bottom-8 right-[10%] h-9 w-9 text-teal-100/50 sm:bottom-10 sm:h-10 sm:w-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(13,148,136,0.06),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.05),transparent_40%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-stretch gap-5 px-4 py-8 sm:gap-6 sm:px-6 sm:py-9 md:flex-row md:items-center md:justify-between md:gap-8 lg:min-h-[300px] lg:px-8 lg:py-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full min-w-0 md:max-w-[55%] lg:max-w-[58%]"
          >
            <div className="mb-2 flex items-center gap-3 sm:mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600 sm:text-sm">
                Contact Us
              </span>
              <span className="h-px w-10 bg-teal-500 sm:w-14" />
            </div>
            <h1 className="font-[family-name:var(--font-inter)] text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              We&apos;re Here to Help You
            </h1>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-gray-600 sm:mt-3 sm:text-lg">
              Have questions or need assistance? Reach out to us.
              <br className="hidden sm:block" />
              Our team is ready to assist you 24/7.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full min-w-0 shrink-0 md:w-[42%] lg:w-[42%]"
          >
            <div className="relative aspect-[16/6] w-full max-w-full overflow-hidden rounded-xl shadow-md ring-1 ring-teal-100/80 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-6px_rgba(13,148,136,0.28),0_16px_40px_-10px_rgba(15,23,42,0.12),0_0_20px_rgba(13,148,136,0.14)] md:max-h-[210px]">
              <Image
                src="/images/contact-hospital.png"
                alt="Sri Suraksha Multi Speciality Hospital building, Metpally"
                fill
                className="object-cover object-[center_45%]"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main contact section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_8px_40px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_48px_rgba(15,23,42,0.1)] sm:p-8 lg:p-10"
          >
            <h2 className="font-[family-name:var(--font-inter)] text-2xl font-bold text-slate-900 sm:text-3xl">
              Send Us a Message
            </h2>
            <div className="mb-6 mt-2 h-0.5 w-12 rounded-full bg-teal-500" />
            <p className="mb-8 text-sm text-gray-500 sm:text-base">
              Fill out the form below and we&apos;ll get back to you as soon as
              possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="name">Your Name *</FieldLabel>
                  <IconInput
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    icon={User}
                    required
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
                  <IconInput
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    icon={Phone}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="email">Email Address *</FieldLabel>
                  <IconInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    icon={Mail}
                    required
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="subject">Subject *</FieldLabel>
                  <div className="relative">
                    <List className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <select
                      id="subject"
                      name="subject"
                      required
                      defaultValue=""
                      className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-700 shadow-none outline-none focus:border-teal-500 focus:ring-[3px] focus:ring-teal-500/20"
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>
                      {SUBJECT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      ▾
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="message">Message *</FieldLabel>
                <div className="relative">
                  <Pencil className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your message here..."
                    required
                    rows={5}
                    className="min-h-[140px] resize-y rounded-xl border-gray-200 bg-white pl-10 pt-3 text-sm shadow-none focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200/60 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-200/80 sm:text-base"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Get In Touch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="font-[family-name:var(--font-inter)] text-2xl font-bold text-slate-900 sm:text-3xl">
              Get In Touch
            </h2>
            <div className="mb-6 mt-2 h-0.5 w-12 rounded-full bg-teal-500" />

            <div className="space-y-4 sm:space-y-5">
              <ContactInfoCard icon={Phone} title="Phone">
                <a
                  href={`tel:${HOSPITAL_PHONE_LINK}`}
                  className="block font-medium text-teal-700 transition-colors hover:text-teal-800"
                >
                  {HOSPITAL_PHONE}
                </a>
              </ContactInfoCard>

              <ContactInfoCard icon={WhatsAppIcon} title="WhatsApp">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-medium text-teal-700 transition-colors hover:text-teal-800"
                >
                  {HOSPITAL_PHONE}
                </a>
              </ContactInfoCard>

              <ContactInfoCard icon={MapPin} title="Location">
                <p>{HOSPITAL_ADDRESS}</p>
              </ContactInfoCard>

              <ContactInfoCard icon={Clock} title="Working Hours">
                <p>Monday – Sunday</p>
                <p className="mt-1 font-semibold text-teal-700">
                  Open 24/7 (Emergency Services)
                </p>
              </ContactInfoCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
