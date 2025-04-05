
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="hero-pattern text-coffee-light">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 animate-fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Experience the Rich Flavor of <span className="text-coffee-accent">Nigerian Coffee</span>
          </h1>
          <p className="text-lg mb-6 max-w-lg text-coffee-light/80">
            Discover our premium selection of locally sourced and ethically produced Nigerian coffee beans, bringing authentic tastes from our farms to your cup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-coffee-accent hover:bg-coffee-light hover:text-coffee-dark text-white"
              asChild
            >
              <Link to="/shop">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-coffee-light text-coffee-light hover:bg-coffee-light hover:text-coffee-dark"
              asChild
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 animate-fade-in animate-delay-200">
          <div className="relative">
            <div className="bg-coffee-accent/10 backdrop-blur-sm border border-coffee-light/10 rounded-lg p-4 md:p-8 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1770&auto=format&fit=crop"
                alt="Nigerian Coffee" 
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-coffee-light text-coffee-dark px-4 py-2 rounded-md font-bold shadow-lg">
                New Harvest!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
