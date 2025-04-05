
import { Product } from '@/types/product';

// Function to generate coffee product names
const generateProductName = (type: string, variant: string) => {
  const origins = [
    'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Kaduna', 'Enugu', 
    'Calabar', 'Jos', 'Benin', 'Owerri', 'Oyo', 'Abeokuta', 'Maiduguri', 'Warri'
  ];
  const descriptors = [
    'Premium', 'Signature', 'Artisan', 'Select', 'Reserve', 'Gourmet', 'Estate',
    'Single Origin', 'Specialty', 'Traditional', 'Heritage', 'Classic', 'Royal', 'Gold', 'Diamond'
  ];
  const flavors = [
    'Rich', 'Bold', 'Smooth', 'Robust', 'Fruity', 'Nutty', 'Aromatic', 'Delicate',
    'Complex', 'Exotic', 'Spiced', 'Chocolate', 'Caramel', 'Floral', 'Citrus'
  ];
  
  if (type === 'brewing-equipment') {
    const equipmentTypes = ['Brewer', 'French Press', 'Pour Over', 'Moka Pot', 'Coffee Maker', 'Espresso Machine', 'Grinder'];
    return `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]}`;
  }
  
  if (type === 'accessories') {
    const accessoryTypes = ['Mug', 'Cup', 'Tumbler', 'Filter', 'Spoon', 'Scale', 'Storage Container', 'Travel Kit', 'Thermometer', 'Timer'];
    return `${descriptors[Math.floor(Math.random() * descriptors.length)]} Coffee ${accessoryTypes[Math.floor(Math.random() * accessoryTypes.length)]}`;
  }
  
  if (type === 'gift-sets') {
    return `${descriptors[Math.floor(Math.random() * descriptors.length)]} Coffee Gift Set - ${origins[Math.floor(Math.random() * origins.length)]} Collection`;
  }
  
  // For coffee products
  const origin = origins[Math.floor(Math.random() * origins.length)];
  const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
  const flavor = flavors[Math.floor(Math.random() * flavors.length)];
  
  if (variant) {
    return `${origin} ${descriptor} ${variant} - ${flavor} Blend`;
  }
  
  return `${origin} ${descriptor} Coffee - ${flavor} Blend`;
};

// Function to generate product descriptions
const generateDescription = (type: string) => {
  const descriptions = {
    'coffee-beans': [
      'Hand-selected Nigerian coffee beans with rich, complex flavors and a smooth finish.',
      'Expertly roasted to perfection, these beans deliver a bold, aromatic experience in every cup.',
      'Sustainably sourced beans with notes of chocolate, caramel, and subtle fruity undertones.',
      'A medium-dark roast that brings out the unique character of Nigerian-grown coffee.',
      'Carefully processed beans that showcase the distinctive terroir of Nigerian highlands.'
    ],
    'instant-coffee': [
      'Premium instant coffee that dissolves quickly for a rich, flavorful cup with minimal effort.',
      'Made from 100% Nigerian coffee beans, freeze-dried to preserve their authentic flavor.',
      'Convenient instant coffee with the rich taste and aroma of freshly brewed coffee.',
      'Our special drying process ensures a smooth taste with no bitter aftertaste.',
      'Perfect for busy mornings or travel, delivering consistent quality in every cup.'
    ],
    'coffee-pods': [
      'Compatible coffee pods that deliver a fresh, full-bodied brew with every use.',
      'Each pod contains perfectly ground Nigerian coffee for optimal extraction and flavor.',
      'Convenient pods that lock in freshness and deliver consistent quality every time.',
      'Environmentally friendly pods made with recyclable materials and premium coffee.',
      'Experience the rich heritage of Nigerian coffee in a convenient, single-serve format.'
    ],
    'accessories': [
      'High-quality coffee accessory designed to enhance your brewing experience.',
      'Beautifully crafted with premium materials for both functionality and aesthetics.',
      'Essential tool for coffee enthusiasts who appreciate precision and quality.',
      'Designed with both professional baristas and home brewers in mind.',
      'Elevate your coffee ritual with this thoughtfully designed accessory.'
    ],
    'gift-sets': [
      'A carefully curated collection of our finest products, perfect for gifting to coffee lovers.',
      'This elegant gift set showcases the rich diversity of Nigerian coffee culture.',
      'A premium selection that makes an impressive present for any occasion.',
      'Packaged in a beautiful box, this set offers a taste of authentic Nigerian coffee tradition.',
      'The perfect introduction to our brand, featuring our most popular products.'
    ],
    'brewing-equipment': [
      'Professional-grade equipment designed for optimal extraction and brewing results.',
      'Precision-engineered to deliver consistent, cafe-quality coffee at home.',
      'Combining modern technology with traditional brewing principles for superior results.',
      'Durable construction and thoughtful design for years of reliable performance.',
      'The perfect tool for coffee enthusiasts who demand excellence in every cup.'
    ]
  };
  
  const typeDescriptions = descriptions[type as keyof typeof descriptions] || descriptions['coffee-beans'];
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
};

