"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Award, Users, Clock } from "lucide-react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left Image with 3D hover */}
          <motion.div
            className="relative perspective-1500"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{
                rotateY: 3,
                rotateX: -2,
                scale: 1.02,
                boxShadow: "0 30px 60px -15px rgba(13, 148, 136, 0.3)",
              }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/images/about-image.png"
                alt="Sri Suraksha Multi Speciality Hospital, Metpally"
                width={600}
                height={800}
                className="w-full h-[300px] sm:h-[400px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-transparent" />
              {/* 3D shine effect on hover */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Experience badge with 3D float */}
            <motion.div
              className="absolute -bottom-4 sm:-bottom-6 -right-2 sm:-right-6 bg-teal-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{
                scale: 1.1,
                rotateZ: 3,
                boxShadow: "0 20px 40px -10px rgba(13, 148, 136, 0.5)",
              }}
              style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}
            >
              <div className="text-2xl sm:text-4xl font-bold font-[family-name:var(--font-inter)]">
                12+
              </div>
              <div className="text-teal-200 text-xs sm:text-sm mt-1">Years of</div>
              <div className="text-teal-200 text-xs sm:text-sm">Excellence</div>
            </motion.div>

            {/* Decorative with 3D offset */}
            <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 w-16 sm:w-24 h-16 sm:h-24 border-2 border-teal-200 rounded-xl sm:rounded-2xl -z-10" />
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <span className="text-teal-600 font-semibold text-xs sm:text-sm tracking-wider uppercase">
                About Us
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mt-2 sm:mt-3 font-[family-name:var(--font-inter)] leading-tight">
                We Are Committed to{" "}
                <span className="gradient-text">Excellence</span>
              </h2>
            </div>

            <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              Sri Suraksha Multi Speciality Hospital is a leading healthcare
              facility in Metpally, Telangana, led by{" "}
              <span className="font-bold text-teal-700">Dr. Ramesh Reddy</span>
              <span className="text-gray-500 text-xs sm:text-sm">(General Physician, Diabetologist & Critical Care)</span>{" "}
              and{" "}
              <span className="font-bold text-teal-700">Dr. Triveni Reddy</span>
              <span className="text-gray-500 text-xs sm:text-sm">(Gynecologist, Infertility & Laparoscopic Surgeon)</span>
              , bringing over 12 years of clinical expertise.
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              <span className="font-bold text-teal-700">Dr. Ramesh Reddy</span>{" "}
              provides expert care in General Medicine, Diabetes Management and Critical Care, while{" "}
              <span className="font-bold text-teal-700">Dr. Triveni Reddy</span>{" "}
              specializes in Gynecology, Infertility Treatment and Laparoscopic Surgery, supported by a fully equipped Diagnostics Laboratory. We are committed to delivering quality healthcare accessible to the community of Metpally and surrounding areas, available 24 hours for emergencies.
            </p>

            {/* Feature list with 3D hover items */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
              {[
                {
                  icon: Award,
                  text: "Experienced Specialists",
                },
                {
                  icon: Users,
                  text: "12+ Years Experience",
                },
                {
                  icon: CheckCircle2,
                  text: "Advanced Medical Equipment",
                },
                {
                  icon: Clock,
                  text: "24/7 Emergency Support",
                },
              ].map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-teal-50/50 transition-colors cursor-default"
                  whileHover={{ x: 4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0 group">
                    <motion.div whileHover={{ rotate: 10, scale: 1.15 }} transition={{ duration: 0.2 }}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                    </motion.div>
                  </div>
                  <span className="text-gray-700 font-medium text-xs sm:text-sm">
                    {text}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => {
                  const el = document.querySelector("#services");
                  if (el) {
                    const offset = 80;
                    const top = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: "smooth" });
                  }
                }}
                className="btn-3d bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 sm:px-8 py-5 sm:py-6 shadow-lg group mt-2 sm:mt-4 text-sm sm:text-base"
                size="lg"
              >
                Read More
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
