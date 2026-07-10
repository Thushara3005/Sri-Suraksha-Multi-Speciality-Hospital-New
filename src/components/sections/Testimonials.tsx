"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    date: "2 months ago",
    rating: 5,
    text: "Excellent experience at Sri Suraksha Multi Speciality Hospital. The doctors are very patient and thorough in their examination. They explained everything in detail and made me feel comfortable throughout the consultation. Highly recommended!",
    avatar: "/images/patient1.png",
  },
  {
    name: "Rajesh Kumar",
    date: "3 months ago",
    rating: 5,
    text: "Very professional and caring team. I visited for a general health checkup and was impressed by the thoroughness of the evaluation. The staff is courteous and the facility is well-maintained. Will definitely visit again.",
    avatar: "/images/patient2.png",
  },
  {
    name: "Anita Desai",
    date: "1 month ago",
    rating: 5,
    text: "The best healthcare experience I have had. Dr. took the time to understand my concerns and provided a comprehensive treatment plan. The follow-up care has been exceptional. Truly a patient-first approach!",
    avatar: "/images/patient3.png",
  },
  {
    name: "Venkat Rao",
    date: "4 months ago",
    rating: 5,
    text: "I have been a patient at Sri Suraksha Multi Speciality Hospital for over 2 years. The quality of care is consistently excellent. The diagnostic services are top-notch and the doctors are very knowledgeable and approachable.",
    avatar: "/images/patient4.png",
  },
  {
    name: "Lakshmi Narayana",
    date: "2 weeks ago",
    rating: 5,
    text: "Outstanding medical facility! The team handled my emergency with utmost care and professionalism. The post-treatment follow-up was remarkable. I am grateful for their expertise and compassionate care.",
    avatar: "/images/patient5.png",
  },
  {
    name: "Srinivas Reddy",
    date: "1 month ago",
    rating: 4,
    text: "Great medical center with experienced doctors. The consultation was detailed and the treatment plan was effective. The only suggestion would be to reduce the wait time during peak hours. Otherwise, excellent service!",
    avatar: "/images/patient6.png",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextPage, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextPage]);

  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section
      id="testimonials"
      className="py-12 sm:py-16 lg:py-28 bg-gradient-to-b from-teal-50 to-white"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-teal-600 font-semibold text-xs sm:text-sm tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mt-2 sm:mt-3 font-[family-name:var(--font-inter)]">
            What Our Patients{" "}
            <span className="gradient-text">Say About Us</span>
          </h2>

          {/* Google Rating */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 flex-wrap">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <span className="text-gray-600 font-medium text-sm sm:text-base">
              4.8 Rating on Google
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-teal-600 font-semibold text-sm sm:text-base">103 Reviews</span>
          </div>
        </motion.div>

        {/* Testimonial Cards with 3D hover */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {currentTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${currentPage}-${index}`}
                className="perspective-1500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
              >
                <motion.div
                  className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-lg border border-gray-100 hover:border-teal-200 relative h-full"
                  whileHover={{
                    rotateY: 2,
                    rotateX: -2,
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(13, 148, 136, 0.2), 0 0 0 1px rgba(13, 148, 136, 0.1)",
                  }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  {/* Quote icon with 3D float */}
                  <div
                    className="absolute top-4 sm:top-6 right-4 sm:right-6 transition-transform duration-300"
                    style={{ transform: hoveredIndex === index ? "translateZ(30px)" : "translateZ(0px)", transition: "transform 0.3s ease" }}
                  >
                    <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-teal-100" />
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                          i < testimonial.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200"
                        }`}
                        style={{
                          transform: hoveredIndex === index ? "translateZ(20px) scale(1.1)" : "translateZ(0px) scale(1)",
                          transition: `transform 0.3s ease ${i * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p
                    className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-4"
                    style={{ transformStyle: "preserve-3d", transform: hoveredIndex === index ? "translateZ(15px)" : "translateZ(0px)", transition: "transform 0.3s ease" }}
                  >
                    {testimonial.text}
                  </p>

                  {/* Author */}
                  <div
                    className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100"
                    style={{ transformStyle: "preserve-3d", transform: hoveredIndex === index ? "translateZ(25px)" : "translateZ(0px)", transition: "transform 0.3s ease" }}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-teal-100 transition-all duration-300 group-hover:ring-teal-300 group-hover:ring-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-400 text-[10px] sm:text-xs">{testimonial.date}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
            <motion.button
              onClick={prevPage}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-teal-50 hover:border-teal-300 transition-colors"
              aria-label="Previous testimonials"
              whileHover={{ scale: 1.1, rotateZ: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </motion.button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all ${
                    currentPage === i
                      ? "bg-teal-600 w-6 sm:w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextPage}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-teal-50 hover:border-teal-300 transition-colors"
              aria-label="Next testimonials"
              whileHover={{ scale: 1.1, rotateZ: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