// Function to generate image URLs for products
const generateImageUrl = (type: string) => {
  const coffeeImages = [
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1934&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=1784&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1770&auto=format&fit=crop'
  ];
  
  const accessoryImages = [
    'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516224498413-84ecf3a1e98d?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572119865084-43c285814d63?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516748089746-3ada2f31e3f9?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585665368752-aca13c50d2e9?q=80&w=1770&auto=format&fit=crop'
  ];
  
  const equipmentImages = [
    'https://images.unsplash.com/photo-1520903043060-bf3b12b4afa4?q=80&w=1769&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584736286279-5d85d32ba79f?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570286424717-e0f16e0c1b35?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595785925591-1547d31b6c7b?q=80&w=1771&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?q=80&w=1770&auto=format&fit=crop'
  ];
  
  const giftImages = [
    'https://images.unsplash.com/photo-1531677917949-569c4c4bb5a5?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607325409975-f1c843a12eb1?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610782258229-08c5950d198b?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1639657916819-aadfde3af8f7?q=80&w=1770&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=1770&auto=format&fit=crop'
  ];
  
  switch(type) {
    case 'coffee-beans':
    case 'instant-coffee':
    case 'coffee-pods':
      return coffeeImages[Math.floor(Math.random() * coffeeImages.length)];
    case 'accessories':
      return accessoryImages[Math.floor(Math.random() * accessoryImages.length)];
    case 'brewing-equipment':
      return equipmentImages[Math.floor(Math.random() * equipmentImages.length)];
    case 'gift-sets':
      return giftImages[Math.floor(Math.random() * giftImages.length)];
    default:
      return coffeeImages[Math.floor(Math.random() * coffeeImages.length)];
  }
};

// Function to generate price based on product type
const generatePrice = (type: string) => {
  const priceRanges = {
    'coffee-beans': [2500, 7500],
    'instant-coffee': [1500, 4500],
    'coffee-pods': [3000, 8000],
    'accessories': [1200, 6000],
    'gift-sets': [8000, 20000],
    'brewing-equipment': [5000, 18000]
  };
  
  const range = priceRanges[type as keyof typeof priceRanges] || [1000, 5000];
  const minPrice = range[0];
  const maxPrice = range[1];
  
  // Generate a random price within the range, rounded to nearest 100 Naira
  return Math.round((Math.random() * (maxPrice - minPrice) + minPrice) / 100) * 100;
};

// Function to generate product stock quantity
const generateStock = () => {
  // Generate random stock between 0 and 50
  // With 10% chance of being out of stock (0)
  if (Math.random() < 0.1) {
    return 0;
  }
  return Math.floor(Math.random() * 50) + 1;
};

// Main function to generate coffee products
export const generateCoffeeProducts = (): Product[] => {
  const products: Product[] = [];
  let id = 1;
  
  // Coffee Beans (40 products)
  const beanTypes = ['Arabica', 'Robusta', 'Blend', 'Peaberry', 'Liberica'];
  const roasts = ['Light Roast', 'Medium Roast', 'Dark Roast', 'Espresso Roast', 'French Roast'];
  
  for (let i = 0; i < 40; i++) {
    const beanType = beanTypes[Math.floor(Math.random() * beanTypes.length)];
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    products.push({
      id: id++,
      name: generateProductName('coffee-beans', `${beanType} ${roast}`),
      description: generateDescription('coffee-beans'),
      price: generatePrice('coffee-beans'),
      category: 'coffee-beans',
      image: generateImageUrl('coffee-beans'),
      stock: generateStock()
    });
  }
  
  // Instant Coffee (25 products)
  const instantTypes = ['Classic', 'Premium', 'Decaf', 'Flavored', 'Organic'];
  for (let i = 0; i < 25; i++) {
    const instantType = instantTypes[Math.floor(Math.random() * instantTypes.length)];
    products.push({
      id: id++,
      name: generateProductName('instant-coffee', `${instantType} Instant`),
      description: generateDescription('instant-coffee'),
      price: generatePrice('instant-coffee'),
      category: 'instant-coffee',
      image: generateImageUrl('instant-coffee'),
      stock: generateStock()
    });
  }
  
  // Coffee Pods (25 products)
  for (let i = 0; i < 25; i++) {
    products.push({
      id: id++,
      name: generateProductName('coffee-pods', 'Coffee Pods'),
      description: generateDescription('coffee-pods'),
      price: generatePrice('coffee-pods'),
      category: 'coffee-pods',
      image: generateImageUrl('coffee-pods'),
      stock: generateStock()
    });
  }
  
  // Accessories (25 products)
  for (let i = 0; i < 25; i++) {
    products.push({
      id: id++,
      name: generateProductName('accessories', ''),
      description: generateDescription('accessories'),
      price: generatePrice('accessories'),
      category: 'accessories',
      image: generateImageUrl('accessories'),
      stock: generateStock()
    });
  }
  
  // Brewing Equipment (20 products)
  for (let i = 0; i < 20; i++) {
    products.push({
      id: id++,
      name: generateProductName('brewing-equipment', ''),
      description: generateDescription('brewing-equipment'),
      price: generatePrice('brewing-equipment'),
      category: 'brewing-equipment',
      image: generateImageUrl('brewing-equipment'),
      stock: generateStock()
    });
  }
  
  // Gift Sets (15 products)
  for (let i = 0; i < 15; i++) {
    products.push({
      id: id++,
      name: generateProductName('gift-sets', ''),
      description: generateDescription('gift-sets'),
      price: generatePrice('gift-sets'),
      category: 'gift-sets',
      image: generateImageUrl('gift-sets'),
      stock: generateStock()
    });
  }
  
  return products;
};
