import React from 'react';
import whyChooseUsMainImg from '../assets/why-choose-us-main.jpg';
import checkmarkIconImg from '../assets/checkmark-icon.jpg';

const WhyChooseUs = () => {
  const features = [
    {
      title: "Expert Worker",
      description: "Lorem ipsum dolor sit amet consectetur. Aliquam maecenas ut viverra ."
    },
    {
      title: "Trusted Professionals", 
      description: "Lorem ipsum dolor sit amet consectetur. Aliquam maecenas ut viverra ."
    },
    {
      title: "Highly Rated",
      description: "Lorem ipsum dolor sit amet consectetur. Aliquam maecenas ut viverra ."
    }
  ];

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
              <img
                src={whyChooseUsMainImg}
                alt="Professional cleaning service"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
          
          {/* Content Section */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="max-w-xl mx-auto lg:max-w-none">
              {/* Header */}
              <div className="text-center lg:text-left mb-8 lg:mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
                  Why choose Us
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground">
                  We Are Very Experienced In Cleaning Services
                </p>
              </div>
              
              {/* Features */}
              <div className="space-y-6 lg:space-y-8">
                {features.map((feature, index) => (
                  <article key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={checkmarkIconImg}
                        alt=""
                        className="w-8 h-8 rounded-2xl object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
