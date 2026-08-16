"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  X,
  Stethoscope,
  Syringe,
  Microscope,
  UserRound,
  Building2,
  Baby,
  ScanEye,
  Clock,
  Award,
  GraduationCap,
  Calendar,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

interface GalleryItem {
  src: string;
  alt: string;
  category: string;
  info: string;
  icon: React.ElementType;
  // Extended detail info
  name?: string;
  specialty?: string;
  qualifications?: string;
  experience?: string;
  description?: string;
  availability?: string;
  location?: string;
  rating?: number;
  specializations?: string[];
}

const galleryImages: GalleryItem[] = [
  {
    src: "/dr-ramesh-reddy.png",
    alt: "Dr. Ramesh Reddy",
    category: "doctors",
    info: "General Medicine | 12+ Years Experience",
    icon: Stethoscope,
    name: "Dr. Ramesh Reddy",
    specialty: "General Medicine, General Physician, Diabetologist & Critical Care",
    qualifications: "MBBS, MD (General Medicine, General Physician, Diabetologist & Critical Care)",
    experience: "12+ Years Experience",
    description:
      "Dr. Ramesh Reddy is an experienced General Physician and Diabetologist specializing in comprehensive healthcare including diabetes management, critical care, chronic disease management, preventive care, and emergency services with over 12 years of clinical expertise.",
    availability: "Available 24/7",
    location: "Sri Suraksha Multi Speciality Hospital, Metpally",
  },
  {
    src: "/dr-triveni-reddy-new.png",
    alt: "Dr. Triveni Reddy",
    category: "doctors",
    info: "Gynecology & Obstetrics | 12+ Years Experience",
    icon: Baby,
    name: "Dr. Triveni Reddy",
    specialty: "Infertility & Laparoscopic Surgeon",
    qualifications: "MBBS, MS (Obs & Gyn) - Infertility & Laparoscopic Surgeon",
    experience: "12+ Years Experience",
    description:
      "Dr. Triveni Reddy is a skilled Gynecologist and Laparoscopic Surgeon specializing in women's health, infertility treatment, prenatal care, obstetrics, and reproductive health with over 12 years of clinical expertise in gynecological procedures and patient care.",
    availability: "Available 24/7",
    location: "Sri Suraksha Multi Speciality Hospital, Metpally",
  },
  {
    src: "/dr-harikrishna.png",
    alt: "Dr. Harikrishna",
    category: "doctors",
    info: "Orthopedic & Joint Replacement Surgeon | 10+ Years Experience",
    icon: Stethoscope,
    name: "Dr. Harikrishna",
    specialty: "Orthopedic & Joint Replacement Surgeon",
    qualifications: "MBBS, MS (Orthopaedics) – Orthopedic & Joint Replacement Surgery",
    experience: "10+ Years Experience",
    description:
      "Dr. Harikrishna is an experienced Orthopedic & Joint Replacement Surgeon specializing in the diagnosis and treatment of bone, joint, and musculoskeletal conditions. He provides expert care for fractures, sports injuries, arthritis, joint pain, and orthopedic conditions, with a focus on personalized treatment and patient recovery.",
    availability: "Available 24/7",
    location: "Sri Suraksha Multi Speciality Hospital, Metpally",
    rating: 4.3,
    specializations: ["Orthopaedics", "Joint Replacement", "Sports Injuries", "Fracture Treatment", "Arthroscopy"],
  },
  {
    src: "/dr-a-suman-rao.png",
    alt: "Dr. A. Suman Rao",
    category: "doctors",
    info: "General Surgeon | 10+ Years Experience",
    icon: Syringe,
    name: "Dr. A. Suman Rao",
    specialty: "General Surgeon",
    qualifications: "MBBS, MS (General Surgery)",
    experience: "10+ Years Experience",
    description:
      "Dr. A. Suman Rao is an experienced General Surgeon specializing in the diagnosis and surgical management of a wide range of conditions. His areas of expertise include general and laparoscopic procedures, hernia and gallbladder surgery, and minor surgical treatments, with an emphasis on safe and personalized patient care.",
    availability: "Available 24/7",
    location: "Sri Suraksha Multi Speciality Hospital, Metpally",
    specializations: ["General Surgery", "Laparoscopic Surgery", "Hernia Surgery", "Gallbladder Surgery", "Minor Surgical Procedures"],
  },
  {
    src: "/images/waiting-room.png",
    alt: "Waiting Room",
    category: "hospital",
    info: "Patient Waiting Hall",
    icon: Building2,
    name: "Waiting Room",
    description: "Comfortable and well-lit waiting room for patients and attenders at Sri Suraksha Multi Speciality Hospital, Metpally.",
    location: "Sri Suraksha Multi Speciality Hospital, Metpally",
  },
  {
    src: "/images/hospital-blue.png",
    alt: "Hospital Building",
    category: "hospital",
    info: "Sri Suraksha Hospital",
    icon: Building2,
    name: "Sri Suraksha Hospital",
    description: "Sri Suraksha Multi Speciality Hospital building in Metpally, providing comprehensive healthcare services.",
    location: "Sri Suraksha Multi Speciality Hospital, Metpally",
  },
  {
    src: "/images/mens-patients-room.png",
    alt: "Mens Patients Room",
    category: "hospital",
    info: "Mens Patients Room",
    icon: Building2,
    name: "Mens Patients Room",
    description: "Mens patients room at Sri Suraksha Multi Speciality Hospital, Metpally, ensuring comfortable care and privacy.",
    location: "Sri Suraksha Multi Speciality Hospital, Metpally",
  },
];

