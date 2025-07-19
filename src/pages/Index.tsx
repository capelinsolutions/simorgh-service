import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WhyChooseUs from '@/components/WhyChooseUs';
import ServicesGrid from '@/components/ServicesGrid';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import ContactForm from '@/components/ContactForm';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="bg-white flex flex-col overflow-hidden items-stretch">
      <Header />
      
      <main>
        <Hero />
        <WhyChooseUs />
        <ServicesGrid />
        <Testimonials />
        <FAQ />
        <ContactForm />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
