
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Package, CheckCircle2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const Checkout = () => {
  const { user, profile } = useAuth();
  const { cartItems, subTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pay-on-delivery');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Calculate order totals
  const shippingFee = subTotal > 0 ? 1500 : 0; // ₦1,500 for shipping
  const total = subTotal + shippingFee;
  
  useEffect(() => {
    // If cart is empty, redirect to shop
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/shop');
    }
    
    // Pre-fill form with user profile data if available
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setEmail(user?.email || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setCity(profile.city || '');
      setState(profile.state || '');
    }
  }, [cartItems.length, profile, user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to complete your order",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_price: total,
            shipping_address: `${address}, ${city}, ${state}`,
            payment_method: paymentMethod,
            shipping_fee: shippingFee,
            order_status: 'pending'
          }
        ])
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id.toString(),
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Update user profile if needed
      if (profile) {
        await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone,
            address,
            city,
            state,
            updated_at: new Date()
          })
          .eq('id', user.id);
      }
      
      // Clear cart and show success message
      clearCart();
      setIsSuccess(true);
      
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been received and is being processed.",
      });
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Order Failed",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate('/shop')}>
                  Continue Shopping
                </Button>
                <Button onClick={() => navigate('/dashboard')} variant="outline">
                  View Order History
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          value={state} 
                          onChange={(e) => setState(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea 
                        id="notes" 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Special instructions for delivery"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="pay-on-delivery" id="pod" />
                      <Label htmlFor="pod" className="flex items-center cursor-pointer">
                        <Package className="mr-2 h-5 w-5" />
                        Pay on Delivery
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="bank-transfer" id="bank" />
                      <Label htmlFor="bank" className="flex items-center cursor-pointer">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Bank Transfer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </form>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden mr-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₦{(item.price * item.quantity / 100).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{(subTotal / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₦{(shippingFee / 100).toLocaleString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₦{(total / 100).toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-coffee-dark hover:bg-coffee-accent"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
