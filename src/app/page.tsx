"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Gallery from "@/components/sections/Gallery";
import FAQ from "@/components/sections/FAQ";
import Testimonials from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import ScrollToTop from "@/components/sections/ScrollToTop";

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 3;
      });
    }, 50);

    // Auto complete after progress finishes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const isReady = progress >= 100;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-gradient-to-br from-teal-50 via-white to-teal-50 flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* DNA Helix circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`dna-${i}`}
            className="absolute w-3 h-3 rounded-full bg-teal-200/40"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + Math.sin(i) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
        {/* Orbiting particles */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full border border-teal-100/30 relative">
            <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-teal-300 rounded-full" />
            <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-teal-400 rounded-full" />
          </div>
        </motion.div>
        {/* Pulsing rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        >
          <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full border border-teal-200/40" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
        {/* Logo with heartbeat animation */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Glow behind logo */}
          <motion.div
            className="absolute inset-0 blur-2xl bg-teal-200/50 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative animate-heartbeat">
            <Image
              src="/logo.png"
              alt="Sri Suraksha Multi Speciality Hospital"
              width={400}
              height={120}
              className="h-24 sm:h-32 md:h-40 w-auto object-contain relative z-10"
              priority
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-teal-600/70 text-xs sm:text-sm font-medium tracking-wider uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Multi Speciality Hospital in Metpally
        </motion.p>

        {/* Progress bar */}
        <motion.div
          className="w-48 sm:w-64 h-1.5 bg-teal-100 rounded-full overflow-hidden mt-2"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="relative h-full rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 overflow-hidden rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_linear_infinite]" />
            </div>
          </div>
        </motion.div>

        {/* Progress text */}
        <motion.span
          className="text-teal-400 text-[10px] sm:text-xs font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {isReady ? "Ready!" : "Loading your experience..."}
        </motion.span>

        {/* Medical icons floating */}
        <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-4">
          {["+", "\u2665", "\u2695"].map((icon, i) => (
            <motion.span
              key={i}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-400 text-sm sm:text-base"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            >
              {icon}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>
      <div
        className={`min-h-screen flex flex-col transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Navbar />
        <main className="flex-1">
          <Hero />
          <About />
          <Services />
          <WhyChooseUs />
          <Gallery />
          <FAQ />
          <Testimonials />
          <CTASection />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