const categories = [
  { id: "all", label: "All" },
  { id: "doctors", label: "Doctors" },
  { id: "hospital", label: "Hospital" },
];

function GalleryCard({
  image,
  index,
  isInView,
  onClick,
}: {
  image: GalleryItem;
  index: number;
  isInView: boolean;
  onClick: () => void;
}) {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = ((centerY - y) / centerY) * 8;

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: "transform 0.2s cubic-bezier(0.03, 0.98, 0.52, 0.99)",
      transformStyle: "preserve-3d",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform:
        "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)",
    });
    setIsHovered(false);
  };

  return (
    <motion.div
      key={`gallery-${index}`}
      className="perspective-1000 w-full flex justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <div
        className="group relative w-full rounded-xl overflow-hidden shadow-md cursor-pointer aspect-square shine-3d"
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {image.src && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* 3D floating icon badge */}
        <div
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
          style={{
            transformStyle: "preserve-3d",
            transform: isHovered ? "translateZ(40px)" : "translateZ(0px)",
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}
        >
          <image.icon className="w-3.5 h-3.5 text-teal-600" />
        </div>

        {/* Info overlay with 3D depth */}
        <div
          className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ transformStyle: "preserve-3d" }}
        >
          <p
            className="text-white font-semibold text-xs leading-tight"
            style={{
              transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
              transition: "transform 0.3s ease 0.1s",
            }}
          >
            {image.name || image.alt}
          </p>
          <p
            className="text-teal-200 text-[10px] mt-0.5"
            style={{
              transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
              transition: "transform 0.3s ease 0.15s",
            }}
          >
            {image.specialty || image.info}
          </p>
        </div>

        {/* 3D border glow on hover */}
        <div className="absolute inset-0 rounded-xl border-2 border-teal-400/0 group-hover:border-teal-400/30 transition-all duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <section
      id="gallery"
      className="py-12 sm:py-16 lg:py-28 bg-gray-50"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal-600 font-semibold text-xs sm:text-sm tracking-wider uppercase">
            Gallery
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mt-2 sm:mt-3 font-[family-name:var(--font-inter)]">
            Our <span className="gradient-text">Gallery</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 leading-relaxed">
            Meet our expert doctors and explore our world-class healthcare
            facility.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                ? "bg-teal-600 text-white shadow-lg shadow-teal-200 scale-105"
                : "bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200 hover:border-teal-300 hover:scale-105"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid - centered flex wrap keeps partial rows (doctors/hospital) centered */}
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
          {filteredImages.map((image, index) => (
            <div
              key={`${activeCategory}-${index}`}
              className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] md:w-[calc(25%-0.9375rem)]"
            >
              <GalleryCard
                image={image}
                index={index}
                isInView={isInView}
                onClick={() => setSelectedItem(image)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel - Info Left, Image Right */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 40, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-200 text-gray-500"
                onClick={() => setSelectedItem(null)}
                aria-label="Close details"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex flex-col md:flex-row w-full">
                {/* LEFT SIDE - Information */}
                <div className="flex-1 p-5 sm:p-8 lg:p-10 order-2 md:order-1 overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
                  {/* Category badge */}
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                      <selectedItem.icon className="w-3.5 h-3.5" />
                      {selectedItem.category === "doctors"
                        ? "Doctors"
                        : "Hospital"}
                    </span>
                  </div>

                  {/* Name */}
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-[family-name:var(--font-inter)]">
                    {selectedItem.name || selectedItem.alt}
                  </h2>

                  {/* Specialty */}
                  {selectedItem.specialty && (
                    <p className="text-teal-600 font-semibold text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">
                      {selectedItem.specialty}
                    </p>
                  )}

                  {/* Divider */}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full my-4 sm:my-5" />

                  {/* Detail items */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Qualifications */}
                    {selectedItem.qualifications && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <GraduationCap className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium">
                            Qualifications
                          </p>
                          <p className="text-sm sm:text-base text-gray-700 font-medium">
                            {selectedItem.qualifications}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {selectedItem.experience && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium">
                            Experience
                          </p>
                          <p className="text-sm sm:text-base text-gray-700 font-medium">
                            {selectedItem.experience}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    {selectedItem.availability && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium">
                            Availability
                          </p>
                          <p className="text-sm sm:text-base text-gray-700 font-medium">
                            {selectedItem.availability}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {selectedItem.location && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium">
                            Location
                          </p>
                          <p className="text-sm sm:text-base text-gray-700 font-medium">
                            {selectedItem.location}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    {selectedItem.rating && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium">
                            Rating
                          </p>
                          <p className="text-sm sm:text-base text-gray-700 font-medium">
                            {selectedItem.rating}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Specializations */}
                  {selectedItem.specializations && selectedItem.specializations.length > 0 && (
                    <div className="mt-4 sm:mt-6">
                      <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
                        Specializations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.specializations.map((spec, idx) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedItem.description && (
                    <div className="mt-4 sm:mt-6">
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="mt-5 sm:mt-7">
                    <button
                      onClick={() => {
                        setSelectedItem(null);
                        router.push("/bookAppointment");
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </button>
                  </div>
                </div>

                {/* RIGHT SIDE - Image */}
                <div className="relative w-full md:w-[45%] lg:w-[50%] h-[45vh] sm:h-[55vh] md:h-auto order-1 md:order-2 flex-shrink-0">
                  {/* Gradient overlay for image */}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/10 z-10 pointer-events-none" />

                  {selectedItem.src ? (
                    <Image
                      src={selectedItem.src}
                      alt={selectedItem.alt}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center">
                      <div className="text-center">
                        <selectedItem.icon className="w-16 h-16 text-teal-300 mx-auto mb-3" />
                        <p className="text-teal-600 font-medium">{selectedItem.name || selectedItem.alt}</p>
                      </div>
                    </div>
                  )}

                  {/* Bottom gradient on image for mobile */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 md:hidden" />

                  {/* Name overlay on image for mobile */}
                  <div className="absolute bottom-4 left-5 z-20 md:hidden">
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedItem.name || selectedItem.alt}
                    </h3>
                    {selectedItem.specialty && (
                      <p className="text-teal-600 text-sm font-medium">
                        {selectedItem.specialty}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
