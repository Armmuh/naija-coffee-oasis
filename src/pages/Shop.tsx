
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters from '@/components/ProductFilters';
import { Coffee } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sorting, setSorting] = useState<string>('default');
  const { cartItems } = useCart();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-coffee-dark py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">Shop Our Collection</h1>
            <div className="flex items-center justify-center gap-2">
              <Coffee className="text-coffee-accent" />
              <p className="text-lg">Quality Nigerian Coffee Products for Every Taste</p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="lg:flex gap-8">
            <div className="lg:w-1/4 mb-8 lg:mb-0">
              <ProductFilters 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory}
                sorting={sorting}
                setSorting={setSorting}
              />
            </div>
            <div className="lg:w-3/4">
              <ProductGrid 
                activeCategory={activeCategory}
                sorting={sorting}
              />
            </div>
          </div>
        </div>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
