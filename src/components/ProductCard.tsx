
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  category,
  stock,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!user) {
      // User not authenticated, show toast and redirect
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    
    if (stock < 1) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      id,
      name,
      price,
      image,
      quantity,
    });

    toast({
      title: "Added to Cart",
      description: `${quantity} x ${name} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <Link to={`/shop/${id}`} className="block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <Badge variant="secondary" className="bg-coffee-light/30 text-coffee-dark hover:bg-coffee-light/50">
            {category}
          </Badge>
          {stock <= 3 && stock > 0 && (
            <Badge variant="outline" className="ml-2 text-amber-600 border-amber-600">
              Low Stock
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="outline" className="ml-2 text-red-600 border-red-600">
              Out of Stock
            </Badge>
          )}
        </div>
        <Link to={`/shop/${id}`} className="block">
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-lg">₦{(price / 100).toLocaleString()}</span>
          <Button
            size="sm"
            className="bg-coffee-dark hover:bg-coffee-accent"
            onClick={handleAddToCart}
            disabled={stock === 0}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
