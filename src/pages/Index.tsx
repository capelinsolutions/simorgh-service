import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BestServiceSection from '@/components/BestServiceSection';
import QualitySection from '@/components/QualitySection';
import CompanySection from '@/components/CompanySection';
import PricingSection from '@/components/PricingSection';
import TestimonialSection from '@/components/TestimonialSection';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="bg-white flex flex-col overflow-hidden items-stretch">
      <Header />
      
      <main>
        <Hero />
        <BestServiceSection />
        <QualitySection />
        <CompanySection />
        <PricingSection />
        <TestimonialSection />
        <BlogSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
