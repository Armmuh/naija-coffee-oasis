
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { Coffee, Globe, Award, Clock, Leaf } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-coffee-dark py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">Our Story</h1>
            <div className="flex items-center justify-center gap-2">
              <Coffee className="text-coffee-accent" />
              <p className="text-lg">Discover the Naija Coffee Oasis Journey</p>
            </div>
          </div>
        </div>
        
        {/* Origin Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1589476993333-f55b84301219?q=80&w=1974&auto=format&fit=crop" 
                  alt="Coffee farm in Nigeria" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-playfair font-bold mb-6 text-coffee-dark">Our Roots in Nigerian Soil</h2>
                <p className="text-gray-700 mb-4">
                  Founded in 2015 in the lush highlands of Taraba State, Naija Coffee Oasis began with a simple mission: 
                  to showcase the exceptional quality of Nigerian-grown coffee to the world while supporting local farming communities.
                </p>
                <p className="text-gray-700 mb-4">
                  Our founder, Adebayo Okafor, grew up in a family of coffee farmers and witnessed firsthand the challenges 
                  faced by Nigerian coffee producers. Despite growing some of the finest Arabica and Robusta beans, 
                  Nigerian farmers struggled to reach international markets and receive fair compensation for their crops.
                </p>
                <p className="text-gray-700">
                  Determined to change this narrative, Adebayo established Naija Coffee Oasis as a bridge connecting 
                  the rich coffee heritage of Nigeria with coffee enthusiasts worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission and Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-playfair font-bold mb-6 text-coffee-dark">Our Mission & Values</h2>
            <p className="text-gray-700 mb-12 max-w-3xl mx-auto">
              At Naija Coffee Oasis, we are committed to sustainable farming practices, fair trade, 
              and preserving the unique flavor profiles of Nigerian coffee while empowering local communities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
                <div className="w-12 h-12 bg-coffee-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-coffee-dark" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Sustainability</h3>
                <p className="text-gray-600">
                  We employ farming and processing methods that protect Nigeria's rich biodiversity and natural resources.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
                <div className="w-12 h-12 bg-coffee-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-coffee-dark" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Quality</h3>
                <p className="text-gray-600">
                  We maintain rigorous standards throughout our supply chain to deliver exceptional coffee experiences.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
                <div className="w-12 h-12 bg-coffee-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="text-coffee-dark" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Community</h3>
                <p className="text-gray-600">
                  We invest in the education and welfare of our farming partners and their families.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
                <div className="w-12 h-12 bg-coffee-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-coffee-dark" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Heritage</h3>
                <p className="text-gray-600">
                  We honor and celebrate Nigeria's rich coffee traditions while embracing innovation.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-playfair font-bold mb-6 text-coffee-dark text-center">From Bean to Cup</h2>
            <p className="text-gray-700 mb-12 max-w-3xl mx-auto text-center">
              We take pride in overseeing every step of our coffee's journey, ensuring quality and sustainability at each phase.
            </p>
            
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-coffee-light -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-coffee-dark rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-white font-bold">01</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Cultivation</h3>
                  <p className="text-gray-600">
                    Grown in the mineral-rich volcanic soils of Taraba highlands.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-coffee-dark rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-white font-bold">02</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Harvesting</h3>
                  <p className="text-gray-600">
                    Carefully hand-picked to ensure only the ripest cherries are selected.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-coffee-dark rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-white font-bold">03</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Processing</h3>
                  <p className="text-gray-600">
                    Traditional methods combined with modern techniques for optimal flavor.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-coffee-dark rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-white font-bold">04</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Roasting</h3>
                  <p className="text-gray-600">
                    Small-batch roasting to highlight the unique characteristics of Nigerian beans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-playfair font-bold mb-6 text-coffee-dark">Meet Our Team</h2>
            <p className="text-gray-700 mb-12 max-w-3xl mx-auto">
              Our dedicated team brings together coffee experts, sustainable farming advocates, and passionate entrepreneurs.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                  alt="Adebayo Okafor" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-xl mb-1">Adebayo Okafor</h3>
                <p className="text-coffee-accent mb-3">Founder & CEO</p>
                <p className="text-gray-600">
                  A third-generation coffee farmer with a vision to transform Nigeria's coffee industry.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop" 
                  alt="Amina Ibrahim" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-xl mb-1">Amina Ibrahim</h3>
                <p className="text-coffee-accent mb-3">Head of Sustainability</p>
                <p className="text-gray-600">
                  An environmental scientist dedicated to eco-friendly farming practices.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" 
                  alt="Chukwu Eze" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-xl mb-1">Chukwu Eze</h3>
                <p className="text-coffee-accent mb-3">Master Roaster</p>
                <p className="text-gray-600">
                  With 15 years of experience, Chukwu creates our signature roast profiles.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default About;
