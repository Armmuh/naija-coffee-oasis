
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-md border border-border bg-background shadow-sm transition-all hover:shadow-md">
      <Link to={`/shop/${id}`} className="block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-1 text-sm text-muted-foreground">{category}</div>
        <Link to={`/shop/${id}`} className="block">
          <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-semibold">
            ₦{price.toLocaleString()}
          </div>
          <Button 
            size="sm" 
            className="bg-coffee-dark text-coffee-light hover:bg-coffee-accent"
            title="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
