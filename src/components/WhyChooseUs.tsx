import React from 'react';

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
    <section className="self-center w-full max-w-[1200px] mt-[73px] max-md:max-w-full max-md:mt-10">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        <div className="w-[61%] max-md:w-full max-md:ml-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/3eeedfa4ebf67a2c7e19e4216557c0aa738a157a?placeholderIfAbsent=true"
            alt="Professional cleaning service"
            className="aspect-[0.99] object-contain w-full grow max-md:max-w-full max-md:mt-10"
          />
        </div>
        
        <div className="w-[39%] ml-5 max-md:w-full max-md:ml-0">
          <div className="self-stretch my-auto max-md:max-w-full max-md:mt-10">
            <div className="max-w-full w-[432px]">
              <h2 className="text-black text-5xl font-semibold max-md:text-[40px]">
                Why choose Us
              </h2>
              <p className="text-[rgba(15,15,15,1)] text-xl font-normal mt-3 max-md:max-w-full">
                We Are Very Experienced In Cleaning Services
              </p>
            </div>
            
            <div className="w-[372px] max-w-full mt-12 max-md:mt-10">
              {features.map((feature, index) => (
                <article key={index} className={`flex w-full gap-3 ${index > 0 ? 'mt-10' : ''}`}>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/d607e6f8960105630b686c50130fdec8508d6b19?placeholderIfAbsent=true"
                    alt=""
                    className="aspect-[1] object-contain w-8 shrink-0 rounded-2xl"
                  />
                  <div className="min-w-60 w-[328px]">
                    <h3 className="text-black text-2xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-[rgba(15,15,15,1)] text-base font-normal mt-3">
                      {feature.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
