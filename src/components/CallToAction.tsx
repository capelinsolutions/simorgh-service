import React from 'react';

const CallToAction = () => {
  const handleApplyClick = () => {
    console.log('Apply to become an agent clicked');
    // Handle application process
  };

  return (
    <section className="items-stretch flex w-full flex-col justify-center bg-[#58C0D7] px-[120px] py-20 max-md:max-w-full max-md:px-5">
      <div className="flex w-full items-center gap-[40px_78px] justify-between flex-wrap max-md:max-w-full">
        <div className="self-stretch flex min-w-60 flex-col items-stretch w-[532px] my-auto max-md:max-w-full">
          <div className="flex max-w-full w-[532px] flex-col items-stretch text-white justify-center">
            <h2 className="text-4xl font-semibold max-md:max-w-full">
              Want to work Simorgh Service Group - LLC.
            </h2>
            <p className="text-base font-normal mt-2 max-md:max-w-full">
              Use the application form below to join the Simorgh family, which is growing worldwide and will be listed on the Stock Exchanges.
            </p>
          </div>
          
          <button 
            onClick={handleApplyClick}
            className="rounded bg-white flex min-h-12 items-center gap-2 text-base text-[#58C0D7] font-semibold justify-center mt-6 px-4 py-[13px] hover:bg-gray-100 transition-colors"
          >
            Apply to become an agent
          </button>
        </div>
        
        <img
          src="https://api.builder.io/api/v1/image/assets/0dc3dcf4d23140908369237a3449fa20/943930ee6be921e6b5bf00c466428c7e07ce3621?placeholderIfAbsent=true"
          alt="Join our team"
          className="aspect-[1.87] object-contain w-[588px] self-stretch min-w-60 my-auto rounded-lg max-md:max-w-full"
        />
      </div>
    </section>
  );
};

export default CallToAction;
