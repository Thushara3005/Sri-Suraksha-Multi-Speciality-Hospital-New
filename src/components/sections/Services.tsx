"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Heart, Stethoscope, Microscope } from "lucide-react";
import { useTilt3D } from "@/hooks/use-tilt-3d";

const services = [
  {
    title: "General Medicine",
    description:
      "Comprehensive health evaluations, diabetes management, critical care, diagnosis and treatment by Dr. Ramesh Reddy (MBBS, MD - General Physician, Diabetologist & Critical Care) with 12+ years of expertise.",
    image: "/images/service-general.png",
    icon: Stethoscope,
    features: [
      "Health Checkups",
      "Diabetes Management",
      "Critical Care",
      "Preventive Care",
    ],
  },
  {
    title: "Gynecology",
    description:
      "Expert women's healthcare, infertility treatment, laparoscopic surgery, prenatal care, and comprehensive gynecological treatments by Dr. Triveni Reddy (MBBS, MS Obs & Gyn).",
    image: "/images/service-gynecology.png",
    icon: Heart,
    features: [
      "Prenatal & Antenatal Care",
      "Infertility Treatment",
      "Laparoscopic Surgery",
      "Women's Wellness",
    ],
  },
  {
    title: "Diagnostics Laboratory",
    description:
      "State-of-the-art diagnostic laboratory offering a full range of blood tests, imaging, and pathology services with accurate and timely results.",
    image: "/images/service-diagnostics.png",
    icon: Microscope,
    features: [
      "Blood Tests & Pathology",
      "Ultrasound & Imaging",
      "Health Screening Packages",
      "Emergency Diagnostics",
    ],
  },
];

function ServiceCard({ service, index, isInView }: { service: typeof services[0]; index: number; isInView: boolean }) {
  const tilt = useTilt3D({ maxTilt: 8, scale: 1.02, speed: 300 });

  return (
    <motion.div
      key={service.title}
      className="perspective-1500"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <div
        className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 card-3d-glow shine-3d"
        style={tilt.style}
        onMouseMove={tilt.onMouseMove}
        onMouseEnter={tilt.onMouseEnter}
        onMouseLeave={tilt.onMouseLeave}
      >
        {/* Image */}
        <div className="relative h-44 sm:h-52 overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 to-transparent" />
          {/* Icon overlay with 3D pop effect */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 transition-transform duration-300 group-hover:translate-z-4 group-hover:scale-110" style={{ transformStyle: "preserve-3d" }}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow duration-300">
              <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4" style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 font-[family-name:var(--font-inter)] group-hover:text-teal-700 transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            {service.description}
          </p>

          {/* Features */}
          <div className="space-y-1.5 sm:space-y-2">
            {service.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-xs sm:text-sm text-gray-500"
              >
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      className="py-12 sm:py-16 lg:py-28 bg-gradient-to-b from-teal-50/50 to-white"
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
            Our Services
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mt-2 sm:mt-3 font-[family-name:var(--font-inter)]">
            Dedicated &{" "}
            <span className="gradient-text">Personalized Care</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 leading-relaxed">
            We offer comprehensive medical services including General Medicine, Gynecology, and Diagnostics Laboratory, tailored to meet your health needs with the highest standard of care.
          </p>
        </motion.div>

        {/* Service Cards with 3D Tilt */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
