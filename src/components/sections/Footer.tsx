"use client";

import Image from "next/image";
import {
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  ArrowUp,
  Heart,
} from "lucide-react";

const quickLinks = [
  { label: "General Medicine", href: "#services" },
  { label: "Gynecology", href: "#services" },
  { label: "Diagnostics Laboratory", href: "#services" },
  { label: "Emergency Care", href: "#services" },
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                src="/logo.png"
                alt="Sri Suraksha Multi Speciality Hospital"
                width={200}
                height={200}
                className="h-10 sm:h-12 w-10 sm:w-12 object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Sri Suraksha Multi Speciality Hospital is a leading healthcare
              facility in Metpally, Telangana, providing General Medicine,
              Gynecology, Diagnostics Laboratory, and 24/7 emergency
              healthcare services.
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold text-sm sm:text-lg mb-3 sm:mb-6 font-[family-name:var(--font-inter)]">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
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
                    href="tel:+919014759130"
                    className="hover:text-teal-400 transition-colors text-xs sm:text-sm"
                  >
                    9014759130
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
            {/* Map embed placeholder */}
            <div className="rounded-xl overflow-hidden border border-gray-700 h-32 sm:h-40 bg-gray-800 flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=Metpally+Jagtial+Telangana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-xs sm:text-sm"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                View on Google Maps
              </a>
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
          <button
            onClick={scrollToTop}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}
