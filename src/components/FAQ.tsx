import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import faqIconsImg from '../assets/faq-icons.jpg';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "How much does It cost ?",
      answer: "Thank you very much. We received a full professional service without scratching the new wood flooring and windows. We passed safely to our new Villa. We recommend."
    },
    {
      question: "How much does It cost ?",
      answer: "Our pricing varies based on the type and scope of cleaning service required. Contact us for a personalized quote."
    },
    {
      question: "How much does It cost ?",
      answer: "We offer competitive pricing for all our cleaning services. Get in touch for detailed pricing information."
    },
    {
      question: "How much does It cost ?",
      answer: "Pricing depends on various factors including location, service type, and frequency. Contact us for accurate pricing."
    },
    {
      question: "How much does It cost ?",
      answer: "We provide transparent pricing with no hidden costs. Reach out to us for a detailed quote."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? -1 : index);
  };

  return (
    <section className="items-center flex w-full flex-col justify-center bg-[#EEF9FB] px-[120px] py-[100px] max-md:max-w-full max-md:px-5">
      <div className="flex w-[997px] max-w-full flex-col items-stretch">
        <div className="self-center flex flex-col items-center max-md:max-w-full">
          <h2 className="text-black text-5xl font-semibold max-md:text-[40px]">
            FAQ
          </h2>
          <p className="text-[rgba(35,37,46,1)] text-2xl font-normal text-center mt-3 max-md:max-w-full">
            Lorem ipsum dolor sit amet consectetur.
          </p>
        </div>
        
        <div className="flex w-full gap-6 text-[rgba(15,15,15,1)] justify-center flex-wrap mt-12 max-md:max-w-full max-md:mt-10">
          {faqs.map((faq, index) => (
            <article key={index} className={`rounded bg-white flex min-w-60 w-[798px] flex-col grow shrink max-md:max-w-full ${openFAQ === index ? 'items-stretch pb-6 border-l-4 border-l-[#58C0D7]' : 'items-center'}`}>
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center gap-[40px_100px] text-2xl font-semibold justify-between flex-wrap pt-6 pb-px px-6 rounded-lg max-md:max-w-full max-md:px-5"
              >
                <span className="self-stretch w-[469px] my-auto max-md:max-w-full text-left">
                  {faq.question}
                </span>
                <img
                  src={openFAQ === index 
                    ? faqIconsImg
                    : faqIconsImg
                  }
                  alt={openFAQ === index ? "Collapse" : "Expand"}
                  className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
                />
              </button>
              
              {openFAQ === index && (
                <div className="text-xl font-normal self-center mt-6 max-md:max-w-full px-6">
                  {faq.answer}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
