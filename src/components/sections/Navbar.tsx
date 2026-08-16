"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const sections = ["home", "about", "services", "gallery", "faq", "testimonials", "contact"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const scrollToSectionMobile = useCallback((href: string) => {
    if (!href.startsWith("#")) return;

    document.body.style.overflow = "";

    const sectionId = href.replace("#", "");

    if (sectionId === "home") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return;
    }

    const el = document.getElementById(sectionId);
    if (!el) return;

    const offset = 80;
    requestAnimationFrame(() => {
      const top = Math.max(
        0,
        el.getBoundingClientRect().top + window.scrollY - offset
      );
      window.scrollTo({ top, left: 0, behavior: "auto" });
    });
  }, []);

  const handleBookAppointment = useCallback(() => {
    closeMobile();
    router.push("/bookAppointment");
  }, [closeMobile, router]);

  const handleNavClick = useCallback(
    (href: string) => {
      const isMobile =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 1023px)").matches;
      const shouldDelay = isMobile && isMobileOpen;

      if (shouldDelay) {
        closeMobile();
        window.setTimeout(() => {
          if (!href.startsWith("#")) {
            if (href === "/bookAppointment") {
              router.push(href);
            }
            return;
          }
          scrollToSectionMobile(href);
        }, 320);
        return;
      }

      if (isMobile) {
        if (!href.startsWith("#")) {
          if (href === "/bookAppointment") {
            router.push(href);
          }
          return;
        }
        scrollToSectionMobile(href);
        return;
      }

      if (!href.startsWith("#")) {
        if (href === "/bookAppointment") {
          router.push(href);
        }
        return;
      }

      const sectionId = href.replace("#", "");
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    [closeMobile, isMobileOpen, router, scrollToSectionMobile]
  );

  const getIsActive = (href: string) => {
    const sectionId = href.replace("#", "");
    return activeSection === sectionId;
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-teal-700 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="tel:+919390989540"
              className="flex items-center gap-1.5 sm:gap-2 hover:text-teal-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              93909 89540
            </a>
            <span className="text-teal-300">|</span>
            <span className="text-teal-100">
              Open 24 Hours | Emergency Services Available 24/7
            </span>
          </div>
          <a
            href="/bookAppointment"
            onClick={(e) => {
              e.preventDefault();
              handleBookAppointment();
            }}
            className="hover:text-teal-200 transition-colors font-medium"
          >
            Book Appointment
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 lg:sticky ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#home");
              }}
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
            >
              <Image
                src="/logo.png"
                alt="Sri Suraksha Multi Speciality Hospital"
                width={200}
                height={200}
                className="h-10 sm:h-11 lg:h-14 w-10 sm:w-11 lg:w-14 object-contain"
                priority
              />
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`flex items-center gap-1 px-3 xl:px-4 py-2 font-medium transition-colors rounded-lg text-sm relative ${getIsActive(item.href)
                      ? "text-teal-600 bg-teal-50"
                      : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                      }`}
                  >
                    {item.label}
                    {getIsActive(item.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-teal-500 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </a>
                </div>
              ))}
              <Button
                onClick={handleBookAppointment}
                className="ml-3 xl:ml-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full px-5 xl:px-6 shadow-lg shadow-teal-200 transition-all hover:shadow-xl hover:shadow-teal-200 text-sm"
              >
                Book Appointment
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
              suppressHydrationWarning
            >
              {isMobileOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu rendered in portal — fixed to viewport, not scroll position */}
        {isMounted &&
          createPortal(
            <AnimatePresence>
              {isMobileOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-x-0 top-16 z-[60] overflow-hidden border-t border-gray-100 bg-white sm:top-[4.5rem] lg:hidden"
                >
                  <div className="max-h-[calc(100vh-4rem)] space-y-1 overflow-y-auto px-4 py-4 sm:max-h-[calc(100vh-4.5rem)]">
                    {navItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.href);
                        }}
                        className={`block py-3 px-2 font-medium transition-colors text-sm ${getIsActive(item.href)
                          ? "text-teal-600 bg-teal-50 rounded-lg"
                          : "text-gray-700 hover:text-teal-600"
                          }`}
                      >
                        {item.label}
                      </a>
                    ))}
                    <div className="pt-4">
                      <Button
                        onClick={handleBookAppointment}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-3 shadow-lg text-sm"
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
      </motion.nav>

      {/* Reserve space for fixed mobile navbar */}
      <div className="h-16 shrink-0 sm:h-[4.5rem] lg:hidden" aria-hidden="true" />
    </>
  );
}
