
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, Info } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
}

const ProductCard = ({ id, name, price, image, category, description, stock }: ProductCardProps) => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  const displayCategory = () => {
    switch (category) {
      case 'coffee-beans':
        return 'Coffee Beans';
      case 'instant-coffee':
        return 'Instant Coffee';
      case 'coffee-pods':
        return 'Coffee Pods';
      case 'accessories':
        return 'Accessories';
      case 'gift-sets':
        return 'Gift Sets';
      case 'brewing-equipment':
        return 'Brewing Equipment';
      default:
        return category;
    }
  };
  
  const handleAddToCart = () => {
    if (stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      id,
      name,
      price,
      image,
      quantity: 1,
    });
    
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-md border border-border bg-background shadow-sm transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/shop/${id}`} className="block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        
        {stock > 0 && stock <= 5 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
            Low Stock: {stock}
          </div>
        )}
      </Link>
      
      <div className="p-4">
        <div className="mb-1 text-sm text-muted-foreground">{displayCategory()}</div>
        <Link to={`/shop/${id}`} className="block">
          <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
        </Link>
        
        <div className="mt-2 mb-3 text-sm line-clamp-2 text-muted-foreground">
          {description}
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="font-semibold">
            ₦{price.toLocaleString()}
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-coffee-dark hover:bg-coffee-light"
                    asChild
                  >
                    <Link to={`/shop/${id}`}>
                      <Info className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              size="sm" 
              className={`${
                stock === 0 
                  ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" 
                  : "bg-coffee-dark text-coffee-light hover:bg-coffee-accent"
              }`}
              title={stock === 0 ? "Out of Stock" : "Add to cart"}
              onClick={handleAddToCart}
              disabled={stock === 0}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
