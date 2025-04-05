
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-pattern text-coffee-light">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-coffee-light">Naija Coffee Oasis</h3>
            <p className="mb-4 text-coffee-light/80">
              Premium Nigerian coffee beans and accessories, bringing the rich flavors of Nigerian coffee culture to your home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-coffee-light hover:text-coffee-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-coffee-light hover:text-coffee-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-coffee-light hover:text-coffee-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-coffee-light/80 hover:text-coffee-light transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="text-coffee-light/80 hover:text-coffee-light transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/about" className="text-coffee-light/80 hover:text-coffee-light transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-coffee-light/80 hover:text-coffee-light transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-coffee-light/80 hover:text-coffee-light transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-coffee-light/80 hover:text-coffee-light transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns" className="text-coffee-light/80 hover:text-coffee-light transition-colors">Returns & Refunds</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-coffee-light/80 hover:text-coffee-light transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span className="text-coffee-light/80">+234 (0) 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span className="text-coffee-light/80">info@naijacoffeeoasis.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span className="text-coffee-light/80">123 Coffee Street, Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="my-8 border-coffee-light/20" />
        
        <p className="text-center text-coffee-light/60 text-sm">
          © {new Date().getFullYear()} Naija Coffee Oasis. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
