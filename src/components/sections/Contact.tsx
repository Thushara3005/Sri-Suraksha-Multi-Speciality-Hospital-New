"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    const whatsappMessage = `Hi, I'd like to book an appointment.\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/917947118058?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 lg:py-28 bg-white relative overflow-hidden"
      ref={ref}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal-600 font-semibold text-xs sm:text-sm tracking-wider uppercase">
            Contact Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mt-2 sm:mt-3 font-[family-name:var(--font-inter)]">
            Book Your{" "}
            <span className="gradient-text">Appointment</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 leading-relaxed">
            Schedule a visit with our specialists. We are here to provide you
            with the best healthcare experience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2 space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-white shadow-xl"
              whileHover={{
                rotateY: 2,
                rotateX: -1,
                scale: 1.01,
                boxShadow: "0 25px 50px -12px rgba(13, 148, 136, 0.4)",
              }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            >
              <h3 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-inter)] mb-4 sm:mb-6">
                Get In Touch
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs sm:text-sm">Call Us</p>
                    <a
                      href="tel:07947118058"
                      className="text-teal-200 hover:text-white transition-colors text-sm"
                    >
                      07947118058
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs sm:text-sm">Locate Us</p>
                    <p className="text-teal-200 text-xs sm:text-sm">
                      Gaddam Linga Reddy Complex, Metpally, Jagtial
                      District, Telangana
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs sm:text-sm">Timings</p>
                    <p className="text-teal-200 text-xs sm:text-sm">
                      Open 24 Hours
                    </p>
                    <p className="text-teal-200 text-xs sm:text-sm">
                      Emergency Care Available 24/7
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <motion.a
                href="https://wa.me/917947118058"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 sm:mt-8 w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl py-2.5 sm:py-3 px-4 sm:px-6 font-semibold transition-colors shadow-lg text-sm sm:text-base"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98, y: 1 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-xl border border-gray-100 space-y-4 sm:space-y-6"
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-[family-name:var(--font-inter)]">
                Request an Appointment
              </h3>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    placeholder="Enter your full name"
                    required
                    className="rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Phone Number *
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                    className="rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Service Required
                </label>
                <select
                  name="service"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 text-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="">Select a service</option>
                  <option value="general">General Medicine</option>
                  <option value="gynecology">Gynecology</option>
                  <option value="diagnostics">Diagnostics Laboratory</option>
                  <option value="emergency">Emergency Care</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Message
                </label>
                <Textarea
                  name="message"
                  placeholder="Describe your health concern or query..."
                  rows={4}
                  className="rounded-xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 resize-none text-sm"
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="btn-3d w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-5 sm:py-6 text-sm sm:text-base font-semibold transition-all"
                >
                  Book Appointment
                </Button>
              </motion.div>

              <p className="text-[10px] sm:text-xs text-gray-400 text-center">
                By submitting this form, you agree to be contacted by our team
                for appointment scheduling.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
