
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CategoryProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const CategoryCard = ({ title, description, image, link }: CategoryProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg group">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 flex flex-col justify-end p-6">
        <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/80 mb-4">{description}</p>
        <div>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-coffee-dark"
            asChild
          >
            <Link to={link}>
              Browse Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const CoffeeCategories = () => {
  const categories = [
    {
      title: 'Coffee Beans',
      description: 'Premium Nigerian coffee beans with rich flavors.',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1756&auto=format&fit=crop',
      link: '/shop?category=beans',
    },
    {
      title: 'Brewing Equipment',
      description: 'High-quality coffee makers and brewing tools.',
      image: 'https://images.unsplash.com/photo-1442975631115-c4f7b05b8a2c?q=80&w=1742&auto=format&fit=crop',
      link: '/shop?category=equipment',
    },
    {
      title: 'Accessories',
      description: 'Mugs, storage containers, and more for coffee lovers.',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1770&auto=format&fit=crop',
      link: '/shop?category=accessories',
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of premium Nigerian coffee products, thoughtfully categorized for your convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={category.title} className={`animate-fade-in animate-delay-${(index + 1) * 100}`}>
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoffeeCategories;
