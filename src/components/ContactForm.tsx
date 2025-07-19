import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      firstName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <section className="items-stretch flex w-full flex-col justify-center bg-white px-[120px] py-[100px] max-md:max-w-full max-md:px-5">
      <div className="flex w-full flex-col items-center max-md:max-w-full">
        <div className="flex flex-col items-center max-md:max-w-full">
          <h2 className="text-black text-5xl font-semibold max-md:text-[40px]">
            Contact us
          </h2>
          <p className="text-[rgba(15,15,15,1)] text-2xl font-normal text-center mt-3 max-md:max-w-full">
            We are at your service with responsibility and quality awareness
          </p>
        </div>
        
        <div className="flex max-w-full w-[1200px] items-center gap-[40px_89px] text-[rgba(15,15,15,1)] justify-between flex-wrap mt-12 max-md:mt-10">
          <div className="self-stretch min-w-60 min-h-[484px] text-[32px] font-semibold w-[593px] my-auto max-md:max-w-full">
            <img
              src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/d76fcbd3bb52414156e128a390dccab89b9d3a87?placeholderIfAbsent=true"
              alt="Contact us"
              className="aspect-[1.7] object-contain w-full flex-1 max-md:max-w-full"
            />
            <div className="items-stretch rounded bg-white flex w-[491px] max-w-full flex-col justify-center mt-[43px] p-6 border-l-4 border-l-[#58C0D7] border-[rgba(88,192,215,1)] border-solid max-md:mt-10 max-md:px-5">
              <h3 className="max-md:max-w-full">
                Simorgh Service Group - LLC.
              </h3>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="self-stretch flex min-w-60 flex-col items-center text-xl font-normal w-[516px] my-auto max-md:max-w-full">
            <div className="items-center rounded flex min-h-14 max-w-full w-[516px] gap-4 bg-[#EEF9FB] px-6 py-[15px] max-md:px-5">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
                className="self-stretch my-auto bg-transparent border-none outline-none w-full"
              />
            </div>
            
            <div className="items-center rounded flex min-h-14 max-w-full w-[516px] gap-4 whitespace-nowrap bg-[#EEF9FB] mt-6 px-6 py-[15px] max-md:px-5">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="self-stretch my-auto bg-transparent border-none outline-none w-full"
              />
            </div>
            
            <div className="items-center rounded flex min-h-14 max-w-full w-[516px] gap-4 whitespace-nowrap bg-[#EEF9FB] mt-6 px-6 py-[15px] max-md:px-5">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                required
                className="self-stretch my-auto bg-transparent border-none outline-none w-full"
              />
            </div>
            
            <div className="rounded flex min-h-[163px] max-w-full w-[516px] gap-4 bg-[#EEF9FB] mt-6 pt-6 pb-28 px-6 max-md:pb-[100px] max-md:px-5">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="What should we talk about?"
                required
                className="w-full h-full bg-transparent border-none outline-none resize-none"
              />
            </div>
            
            <button
              type="submit"
              className="justify-center items-center rounded flex min-h-14 max-w-full w-[516px] gap-4 text-white font-semibold whitespace-nowrap bg-[#58C0D7] mt-6 px-6 py-[15px] max-md:px-5 hover:bg-[#4aa8c0] transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
