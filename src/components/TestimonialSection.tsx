"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Robert Fox",
    role: "Business Man",
    image: "/lovable-uploads/feedback.jpg",
    rating: 5,
    message:
      "Excellent service! The team was punctual, thorough, and left my home sparkling clean. Highly recommend for anyone needing a reliable and detailed cleaning service",
  },
  {
    name: "Emily Carter",
    role: "Interior Designer",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    message:
      "Outstanding experience! They paid attention to every detail. My clients were impressed with the cleanliness. I’ll continue to hire them!",
  },
  {
    name: "James Patel",
    role: "Tech Entrepreneur",
    image: "https://randomuser.me/api/portraits/men/47.jpg",
    rating: 5,
    message:
      "Quick, efficient, and professional. I never have to worry about the house chores anymore. They’ve made my life easier!",
  },
];

const TestimonialSection = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const { name, role, image, rating, message } = testimonials[index];

  return (
    <section className="py-20 px-4 bg-white">
      {/* lg breakpoint se columns, uske niche rows */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-snug text-center lg:text-left">
            Feedback About Their Experience With Us
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            Read testimonials from our satisfied clients. See how our cleaning
            services have made a difference in their lives and homes
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <button
              onClick={handlePrev}
              className="w-9 h-9 sm:w-10 sm:h-10 border border-[#58C0D7] rounded-lg flex items-center justify-center text-[#58C0D7] hover:bg-blue-50 transition"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-[#58C0D7] rounded-lg flex items-center justify-center text-white hover:bg-[#4aa8c0] transition"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="w-full max-w-[600px] mx-auto bg-white border-t-[6px] sm:border-t-[10px] border-r-[6px] sm:border-r-[10px] border-[#58C0D7] rounded-[20px] p-4 sm:p-5 shadow-md">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            {/* Profile Image */}
            <img
              src={image}
              alt={name}
              className="w-[120px] h-[170px] sm:w-[170px] sm:h-[244px] object-cover rounded-[10px] border border-gray-200"
            />

            {/* Text Content */}
            <div className="flex-1 sm:py-10">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900">{name}</h4>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">{role}</p>

              {/* Star Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Testimonial Message */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {message}
              </p>
            </div>

            {/* Quote Icon */}
            <div className="hidden sm:block self-start py-10">
              <img
                src="/lovable-uploads/Quotation.png"
                alt="quotation mark"
                className="w-[40px] h-[32px] sm:w-[58px] sm:h-[47px] opacity-100"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
