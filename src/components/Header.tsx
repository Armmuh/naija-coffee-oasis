
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User, LogOut, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const handleSearch = (query: string) => {
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

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
            <Link 
              to="/" 
              className={`${location.pathname === '/' ? 'text-coffee-accent' : 'text-coffee-dark'} hover:text-coffee-accent font-medium transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className={`${location.pathname === '/shop' ? 'text-coffee-accent' : 'text-coffee-dark'} hover:text-coffee-accent font-medium transition-colors`}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className={`${location.pathname === '/about' ? 'text-coffee-accent' : 'text-coffee-dark'} hover:text-coffee-accent font-medium transition-colors`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`${location.pathname === '/contact' ? 'text-coffee-accent' : 'text-coffee-dark'} hover:text-coffee-accent font-medium transition-colors`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Cart & User */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-coffee-dark hover:text-coffee-accent"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent relative">
                    <User size={20} />
                    {isAdmin && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-coffee-accent rounded-full"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {profile?.first_name 
                      ? `${profile.first_name} ${profile.last_name}` 
                      : user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent">
                  <User size={20} />
                </Button>
              </Link>
            )}
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent relative">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-coffee-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-coffee-dark" 
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-coffee-dark relative">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-coffee-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
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
                className={`${location.pathname === '/' ? 'text-coffee-accent' : 'text-coffee-dark'} hover:text-coffee-accent font-medium transition-colors px-2 py-1`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className={`${location.pathname === '/shop' ? 'text-coffee-accent' : 'text-coffee-dark'} hover:text-coffee-accent font-medium transition-colors px-2 py-1`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/about" 
                className={`${location.pathname === '/about' ? 'text-coffee-accent' : 'text-coffee-dark'} hover:text-coffee-accent font-medium transition-colors px-2 py-1`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`${location.pathname === '/contact' ? 'text-coffee-accent' : 'text-coffee-dark'} hover:text-coffee-accent font-medium transition-colors px-2 py-1`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex space-x-4 px-2 pt-2">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent">
                        <User size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}>
                        My Account
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => {
                          navigate('/admin');
                          setIsMenuOpen(false);
                        }}>
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}>
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="icon" className="text-coffee-dark hover:text-coffee-accent">
                      <User size={20} />
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      {/* Search Dialog */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="top" className="h-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Search Products</SheetTitle>
            <SheetDescription>
              Find the perfect coffee and accessories for your taste
            </SheetDescription>
          </SheetHeader>
          <SearchBar onSearch={handleSearch} />
          <SheetFooter className="mt-4 flex justify-end">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
