import React from 'react';
import { Button } from '@/components/ui/button';

const BlogSection = () => {
  const articles = [
    {
      title: "Eco-Friendly Cleaning: How We Keep Your Home Clean",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/eco-cleaning?placeholderIfAbsent=true",
      date: "March 15, 2024"
    },
    {
      title: "How to Maintain a Clutter-Free Professional Office",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/office-cleaning?placeholderIfAbsent=true", 
      date: "March 12, 2024"
    },
    {
      title: "The Benefits of Regular Professional Cleaning",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/professional-cleaning?placeholderIfAbsent=true",
      date: "March 10, 2024"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stay Updated with Our Tips & Service News!
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get the latest cleaning tips, service updates, and helpful guides from our expert team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <article key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200">
                <img 
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-[#58C0D7] font-medium mb-2">
                  {article.date}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h3>
                <Button 
                  variant="outline"
                  className="border-[#58C0D7] text-[#58C0D7] hover:bg-[#58C0D7] hover:text-white"
                >
                  Read More
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button 
            className="bg-[#58C0D7] hover:bg-[#4aa8c0] text-white px-8 py-3 text-lg"
          >
            View All
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;