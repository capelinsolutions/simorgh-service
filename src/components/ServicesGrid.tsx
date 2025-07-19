import React from 'react';

const ServicesGrid = () => {
  const services = [
    {
      title: "Construction cleaning..",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9de4baea36394e060b78e19a488d09d9a7f7e1a7?placeholderIfAbsent=true",
      description: "We do various cleaning for private, commercial and even entire properties."
    },
    {
      title: "Office Cleaning service",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/c4448dfd987bb8cb20375220f09d5078669692a0?placeholderIfAbsent=true",
      description: "We do various cleaning for private, commercial and even entire properties."
    },
    {
      title: "Deep Cleanin",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/12e423858b89522cac1b8715bada463d4af16bca?placeholderIfAbsent=true",
      description: "We do various cleaning for private, commercial and even entire properties."
    },
    {
      title: "Industrial Cleaning",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/9f8ade4888783da5fad4c6fced299ec4bb1a5934?placeholderIfAbsent=true",
      description: "We do various cleaning for private, commercial and even entire properties."
    },
    {
      title: "Facade Cleaning Service",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/a88cd8a5c10b8106f10f753e0640229619532a44?placeholderIfAbsent=true",
      description: "We do various cleaning for private, commercial and even entire properties."
    },
    {
      title: "Winter Service",
      image: "https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/950a2c4d5b8648e07f41bbef91720364c4134ae5?placeholderIfAbsent=true",
      description: "We do various cleaning for private, commercial and even entire properties."
    }
  ];

  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#EEF9FB] mt-[76px] px-20 py-[111px] max-md:max-w-full max-md:mt-10 max-md:pb-[100px] max-md:px-5">
      <div className="flex w-full max-w-[1200px] flex-col items-stretch -mb-6 max-md:max-w-full max-md:mb-2.5">
        <div className="self-center flex flex-col items-center max-md:max-w-full">
          <h2 className="text-black text-5xl font-semibold max-md:max-w-full max-md:text-[40px]">
            Here are the services we offer
          </h2>
          <p className="text-[rgba(15,15,15,1)] text-xl font-normal text-center mt-3 max-md:max-w-full">
            Lorem ipsum dolor sit amet consectetur. Leo mattis sed sit malesuada.
          </p>
        </div>
        
        <div className="flex w-full items-center gap-6 text-[rgba(15,15,15,1)] justify-center flex-wrap mt-[63px] max-md:max-w-full max-md:mt-10">
          {services.map((service, index) => (
            <article key={index} className="bg-white self-stretch min-w-60 text-center grow shrink w-[350px] my-auto rounded-lg hover:shadow-lg transition-shadow">
              <img
                src={service.image}
                alt={service.title}
                className="aspect-[1.57] object-contain w-full"
              />
              <div className="flex w-full flex-col items-center justify-center px-4 py-7">
                <h3 className="text-2xl font-semibold self-stretch">
                  {service.title}
                </h3>
                <img
                  src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/7789ebe2bce8895c68442087ef3c5c7863c7b050?placeholderIfAbsent=true"
                  alt=""
                  className="object-contain w-[59px] stroke-[3px] stroke-[#58C0D7] mt-5"
                />
                <p className="text-base font-normal mt-5">
                  {service.description}
                </p>
              </div>
            </article>
          ))}
          
          <button className="justify-center items-center rounded self-stretch flex min-h-12 gap-2 text-base text-white font-semibold bg-[#58C0D7] my-auto px-4 py-3 hover:bg-[#4aa8c0] transition-colors">
            <span className="self-stretch my-auto">Explore more</span>
            <img
              src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/16bd81c03681f5ddd8569609378268b04706c50f?placeholderIfAbsent=true"
              alt=""
              className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
