"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Star, Clock, Shield } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const imageScale = useSpring(1, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    imageScale.set(1.02);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    imageScale.set(1);
  };

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
      id="home"
      className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://res.cloudinary.com/dmzrplt5o/image/upload/v1783711792/hsptl_img_dyvo8w.jpg?v=2')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/92 via-teal-800/85 to-teal-700/60" />
        {/* Decorative elements */}
        <div className="absolute top-16 right-6 sm:top-20 sm:right-20 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-12 left-4 sm:bottom-20 sm:left-20 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-teal-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-teal-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-white/20 animate-border-glow-3d">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                Trusted Healthcare Since 2012
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight font-[family-name:var(--font-inter)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Sri Suraksha Multi Speciality
              <br />
              <span className="text-teal-300">Hospital</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg lg:text-xl text-teal-100/90 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Experience comprehensive healthcare with personalized attention
              at Sri Suraksha Multi Speciality Hospital, Metpally. Our expert
              medical team is dedicated to your well-being with 8+ years of
              trusted clinical excellence.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.98, y: 2 }}>
                <Button
                  onClick={() => router.push("/bookAppointment")}
                  size="lg"
                  className="btn-3d-white bg-white text-teal-700 hover:bg-teal-50 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold group"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Book an Appointment
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.98, y: 2 }}>
                <Button
                  onClick={() => handleScrollTo("#services")}
                  size="lg"
                  className="btn-3d-white bg-white text-teal-700 hover:bg-teal-50 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold group"
                >
                  Our Services
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-2 sm:pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {[
                { value: "8+", label: "Years Experience" },
                { value: "24/7", label: "Available" },
                { value: "100%", label: "Patient Focus" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  whileHover={{ scale: 1.1, y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-[family-name:var(--font-inter)]">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-teal-200/80 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right side - Doctor Image with 3D Parallax Tilt */}
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[480px] xl:max-w-[520px]"
              style={{
                rotateX,
                rotateY,
                scale: imageScale,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Glow behind doctor */}
              <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-3xl scale-75" />

              {/* Decorative ring */}
              <motion.div
                className="absolute -inset-2 sm:-inset-3 xl:-inset-5 rounded-full border-2 border-dashed border-teal-300/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />

              {/* Second decorative ring */}
              <motion.div
                className="absolute -inset-4 sm:-inset-6 xl:-inset-8 rounded-full border border-teal-300/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />

              {/* Doctor Image Container */}
              <div className="relative rounded-full overflow-hidden border-4 border-white/20 shadow-2xl shadow-teal-900/50 aspect-[3/4] mx-auto" style={{ transform: "translateZ(0px)" }}>
                <Image
                  src="https://res.cloudinary.com/dmzrplt5o/image/upload/v1783711792/hsptl_img_dyvo8w.jpg?v=2"
                  alt="Sri Suraksha Multi Speciality Hospital Building, Metpally"
                  fill
                  className="object-cover object-center"
                  priority
                  unoptimized
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-teal-900/30 to-transparent" />
              </div>

              {/* Floating badge - Top Right (3D pop) */}
              <motion.div
                className="absolute top-4 -right-1 sm:top-8 sm:-right-2 xl:top-12 xl:right-0 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-2 sm:p-3 xl:p-4 flex items-center gap-1.5 sm:gap-2 xl:gap-3"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-6 h-6 sm:w-8 xl:w-10 sm:h-8 xl:h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-3 h-3 sm:w-4 xl:w-5 sm:h-4 xl:h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs xl:text-sm font-semibold text-gray-800">
                    Easy Booking
                  </p>
                  <p className="text-[8px] sm:text-[10px] xl:text-xs text-gray-500">Schedule online</p>
                </div>
              </motion.div>

              {/* Floating badge - Bottom Left (3D pop) */}
              <motion.div
                className="absolute bottom-10 -left-1 sm:bottom-16 sm:-left-2 xl:bottom-20 xl:left-0 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-2 sm:p-3 xl:p-4 flex items-center gap-1.5 sm:gap-2 xl:gap-3"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-6 h-6 sm:w-8 xl:w-10 sm:h-8 xl:h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 sm:w-4 xl:w-5 sm:h-4 xl:h-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs xl:text-sm font-semibold text-gray-800">
                    24/7 Care
                  </p>
                  <p className="text-[8px] sm:text-[10px] xl:text-xs text-gray-500">Emergency Support</p>
                </div>
              </motion.div>

              {/* Floating badge - Middle Right (3D pop, hidden on small) */}
              <motion.div
                className="hidden sm:flex absolute top-1/2 -right-2 xl:-right-6 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-3 xl:p-4 items-center gap-2 xl:gap-3"
                animate={{ x: [0, 6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                style={{ transform: "translateZ(70px)", transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-8 xl:w-10 h-8 xl:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 xl:w-5 h-4 xl:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs xl:text-sm font-semibold text-gray-800">
                    Trusted Care
                  </p>
                  <p className="text-[10px] xl:text-xs text-gray-500">12+ Years Exp.</p>
                </div>
              </motion.div>

              {/* Floating badge - Bottom Right (3D pop, hidden on small) */}
              <motion.div
                className="hidden sm:flex absolute bottom-4 -right-1 xl:bottom-4 xl:right-2 bg-teal-600 rounded-2xl shadow-2xl p-3 xl:p-4 text-white items-center gap-2 xl:gap-3"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.1 }}
              >
                <Clock className="w-4 xl:w-5 h-4 xl:h-5 text-teal-200" />
                <div>
                  <p className="text-xs xl:text-sm font-semibold">
                    24/7 Available
                  </p>
                  <p className="text-[10px] xl:text-xs text-teal-200">Emergency Support</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L48 108C96 96 192 72 288 60C384 48 480 48 576 54C672 60 768 72 864 78C960 84 1056 84 1152 78C1248 72 1344 60 1392 54L1440 48V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 768 120 672 120C576 120 480 120 384 120C288 120 192 120 96 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
