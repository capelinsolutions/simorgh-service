import React from 'react';
import fiveStarRatingImg from '../assets/five-star-rating.jpg';
import testimonialAvatar1Img from '../assets/testimonial-avatar-1.jpg';
import testimonialAvatar2Img from '../assets/testimonial-avatar-2.jpg';
import testimonialAvatar3Img from '../assets/testimonial-avatar-3.jpg';

const Testimonials = () => {
  const testimonials = [
    {
      rating: fiveStarRatingImg,
      text: "We scheduled with Simorgh Service Group, and they promised to be on time. True to their word, they arrived on time, cleaned up promptly, and now my store is spotless.",
      author: "Alexander Thomas",
      avatar: testimonialAvatar1Img
    },
    {
      rating: fiveStarRatingImg,
      text: "Who knew cleaning could be this easy? Simorgh took care of everything! My house feels brand new!",
      author: "Anna P",
      avatar: testimonialAvatar2Img
    },
    {
      rating: fiveStarRatingImg,
      text: "I wholeheartedly recommend Simorgh Service Group for setting a new standard in disinfectant cleaning services in Malibu and Manhattan. Their exceptional attention to detail ensures every corner of my office is bacteria-free",
      author: "Annie Daniel",
      avatar: testimonialAvatar3Img
    }
  ];

  return (
    <section className="w-full mt-3.5 max-md:max-w-full">
      <div className="bg-white flex w-full flex-col items-center justify-center px-[120px] py-[100px] max-md:max-w-full max-md:px-5">
        <div className="flex w-full max-w-[1200px] flex-col items-center max-md:max-w-full">
          <div className="flex flex-col items-center max-md:max-w-full">
            <h2 className="text-black text-5xl font-semibold max-md:max-w-full max-md:text-[40px]">
              What our clients say
            </h2>
            <p className="text-[rgba(35,37,46,1)] text-2xl font-normal text-center mt-3 max-md:max-w-full">
              Lorem ipsum dolor sit amet consectetur. Leo mattis sed sit malesuada.
            </p>
          </div>
          
          <div className="flex w-full items-center gap-6 justify-center mt-12 max-md:mt-10 max-md:flex-col">
            {testimonials.map((testimonial, index) => (
              <article key={index} className={`bg-[rgba(234,248,247,1)] self-stretch flex min-w-60 flex-col items-center justify-center w-[517px] my-auto p-6 rounded-lg max-md:max-w-full ${index === 0 ? 'pr-6' : index === 2 ? 'pl-6' : ''}`}>
                <img
                  src={testimonial.rating}
                  alt="5 star rating"
                  className="aspect-[5] object-contain w-[120px] max-w-full"
                />
                <blockquote className="text-[rgba(15,15,15,1)] text-2xl font-normal text-center mt-6 max-md:max-w-full">
                  {testimonial.text}
                </blockquote>
                <div className="flex items-center gap-2 text-base text-[rgba(34,36,45,1)] font-semibold mt-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="aspect-[1] object-contain w-10 self-stretch shrink-0 my-auto rounded-[50%]"
                  />
                  <div className="self-stretch my-auto">
                    <cite className="not-italic">{testimonial.author}</cite>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
