
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <Hero />
      <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
        <Features />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: '0.8s' }}>
        <Testimonials />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: '1s' }}>
        <Pricing />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
