"use client";

import { Mail, MapPin, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Contact Info */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-12 mt-16">Find us</h2>

          <div className="space-y-4">
            {/* Phone */}
            <div className="flex items-center gap-4 bg-[#F8F8F8] p-4 rounded-lg">
              <div className="w-12 h-12 bg-[#58C0D7] rounded-full flex items-center justify-center text-white flex-shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <p className="font-semibold text-black text-sm sm:text-base">Call Us</p>
                <p className="text-xs sm:text-sm text-gray-700">+(01) 225 201 888</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 bg-[#F8F8F8] p-4 rounded-lg">
              <div className="w-12 h-12 bg-[#58C0D7] rounded-full flex items-center justify-center text-white flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-semibold text-black text-sm sm:text-base">Email Now</p>
                <p className="text-xs sm:text-sm text-gray-700">info@simorghservices.com</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4 bg-[#F8F8F8] p-4 rounded-lg">
              <div className="w-12 h-12 bg-[#58C0D7] rounded-full flex items-center justify-center text-white flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-semibold text-black text-sm sm:text-base">Address</p>
                <p className="text-xs sm:text-sm text-gray-700">
                  Lorem Ipsum dolor sit amet lorem
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Contact info</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-4">Keep In Touch</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-lg">
            We prioritize responding to your inquiries promptly to ensure you
            receive the assistance you need in a timely manner
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#58C0D7]"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#58C0D7]"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#58C0D7]"
            ></textarea>

            <button
              type="submit"
              className="bg-[#58C0D7] text-white px-6 py-3 rounded-md text-sm sm:text-base hover:bg-[#4bb4ca] transition-colors w-full sm:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
