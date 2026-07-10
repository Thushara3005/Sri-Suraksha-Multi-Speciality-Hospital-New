"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Phone } from "lucide-react";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border border-white/20 animate-border-glow-3d">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Book Your Visit Today
          </div>

          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white font-[family-name:var(--font-inter)] leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your Health is Our <br />
            Top Priority
          </motion.h2>

          <p className="text-teal-100 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Don&apos;t wait for health concerns to escalate. Schedule a
            consultation with our experienced medical team and take the first
            step towards better health.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98, y: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button
                onClick={() => {
                  const el = document.querySelector("#contact");
                  if (el) {
                    const offset = 80;
                    const top = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: "smooth" });
                  }
                }}
                size="lg"
                className="btn-3d-white bg-white text-teal-700 hover:bg-teal-50 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold group w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                Book Appointment
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.a
              href="tel:+918977507427"
              className="inline-flex items-center gap-2 text-white hover:text-teal-200 font-semibold text-base sm:text-lg transition-colors"
              whileHover={{ scale: 1.05, x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              +91 89775 07427
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
