
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Package, MapPin, CreditCard, Heart, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setCity(profile.city || '');
      setState(profile.state || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // If not logged in, redirect to login page
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items:order_items(*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateProfile = async () => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
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
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading...</p>
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
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-coffee-dark rounded-full flex items-center justify-center">
                    <User className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="font-semibold">{firstName} {lastName}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <nav className="space-y-1">
                  <Button 
                    variant={activeTab === 'profile' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === 'orders' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('orders')}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Button>
                  <Button 
                    variant={activeTab === 'addresses' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('addresses')}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Addresses
                  </Button>
                  <Button 
                    variant={activeTab === 'payment' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('payment')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Methods
                  </Button>
                  <Button 
                    variant={activeTab === 'wishlist' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('wishlist')}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Button>
                  
                  <hr className="my-2" />
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </nav>
              </div>
            </div>
            
            <div className="md:w-3/4">
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={user?.email || ''} 
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={updateProfile} 
                      disabled={isUpdating}
                      className="bg-coffee-dark hover:bg-coffee-accent"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {activeTab === 'addresses' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Address Information</CardTitle>
                    <CardDescription>
                      Update your shipping and billing addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          value={address} 
                          onChange={(e) => setAddress(e.target.value)} 
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            value={state} 
                            onChange={(e) => setState(e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={updateProfile} 
                      disabled={isUpdating}
                      className="bg-coffee-dark hover:bg-coffee-accent"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {activeTab === 'orders' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View the status and details of your orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                        <p className="mt-2 text-gray-500">
                          You haven't placed any orders yet.
                        </p>
                        <Button className="mt-4 bg-coffee-dark hover:bg-coffee-accent">
                          Start Shopping
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₦{order.total_price/100}</p>
                                <p className="text-sm text-gray-500">
                                  Status: <span className="capitalize">{order.order_status}</span>
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              {order.order_items.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <span>{item.product_name} × {item.quantity}</span>
                                  <span>₦{item.product_price/100}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {activeTab === 'payment' && (
                <div className="text-center py-12">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No payment methods</h3>
                  <p className="mt-2 text-gray-500">
                    You haven't added any payment methods yet.
                  </p>
                </div>
              )}
              
              {activeTab === 'wishlist' && (
                <div className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
                  <p className="mt-2 text-gray-500">
                    Save items you love to your wishlist.
                  </p>
                  <Button className="mt-4 bg-coffee-dark hover:bg-coffee-accent">
                    Browse Products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
