"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  Building2,
  Award,
  User,
  CheckCircle2,
  Clock,
} from "lucide-react";

const FEATURE_ITEMS = [
  { icon: Award, label: "Experienced Specialists" },
  { icon: User, label: "12+ Years Experience" },
  { icon: CheckCircle2, label: "Advanced Medical Equipment" },
  { icon: Clock, label: "24/7 Emergency Support" },
] as const;

function FeatureItem({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="group flex min-w-0 items-center gap-3 px-1 py-2 transition-all duration-300 ease-out hover:-translate-y-0.5 sm:gap-3.5 sm:py-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 transition-all duration-300 group-hover:scale-110 group-hover:text-teal-700 sm:h-10 sm:w-10 sm:rounded-xl">
        <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-105 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
      </div>
      <span className="min-w-0 font-medium text-slate-900 text-sm sm:text-[15px] font-[family-name:var(--font-inter)]">
        {label}
      </span>
    </div>
  );
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="overflow-hidden bg-white py-12 sm:py-16 lg:py-24"
      ref={ref}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[48%_52%] lg:items-stretch lg:gap-x-10 xl:gap-x-14">
          {/* Label + heading — first on mobile */}
          <motion.div
            className="order-1 lg:col-start-2 lg:row-start-1"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-3 flex items-center gap-2 text-teal-600">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm">
                About Us
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-inter)] text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.15]">
              We Are Committed to{" "}
              <span className="text-teal-600">Excellence in Healthcare</span>
            </h2>
          </motion.div>

          {/* Doctors group photograph */}
          <motion.div
            className="relative order-2 w-full min-w-0 lg:col-start-1 lg:row-start-1 lg:row-span-3 lg:h-full lg:min-h-0"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="lg:absolute lg:top-1/2 lg:left-0 lg:w-full lg:-translate-y-1/2">
              <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-8px_rgba(13,148,136,0.3),0_24px_60px_rgba(15,23,42,0.16),0_0_24px_rgba(13,148,136,0.16)]">
                <Image
                  src="/images/about-doctors-team.png"
                  alt="Dr. G Ramesh Reddy, Dr. Harikrishna, Dr. G Triveni Reddy, and Dr. A. Suman Rao at Sri Suraksha Multi Speciality Hospital"
                  width={900}
                  height={900}
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Body copy */}
          <motion.div
            className="order-3 space-y-4 sm:space-y-5 lg:col-start-2 lg:row-start-2"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg">
              <span className="font-bold text-teal-700">
                Sri Suraksha Multi Speciality Hospital
              </span>{" "}
              is a leading healthcare facility in{" "}
              <span className="font-bold text-teal-700">Metpally, Telangana</span>
              , led by{" "}
              <span className="font-bold text-teal-700">Dr. Ramesh Reddy</span>
              <span className="text-gray-500 text-xs sm:text-sm">
                {" "}
                (General Physician, Diabetologist &amp; Critical Care)
              </span>{" "}
              and{" "}
              <span className="font-bold text-teal-700">Dr. Triveni Reddy</span>
              <span className="text-gray-500 text-xs sm:text-sm">
                {" "}
                (Gynecologist, Infertility &amp; Laparoscopic Surgeon)
              </span>
              , bringing over 8+ years of trusted care and over 12 years of
              individual clinical expertise across our specialists.
            </p>

            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Our team also includes{" "}
              <span className="font-bold text-teal-700">Dr. Harikrishna</span>
              <span className="text-gray-500 text-xs sm:text-sm">
                {" "}
                (Orthopedic &amp; Joint Replacement Surgeon)
              </span>{" "}
              and{" "}
              <span className="font-bold text-teal-700">Dr. A. Suman Rao</span>
              <span className="text-gray-500 text-xs sm:text-sm">
                {" "}
                (General Surgeon)
              </span>
              , offering comprehensive medical, surgical, gynecological, orthopedic,
              and critical care services under one roof.
            </p>

            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              <span className="font-bold text-teal-700">Dr. Ramesh Reddy</span>{" "}
              provides expert care in General Medicine, Diabetes Management and
              Critical Care, while{" "}
              <span className="font-bold text-teal-700">Dr. Triveni Reddy</span>{" "}
              specializes in Gynecology, Infertility Treatment and Laparoscopic
              Surgery, supported by a fully equipped Diagnostics Laboratory. We
              are committed to delivering quality healthcare accessible to the
              community of Metpally and surrounding areas, available 24 hours for
              emergencies.
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            className="order-4 lg:col-start-2 lg:row-start-3"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-2">
              {FEATURE_ITEMS.map((item) => (
                <FeatureItem key={item.label} {...item} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
