import React from "react";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/ui/optimized-image";

const QualitySection = () => {
  return (
    <section className="py-16 px-5 w-full">
      <div className="max-w-screen-xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-center">
          {/* Content Column */}
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-500 mb-3 font-medium">
              Affordable cleaning solutions
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-snug">
              High-Quality and Friendly <br className="hidden md:block" />
              Services at Fair Prices
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
              We provide comprehensive cleaning services tailored to your needs.
              From eco-residential cleaning services
            </p>
            <Button className="bg-[#58C0D7] hover:bg-[#4aa8c0] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-medium">
              Get a quote
            </Button>
          </div>

          {/* Image Column */}
          <div className="relative flex justify-center">
            <OptimizedImage
              src="/lovable-uploads/e2664ec8-0e6e-4d41-b080-0120dc3d9a91.png"
              alt="Professional cleaning team"
              className="w-full max-w-[500px] h-64 sm:h-80 md:h-[400px] lg:h-[500px] object-contain rounded-xl"
              aspectRatio="square"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
