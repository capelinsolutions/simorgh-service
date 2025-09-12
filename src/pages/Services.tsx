import React from 'react';
import Header from '@/components/Header';
import ServicesGrid from '@/components/ServicesGrid';
import Footer from '@/components/Footer';

const Services = () => {
  console.log('🔥 Services page rendering');
  return (
    <div className="bg-white flex flex-col overflow-hidden items-stretch">
      <Header />
      <main>
        <ServicesGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Services;