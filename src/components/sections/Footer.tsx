"use client";

import Image from "next/image";
import {
  MapPin,
  Phone,
  Clock,
  Heart,
} from "lucide-react";
import { DEPARTMENTS } from "@/lib/constants";

const departmentQuickLinks = [
  { label: DEPARTMENTS[0], href: "#services" },
  { label: DEPARTMENTS[1], href: "#services" },
  { label: "Diagnostics Laboratory", href: "#services" },
  { label: DEPARTMENTS[2], href: "#services" },
  { label: DEPARTMENTS[3], href: "#services" },
];

const quickLinks = [
  ...departmentQuickLinks,
  { label: "FAQs", href: "#faq" },
  { label: "Gallery", href: "#gallery" },
  { label: "About Us", href: "#about" },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };



  return (
    <footer className="bg-gray-900 text-gray-300 relative">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="space-y-4 sm:space-y-6 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/images/footer-logo.png"
                alt="Sri Suraksha Multi Speciality Hospital"
                width={200}
                height={200}
                className="h-10 sm:h-12 w-10 sm:w-12 object-contain rounded-full"
              />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Sri Suraksha Multi Speciality Hospital is a leading healthcare
              facility in Metpally, Telangana, providing General Medicine,
              Gynecology, Diagnostics Laboratory, and 24/7 emergency
              healthcare services.
            </p>

          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold text-sm sm:text-lg mb-3 sm:mb-6 font-[family-name:var(--font-inter)]">
              Quick Links
            </h3>
            <ul className="max-h-52 space-y-2 overflow-y-auto pr-1 sm:max-h-none sm:space-y-3 sm:overflow-visible sm:pr-0">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-gray-400 hover:text-teal-400 transition-colors text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 group"
                  >
                    <span className="w-1 h-1 bg-teal-500 rounded-full group-hover:w-2 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold text-sm sm:text-lg mb-3 sm:mb-6 font-[family-name:var(--font-inter)]">
              Contact Info
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href="tel:+919390989540"
                    className="hover:text-teal-400 transition-colors text-xs sm:text-sm"
                  >
                    93909 89540
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p>Open 24 Hours</p>
                  <p>Emergency Care Available 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Locate Us */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold text-sm sm:text-lg mb-3 sm:mb-6 font-[family-name:var(--font-inter)]">
              Locate Us
            </h3>
            <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Gaddam Linga Reddy Complex, Metpally, Jagtial District,
                Telangana
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-700 h-32 sm:h-40 bg-gray-800">
              <iframe
                title="Sri Suraksha Hospital Location"
                src="https://www.google.com/maps?q=Sri%20Suraksha%20Multi%20Speciality%20Hospital%20Metpally%20Telangana&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-gray-500 text-[10px] sm:text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} Sri Suraksha Multi Speciality Hospital. All rights
            reserved. Made with{" "}
            <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline text-red-500 fill-red-500" /> for
            better healthcare.
          </p>

        </div>
      </div>
    </footer>
  );
}
