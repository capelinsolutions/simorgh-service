import React from "react";
import OptimizedImage from "@/components/ui/optimized-image";

const blogs = [
  {
    id: 1,
    author: "JOHN HELTON",
    date: "JAN 6, 2025",
    title: "Eco-Friendly Cleaning: How We Keep Your Home Green",
    description:
      "Learn about our commitment to eco-friendly practices. We share the eco-conscious products...",
    image: "/lovable-uploads/blog1.png",
  },
  {
    id: 2,
    author: "JOHN HELTON",
    date: "JAN 6, 2025",
    title: "How to Maintain a Clean Home Between Professional Visits",
    description:
      "Get practical advice on maintaining cleanliness between our scheduled visits. These easy-to-follow tips...",
    image: "/lovable-uploads/blog2.png",
  },
  {
    id: 3,
    author: "JOHN HELTON",
    date: "JAN 6, 2025",
    title: "The Benefits of Regular Professional Cleaning",
    description:
      "Understand the numerous advantages of scheduling regular professional cleanings. From improving indoor air...",
    image: "/lovable-uploads/blog3.png",
  },
];

const BlogSection = () => {
  return (
    <section className="py-16 md:py-24 px-5 w-full bg-white">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 md:gap-12 mb-12 md:mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Stay Updated with Our <br />
              Tips & Service News!
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
              Our Blog
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Stay informed with our latest cleaning tips, service updates, expert advice on maintaining an immaculate home
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#83A790] mb-12 md:mb-16"></div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-sm flex flex-col w-full max-w-md mx-auto h-[512px]"
            >
              <OptimizedImage
                src={blog.image}
                alt={blog.title}
                className="w-full h-[240px] object-cover rounded-t-[20px]"
                aspectRatio="photo"
              />
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-gray-500 mb-2 tracking-wide">
                  {blog.author} &nbsp; {blog.date}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed">
                  {blog.description}
                </p>

                {/* Uniform Read More Button */}
                <button className="w-full text-sm text-gray-800 underline font-medium self-start hover:bg-[#58C0D7] hover:text-white transition px-4 py-4 rounded-xl hover:no-underline">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
