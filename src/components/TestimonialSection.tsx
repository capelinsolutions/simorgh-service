import React from 'react';
import { Star } from 'lucide-react';

const TestimonialSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Feedback About Their Experience With Us
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our customers' satisfaction is our priority. Here's what they have to say about our cleaning services and professional approach.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/testimonial-avatar?placeholderIfAbsent=true"
                alt="Sarah Johnson"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xl font-bold text-gray-900">Sarah Johnson</h4>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            
            <blockquote className="text-gray-700 text-lg leading-relaxed italic">
              "Simorgh Service has been absolutely amazing! Their team is professional, thorough, and always arrives on time. My home has never looked better, and I can finally focus on what matters most to me. Highly recommend their services!"
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;