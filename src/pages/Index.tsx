import React, { Suspense, lazy } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Lazy load below-the-fold components for better initial page load
const BestServiceSection = lazy(() => import('@/components/BestServiceSection'));
const QualitySection = lazy(() => import('@/components/QualitySection'));
const CompanySection = lazy(() => import('@/components/CompanySection'));
const PricingSection = lazy(() => import('@/components/PricingSection'));
const TestimonialSection = lazy(() => import('@/components/TestimonialSection'));
const BlogSection = lazy(() => import('@/components/BlogSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const Footer = lazy(() => import('@/components/Footer'));

// Simple loading component for sections
const SectionLoader = () => (
  <div className="h-32 bg-gray-50 animate-pulse flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const Index = React.memo(() => {
  return (
    <div className="bg-white flex flex-col overflow-hidden items-stretch">
      <Header />
      
      <main>
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <BestServiceSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <QualitySection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <CompanySection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <PricingSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <TestimonialSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <BlogSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </main>
      
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
});

export default Index;
