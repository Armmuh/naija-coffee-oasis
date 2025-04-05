import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateCoffeeProducts } from '@/data/coffeeProducts';
import { Product } from '@/types/product';

interface ProductGridProps {
  activeCategory: string;
  sorting: string;
}

const ProductGrid = ({ activeCategory, sorting }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const { toast } = useToast();

  // Generate products on component mount
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    // Generate 150+ products
    const generatedProducts = generateCoffeeProducts();
    setProducts(generatedProducts);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter products when category or sorting changes
  useEffect(() => {
    let result = [...products];
    
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
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        // Keep default sorting (by ID)
        result.sort((a, b) => a.id - b.id);
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, activeCategory, sorting]);

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {filteredProducts.length} Products
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-md border border-border bg-card p-4">
              <Skeleton className="aspect-square w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {currentProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">Try changing your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  description={product.description}
                  stock={product.stock}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-r-none"
                >
                  Previous
                </Button>
                
                <div className="flex">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                    // Logic to show pagination centered around current page
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + idx;
                    } else {
                      pageNumber = currentPage - 2 + idx;
                    }
                    
                    return (
                      <Button
                        key={idx}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(pageNumber)}
                        className="rounded-none border-x-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-l-none"
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
