
import { Button } from '@/components/ui/button';
import { ArrowRight, Coffee, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-16 coffee-pattern-bg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1459755486867-b55449bb39ff?q=80&w=1769&auto=format&fit=crop" 
                alt="Coffee Farm in Nigeria" 
                className="rounded-lg shadow-xl animate-fade-in"
              />
              <div className="absolute -bottom-8 -left-8 bg-coffee-accent text-white p-4 rounded-lg shadow-lg animate-fade-in animate-delay-200">
                <p className="font-playfair text-xl font-bold">
                  100% Nigerian
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 animate-fade-in animate-delay-300">
            <h2 className="text-3xl font-bold mb-4">
              Our <span className="text-coffee-accent">Nigerian</span> Coffee Story
            </h2>
            <p className="mb-6 text-muted-foreground">
              Naija Coffee Oasis began with a simple mission: to showcase the exceptional quality of Nigerian coffee to the world. 
              From the rich volcanic soils of Plateau State to the tropical climate of Cross River, our coffee beans embody the diverse 
              terrains and cultural heritage of Nigeria.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-coffee-dark text-coffee-light p-3 rounded-full">
                  <Coffee size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Locally Sourced</h3>
                  <p className="text-muted-foreground">Our beans are harvested from small-scale farms across Nigeria's coffee-growing regions.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-coffee-dark text-coffee-light p-3 rounded-full">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Premium Quality</h3>
                  <p className="text-muted-foreground">Each batch is carefully selected to ensure only the highest quality beans make it to your cup.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-coffee-dark text-coffee-light p-3 rounded-full">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Community Support</h3>
                  <p className="text-muted-foreground">We work directly with farmers, ensuring fair wages and sustainable practices.</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="bg-coffee-dark text-coffee-light hover:bg-coffee-accent"
              asChild
            >
              <Link to="/about">Read Our Full Story <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
