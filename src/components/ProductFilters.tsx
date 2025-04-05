
import { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductFiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sorting: string;
  setSorting: (sort: string) => void;
}

const ProductFilters = ({ 
  activeCategory, 
  setActiveCategory,
  sorting,
  setSorting
}: ProductFiltersProps) => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000]);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [showSorting, setShowSorting] = useState<boolean>(true);
  const [showPrice, setShowPrice] = useState<boolean>(true);
  
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'coffee-beans', label: 'Coffee Beans' },
    { value: 'instant-coffee', label: 'Instant Coffee' },
    { value: 'coffee-pods', label: 'Coffee Pods' },
    { value: 'accessories', label: 'Coffee Accessories' },
    { value: 'gift-sets', label: 'Gift Sets' },
    { value: 'brewing-equipment', label: 'Brewing Equipment' }
  ];
  
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>Filters</span>
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      
      {(showFilters || window.innerWidth >= 768) && (
        <>
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setShowSorting(!showSorting)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Sort By</CardTitle>
                {showSorting ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </CardHeader>
            {showSorting && (
              <CardContent>
                <RadioGroup value={sorting} onValueChange={setSorting}>
                  {sortOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
                      <Label htmlFor={`sort-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setShowPrice(!showPrice)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Price Range</CardTitle>
                {showPrice ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </CardHeader>
            {showPrice && (
              <CardContent>
                <Slider
                  defaultValue={[0, 20000]}
                  max={20000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-6"
                />
                <div className="flex items-center justify-between">
                  <span>₦{priceRange[0].toLocaleString()}</span>
                  <span>₦{priceRange[1].toLocaleString()}</span>
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map(category => (
                  <div
                    key={category.value}
                    className={`px-3 py-2 cursor-pointer rounded-md transition-colors ${
                      activeCategory === category.value
                        ? "bg-coffee-dark text-white"
                        : "hover:bg-coffee-light"
                    }`}
                    onClick={() => setActiveCategory(category.value)}
                  >
                    {category.label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProductFilters;
