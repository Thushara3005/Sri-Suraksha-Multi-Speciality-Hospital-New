"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Fast progress: increment quickly to simulate load
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 8;
      });
    }, 40);

    // Complete quickly - 1200ms total
    const completeTimer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 400);
    }, 1200);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const isReady = progress >= 100;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-5">
            {/* Logo */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src="/logo.png"
                alt="Sri Suraksha Multi Speciality Hospital"
                width={400}
                height={120}
                className="h-20 sm:h-28 md:h-36 w-auto object-contain"
                priority
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-teal-600/70 text-xs sm:text-sm font-medium tracking-wider uppercase"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Multi Speciality Hospital in Metpally
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="w-40 sm:w-56 h-1 bg-teal-100 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div
        className={`min-h-screen flex flex-col ${
          isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"
        }`}
        suppressHydrationWarning
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
