"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  HeartPulse,
  Microscope,
  Users,
  Clock,
  Award,
  BadgeCheck,
  HandHeart,
} from "lucide-react";
import { useTilt3D } from "@/hooks/use-tilt-3d";

const features = [
  {
    icon: Award,
    title: "12+ Years of Experience",
    description:
      "Dr. Ramesh Reddy and Dr. Triveni Reddy bring over 12 years of clinical expertise in General Medicine, Diabetology, Critical Care and Gynecology, handling cases with excellent outcomes.",
  },
  {
    icon: Microscope,
    title: "Advanced Diagnostics",
    description:
      "Fully equipped Diagnostics Laboratory with comprehensive blood tests, ultrasound, imaging, and pathology services available on-site.",
  },
  {
    icon: Shield,
    title: "Patient Safety First",
    description:
      "We adhere to the highest standards of patient safety, hygiene protocols, and evidence-based medical practices.",
  },
  {
    icon: HeartPulse,
    title: "Comprehensive Care",
    description:
      "From General Medicine consultations to specialized Gynecology, Infertility Treatment and Laparoscopic Surgery, we provide complete healthcare under one roof.",
  },
  {
    icon: Users,
    title: "Expert Medical Team",
    description:
      "Dr. Ramesh Reddy (General Physician, Diabetologist & Critical Care) and Dr. Triveni Reddy (Gynecologist, Infertility & Laparoscopic Surgeon), working together for your well-being.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Hospital open 24 hours with emergency services available around the clock. We are always here when you need us.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assurance",
    description:
      "Regular quality audits, continuous medical education, and adherence to national healthcare standards.",
  },
  {
    icon: HandHeart,
    title: "Compassionate Approach",
    description:
      "We believe in treating every patient with empathy, dignity, and personalized attention they deserve.",
  },
];

function FeatureCard({ feature, index, isInView }: { feature: typeof features[0]; index: number; isInView: boolean }) {
  const tilt = useTilt3D({ maxTilt: 12, scale: 1.05, speed: 300 });

  return (
    <motion.div
      key={feature.title}
      className="perspective-1500"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div
        className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 bg-white shadow-3d-hover card-3d-glow h-full"
        style={tilt.style}
        onMouseMove={tilt.onMouseMove}
        onMouseEnter={tilt.onMouseEnter}
        onMouseLeave={tilt.onMouseLeave}
      >
        <div
          className="w-10 h-10 sm:w-14 sm:h-14 bg-teal-100 group-hover:bg-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
        >
          <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 text-teal-600 group-hover:text-white transition-all duration-300 group-hover:scale-110" />
        </div>
        <h3
          className="font-bold text-gray-900 mb-1.5 sm:mb-2 font-[family-name:var(--font-inter)] text-xs sm:text-sm group-hover:text-teal-700 transition-colors"
          style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
        >
          {feature.title}
        </h3>
        <p
          className="text-gray-500 text-[10px] sm:text-sm leading-relaxed hidden sm:block group-hover:text-gray-600 transition-colors"
          style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal-600 font-semibold text-xs sm:text-sm tracking-wider uppercase">
            Why Choose Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mt-2 sm:mt-3 font-[family-name:var(--font-inter)]">
            Why Choose{" "}
            <span className="gradient-text">Sri Suraksha?</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 leading-relaxed">
            We are committed to delivering healthcare that is not just
            effective but also compassionate and personalized.
          </p>
        </motion.div>

        {/* Features Grid with 3D Tilt */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
