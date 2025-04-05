
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-coffee-dark font-playfair">
              Naija Coffee<span className="text-coffee-accent">Oasis</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-coffee-dark hover:text-coffee-accent font-medium transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-coffee-dark hover:text-coffee-accent font-medium transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-coffee-dark hover:text-coffee-accent font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-coffee-dark hover:text-coffee-accent font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Cart & User */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent">
              <Search size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent">
              <User size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-coffee-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" className="text-coffee-dark" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-coffee-dark hover:text-coffee-accent font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="text-coffee-dark hover:text-coffee-accent font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/about" 
                className="text-coffee-dark hover:text-coffee-accent font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-coffee-dark hover:text-coffee-accent font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex space-x-4 px-2 pt-2">
                <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent">
                  <Search size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent">
                  <User size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent relative">
                  <ShoppingBag size={20} />
                  <span className="absolute -top-1 -right-1 bg-coffee-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    0
                  </span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
