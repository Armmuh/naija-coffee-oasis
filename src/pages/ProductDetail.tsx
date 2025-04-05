
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, Minus, Plus, ArrowLeft, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);
  
  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock < quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} items available.`,
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      id: parseInt(product.id.replace(/-/g, '').substring(0, 8), 16),
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity,
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center text-coffee-dark hover:text-coffee-accent mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Skeleton className="aspect-square w-full" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ) : product ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">12 reviews</span>
                </div>
                
                <p className="text-2xl font-bold text-coffee-dark mb-4">
                  ₦{(product.price / 100).toLocaleString()}
                </p>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Category</h3>
                  <p className="text-gray-600">{product.category}</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-medium mb-3">Quantity</h3>
                  <div className="flex items-center">
                    <Button
                      variant="outline" 
                      size="icon"
                      className="rounded-r-none"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="px-6 py-2 border-y border-x-0 border-input">
                      {quantity}
                    </div>
                    <Button
                      variant="outline" 
                      size="icon"
                      className="rounded-l-none"
                      onClick={incrementQuantity}
                      disabled={product.stock <= quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    
                    <span className="ml-4 text-sm text-gray-500">
                      {product.stock} items available
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-coffee-dark hover:bg-coffee-accent"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
              <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
              <Link to="/shop">
                <Button className="bg-coffee-dark hover:bg-coffee-accent">
                  Return to Shop
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
