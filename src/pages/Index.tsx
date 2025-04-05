
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import AboutSection from '@/components/AboutSection';
import CoffeeCategories from '@/components/CoffeeCategories';
import Newsletter from '@/components/Newsletter';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedProducts />
        <AboutSection />
        <CoffeeCategories />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
