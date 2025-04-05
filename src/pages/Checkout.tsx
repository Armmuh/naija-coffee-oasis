import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const { cartItems, subTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(profile?.address || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  
  const shippingCost = subTotal > 0 ? 1500 : 0;
  const total = subTotal + shippingCost;
  
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setShippingAddress(profile.address || '');
      setCity(profile.city || '');
      setState(profile.state || '');
    }
  }, [profile]);
  
  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place your order.",
      });
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before placing an order.",
      });
      return;
    }
    
    try {
      // 1. Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_price: total,
            shipping_address: shippingAddress,
            payment_method: paymentMethod,
            shipping_fee: shippingCost,
            order_status: 'pending',
          }
        ])
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      const orderId = orderData.id;
      
      // 2. Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderId,
        product_id: String(item.id),
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
      }));
      
      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (orderItemsError) throw orderItemsError;
      
      // 3. Update user profile
      await updateUserProfile();
      
      // 4. Clear cart
      clearCart();
      
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
      });
      
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateUserProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          address: shippingAddress,
          city: city,
          state: state,
          updated_at: new Date().toISOString() // Convert Date to ISO string
        })
        .eq('id', user!.id);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-coffee-dark py-12 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-playfair mb-2">Checkout</h1>
            <div className="flex items-center justify-center gap-2">
              <a href="/" className="text-coffee-light/70 hover:text-white">Home</a>
              <span>/</span>
              <a href="/cart" className="text-coffee-light/70 hover:text-white">Cart</a>
              <span>/</span>
              <span>Checkout</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Your cart is empty</AlertTitle>
                <AlertDescription>
                  Please add items to your cart before proceeding to checkout.
                </AlertDescription>
              </Alert>
              <a href="/shop">
                <Button className="bg-coffee-dark text-white hover:bg-coffee-accent">
                  Browse Products
                </Button>
              </a>
            </div>
          ) : (
            <div className="lg:flex gap-8">
              <div className="lg:w-2/3 mb-8 lg:mb-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingAddress">Shipping Address</Label>
                      <Input
                        id="shippingAddress"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Input
                          type="radio"
                          id="paystack"
                          name="paymentMethod"
                          value="paystack"
                          checked={paymentMethod === 'paystack'}
                          onChange={() => setPaymentMethod('paystack')}
                        />
                        <Label htmlFor="paystack" className="ml-2">Paystack</Label>
                      </div>
                      {/* Add other payment methods here */}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:w-1/3">
                <div className="bg-muted/30 rounded-lg border border-border p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-medium">₦{((item.price * item.quantity) / 100).toLocaleString()}</span>
                      </div>
                    ))}
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
                    onClick={handlePlaceOrder}
                  >
                    Place Order
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

export default Checkout;
