
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ProductFilters from '@/components/ProductFilters';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { Coffee } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  created_at?: string;
}

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sorting, setSorting] = useState<string>('default');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { cartItems } = useCart();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Filter and sort products when category, sorting, or search query changes
  useEffect(() => {
    let result = [...products];
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) || 
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Apply sorting
    switch (sorting) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        result.sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return 0;
        });
        break;
      default:
        // Default sorting by name
        result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredProducts(result);
  }, [products, activeCategory, sorting, searchQuery]);
  
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
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} className="max-w-md mx-auto" />
          </div>
          
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {filteredProducts.length} Products
                </h2>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="rounded-md border border-border bg-card p-4">
                      <div className="aspect-square w-full bg-muted mb-4"></div>
                      <div className="h-4 w-3/4 bg-muted mb-2"></div>
                      <div className="h-4 w-1/2 bg-muted mb-4"></div>
                      <div className="h-6 w-1/3 bg-muted"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="animate-fade-in">
                      <ProductCard 
                        id={parseInt(product.id.replace(/-/g, '').substring(0, 8), 16)}
                        name={product.name}
                        price={product.price}
                        image={product.image_url || ''}
                        category={product.category}
                        description={product.description}
                        stock={product.stock}
                      />
                    </div>
                  ))}
                </div>
              )}
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
