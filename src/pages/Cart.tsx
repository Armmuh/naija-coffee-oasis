
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, subTotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Calculate shipping cost
  const shippingCost = subTotal > 0 ? 1500 : 0; // ₦1,500 for shipping
  const total = subTotal + shippingCost;
  
  const handleApplyCoupon = () => {
    toast({
      title: "Coupon Invalid",
      description: "The coupon code you entered is either invalid or expired.",
      variant: "destructive",
    });
    setCouponCode('');
  };
  
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to proceed to checkout.",
      });
      navigate('/auth', { state: { returnUrl: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-coffee-dark py-12 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-playfair mb-2">Shopping Cart</h1>
            <div className="flex items-center justify-center gap-2">
              <Link to="/" className="text-coffee-light/70 hover:text-white">Home</Link>
              <span>/</span>
              <span>Cart</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-coffee-light/20 mx-auto flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-coffee-dark" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Start shopping and add some items to your cart!</p>
              <Link to="/shop">
                <Button className="bg-coffee-dark text-white hover:bg-coffee-accent">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="lg:flex gap-8">
              <div className="lg:w-2/3 mb-8 lg:mb-0">
                {!user && (
                  <Alert className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Not signed in</AlertTitle>
                    <AlertDescription>
                      <Link to="/auth" className="font-medium underline">Sign in</Link> or create an account to save your cart and checkout.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="bg-white rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4">Product</th>
                          <th className="text-center p-4 whitespace-nowrap">Price</th>
                          <th className="text-center p-4">Quantity</th>
                          <th className="text-center p-4 whitespace-nowrap">Subtotal</th>
                          <th className="p-4 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id} className="border-t border-border">
                            <td className="p-4">
                              <div className="flex items-center">
                                <div className="w-16 h-16 rounded bg-muted flex-shrink-0 overflow-hidden mr-4">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <h3 className="font-medium line-clamp-2">{item.name}</h3>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center whitespace-nowrap">
                              ₦{(item.price / 100).toLocaleString()}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-none"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <div className="h-8 px-3 flex items-center justify-center border-y border-input min-w-[40px]">
                                  {item.quantity}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-none"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="p-4 text-center whitespace-nowrap font-medium">
                              ₦{((item.price * item.quantity) / 100).toLocaleString()}
                            </td>
                            <td className="p-4 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="max-w-[180px]"
                    />
                    <Button 
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode}
                    >
                      Apply Coupon
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    className="text-muted-foreground"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="bg-muted/30 rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium">₦{(subTotal / 100).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shippingCost > 0 ? `₦${(shippingCost / 100).toLocaleString()}` : 'Free'}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-xl">₦{(total / 100).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-coffee-dark hover:bg-coffee-accent text-white flex items-center justify-center gap-2"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="mt-6 text-sm text-muted-foreground">
                    <p>Shipping costs calculated at checkout.</p>
                    <p>Secure payments powered by Paystack.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
