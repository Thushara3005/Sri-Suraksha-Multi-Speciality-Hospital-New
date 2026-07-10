"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  {
    label: "Services",
    href: "#services",
    children: [
      { label: "General Medicine", href: "#services" },
      { label: "Gynecology", href: "#services" },
      { label: "Diagnostics Laboratory", href: "#services" },
      { label: "Emergency Care", href: "#services" },
    ],
  },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home");

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

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
    setMobileDropdown(null);
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      closeMobile();
      const el = document.querySelector(href);
      if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    [closeMobile]
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
              href="tel:+918977507427"
              className="flex items-center gap-1.5 sm:gap-2 hover:text-teal-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              +91 89775 07427
            </a>
            <span className="text-teal-300">|</span>
            <span className="text-teal-100">
              Open 24 Hours | Emergency Services Available 24/7
            </span>
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#contact");
            }}
            className="hover:text-teal-200 transition-colors font-medium"
          >
            Book Appointment
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
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
                width={180}
                height={50}
                className="h-9 sm:h-10 lg:h-12 w-auto object-contain"
                priority
              />
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.children && setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`flex items-center gap-1 px-3 xl:px-4 py-2 font-medium transition-colors rounded-lg text-sm relative ${
                      getIsActive(item.href)
                        ? "text-teal-600 bg-teal-50"
                        : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                    }`}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {getIsActive(item.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-teal-500 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </a>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      >
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavClick(child.href);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-colors text-sm"
                          >
                            <ChevronRight className="w-3 h-3" />
                            {child.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Button
                onClick={() => handleNavClick("#contact")}
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <a
                        href={item.href}
                        onClick={(e) => {
                          if (!item.children) {
                            e.preventDefault();
                            handleNavClick(item.href);
                          }
                        }}
                        className={`flex-1 py-3 px-2 font-medium transition-colors text-sm ${
                          getIsActive(item.href)
                            ? "text-teal-600 bg-teal-50 rounded-lg"
                            : "text-gray-700 hover:text-teal-600"
                        }`}
                      >
                        {item.label}
                      </a>
                      {item.children && (
                        <button
                          onClick={() =>
                            setMobileDropdown(
                              mobileDropdown === item.label
                                ? null
                                : item.label
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <ChevronDown
                            className={`w-4 h-4 text-gray-500 transition-transform ${
                              mobileDropdown === item.label
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>
                    {item.children && mobileDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pl-4 border-l-2 border-teal-200 ml-2"
                      >
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavClick(child.href);
                            }}
                            className="flex items-center gap-2 py-2 px-3 text-gray-500 hover:text-teal-600 text-sm transition-colors"
                          >
                            <ChevronRight className="w-3 h-3" />
                            {child.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
                <div className="pt-4">
                  <Button
                    onClick={() => handleNavClick("#contact")}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-3 shadow-lg text-sm"
                  >
                    Book Appointment
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
