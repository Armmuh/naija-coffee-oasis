
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

// Sample product data with added description and stock fields
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Lagos Gold Coffee Beans',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1770&auto=format&fit=crop',
    category: 'Coffee Beans',
    description: 'Premium Nigerian coffee beans with rich flavors and a smooth finish.',
    stock: 15
  },
  {
    id: 2,
    name: 'Aroma Press Coffee Maker',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1520903043060-bf3b12b4afa4?q=80&w=1769&auto=format&fit=crop',
    category: 'Accessories',
    description: 'High-quality coffee maker designed for optimal extraction and brewing results.',
    stock: 8
  },
  {
    id: 3,
    name: 'Nigerian Dark Roast',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1934&auto=format&fit=crop',
    category: 'Coffee Beans',
    description: 'Bold and aromatic dark roast made from locally sourced Nigerian beans.',
    stock: 20
  },
  {
    id: 4,
    name: 'Handcrafted Coffee Mug',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1770&auto=format&fit=crop',
    category: 'Accessories',
    description: 'Beautifully crafted premium ceramic mug, perfect for your morning brew.',
    stock: 12
  },
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // In a real application, you would fetch products from an API
    // For now, we're using the sample data
    setProducts(sampleProducts);
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our selection of premium Nigerian coffee beans and accessories, carefully curated for coffee enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={product.id} className={`animate-fade-in animate-delay-${(index + 1) * 100}`}>
              <ProductCard 
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                description={product.description}
                stock={product.stock}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
