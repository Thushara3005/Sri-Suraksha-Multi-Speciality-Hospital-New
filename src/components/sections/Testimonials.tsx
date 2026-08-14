"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Award, BedDouble, Clock, Stethoscope, Shield, Heart } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Best Multi-Speciality Hospital",
    description: "Recognized as one of the best multi-speciality hospitals in Jagtial District",
  },
  {
    icon: BedDouble,
    title: "220+ Bed Capacity",
    description: "Modern infrastructure with over 220 beds for comprehensive patient care",
  },
  {
    icon: Clock,
    title: "24/7 Emergency Care",
    description: "Round-the-clock emergency services ensuring timely treatment always",
  },
  {
    icon: Stethoscope,
    title: "Comprehensive Services",
    description: "General Medicine, Gynecology & Diagnostics Laboratory under one roof",
  },
];

export default function Testimonials() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleScrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="testimonials"
      className="py-12 sm:py-16 lg:py-28 bg-gradient-to-b from-teal-50 to-white"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal-600 font-semibold text-xs sm:text-sm tracking-wider uppercase">
            About Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mt-2 sm:mt-3 font-[family-name:var(--font-inter)]">
            Why Choose{" "}
            <span className="gradient-text">Sri Suraksha?</span>
          </h2>
        </motion.div>

        {/* Content + Feature Cards */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Left - Text Content */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              Sri Suraksha Multi Speciality Hospital is proud to be one of the{" "}
              <span className="font-semibold text-teal-700">
                Best Multi-Speciality Hospitals in Jagtial District
              </span>
              , providing trusted, compassionate, and affordable healthcare to the community. Conveniently located in{" "}
              <span className="font-semibold text-teal-700">Metpally</span>, we are committed to delivering high-quality medical care with a patient-first approach.
            </p>

            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              With a{" "}
              <span className="font-semibold text-teal-700">bed capacity of over 220 beds</span>, modern medical infrastructure, and experienced healthcare professionals including{" "}
              <span className="font-semibold text-teal-700">Dr. Ramesh Reddy (General Physician, Diabetologist & Critical Care)</span> and{" "}
              <span className="font-semibold text-teal-700">Dr. Triveni Reddy (Gynecologist, Infertility & Laparoscopic Surgeon)</span>, we offer comprehensive services. Our hospital also provides{" "}
              <span className="font-semibold text-teal-700">24/7 emergency care</span>, ensuring timely treatment whenever you need it.
            </p>

            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              At Sri Suraksha Multi Speciality Hospital, we combine advanced healthcare technology with compassionate care to help every patient achieve better health. Your well-being is our highest priority, making us a trusted destination for quality healthcare in{" "}
              <span className="font-semibold text-teal-700">Metpally and Jagtial District</span>.
            </p>

            <motion.a
              href="/bookAppointment"
              onClick={(e) => {
                e.preventDefault();
                router.push("/bookAppointment");
              }}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg shadow-teal-200 transition-all mt-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              Book an Appointment
            </motion.a>
          </motion.div>

          {/* Right - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                whileHover={{
                  rotateY: 3,
                  rotateX: -3,
                  scale: 1.03,
                  boxShadow: "0 20px 40px -12px rgba(13, 148, 136, 0.2), 0 0 0 1px rgba(13, 148, 136, 0.1)",
                }}
                transition2={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:border-teal-200"
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-md shadow-teal-100"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                </div>
                <h3
                  className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg font-[family-name:var(--font-inter)]"
                  style={{ transform: "translateZ(15px)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed"
                  style={{ transform: "translateZ(10px)" }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
