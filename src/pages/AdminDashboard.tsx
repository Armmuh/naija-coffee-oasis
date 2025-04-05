
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Package, Users, Coffee, ShoppingCart, Trash2, Edit, FilePlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  order_status: string;
  total_price: number;
  shipping_address: string;
  payment_method: string;
  shipping_fee: number;
  created_at: string;
  profiles: any;
  order_items: any[];
}

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Product form state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productImage, setProductImage] = useState('');
  
  // Order detail modal
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState('');

  useEffect(() => {
    if (user && isAdmin) {
      fetchProducts();
      fetchOrders();
      fetchUsers();
    }
  }, [user, isAdmin]);

  // If not logged in or not an admin, redirect to login page
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/" replace />;
  }

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id(first_name, last_name, email),
          order_items(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openProductModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setProductName(product.name);
      setProductDescription(product.description);
      setProductPrice(String(product.price / 100));
      setProductCategory(product.category);
      setProductStock(String(product.stock));
      setProductImage(product.image_url || '');
    } else {
      setEditingProduct(null);
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductCategory('');
      setProductStock('');
      setProductImage('');
    }
    
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      const priceInKobo = Math.round(parseFloat(productPrice) * 100);
      const productData = {
        name: productName,
        description: productDescription,
        price: priceInKobo,
        category: productCategory,
        stock: parseInt(productStock),
        image_url: productImage,
      };

      let result;

      if (editingProduct) {
        // Update existing product
        result = await supabase
          .from('products')
          .update({
            ...productData,
            updated_at: new Date()
          })
          .eq('id', editingProduct.id);
      } else {
        // Create new product
        result = await supabase
          .from('products')
          .insert([productData]);
      }

      if (result.error) throw result.error;
      
      toast({
        title: editingProduct ? 'Product Updated' : 'Product Created',
        description: `${productName} has been ${editingProduct ? 'updated' : 'created'} successfully.`,
      });
      
      setIsProductModalOpen(false);
      fetchProducts();
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', product.id);
        
        if (error) throw error;
        
        toast({
          title: 'Product Deleted',
          description: `${product.name} has been deleted successfully.`,
        });
        
        fetchProducts();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setOrderStatus(order.order_status);
    setIsOrderModalOpen(true);
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          order_status: orderStatus,
          updated_at: new Date()
        })
        .eq('id', selectedOrder.id);
      
      if (error) throw error;
      
      toast({
        title: 'Order Updated',
        description: `Order status has been updated to ${orderStatus}.`,
      });
      
      setIsOrderModalOpen(false);
      fetchOrders();
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading || isLoading) {
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
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex mb-6">
              <TabsList className="mr-auto">
                <TabsTrigger value="products" className="flex items-center">
                  <Coffee className="mr-2 h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Customers
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'products' && (
                <Button 
                  onClick={() => openProductModal()}
                  className="bg-coffee-dark hover:bg-coffee-accent flex items-center"
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              )}
            </div>

            <TabsContent value="products" className="border rounded-lg bg-white p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {product.image_url && (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-10 h-10 rounded object-cover mr-3"
                            />
                          )}
                          <div>
                            <div>{product.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description.substring(0, 50)}
                              {product.description.length > 50 ? '...' : ''}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">₦{(product.price / 100).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => openProductModal(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="orders" className="border rounded-lg bg-white p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          {order.profiles?.first_name} {order.profiles?.last_name}
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ₦{(order.total_price / 100).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs capitalize 
                            ${order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.order_status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                            ${order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                            ${order.order_status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                            ${order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {order.order_status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openOrderModal(order)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="users" className="border rounded-lg bg-white p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{user.city}, {user.state || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <span className={`px-2 py-1 rounded text-xs
                          ${user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`
                        }>
                          {user.is_admin ? 'Admin' : 'Customer'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Product Dialog */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Create Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product details below.' : 'Add a new product to your store.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-name" className="text-right">
                Name
              </Label>
              <Input
                id="product-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-category" className="text-right">
                Category
              </Label>
              <Input
                id="product-category"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-price" className="text-right">
                Price (₦)
              </Label>
              <Input
                id="product-price"
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-stock" className="text-right">
                Stock
              </Label>
              <Input
                id="product-stock"
                type="number"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-image" className="text-right">
                Image URL
              </Label>
              <Input
                id="product-image"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="product-description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveProduct} className="bg-coffee-dark hover:bg-coffee-accent">
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order #{selectedOrder.id.slice(0, 8)}</DialogTitle>
              <DialogDescription>
                {new Date(selectedOrder.created_at).toLocaleDateString()} by {selectedOrder.profiles?.first_name} {selectedOrder.profiles?.last_name}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex justify-between mb-4">
                <div>
                  <h4 className="font-medium">Customer</h4>
                  <p className="text-sm">{selectedOrder.profiles?.email}</p>
                </div>
                <div className="text-right">
                  <h4 className="font-medium">Total</h4>
                  <p className="text-lg font-bold">₦{(selectedOrder.total_price / 100).toLocaleString()}</p>
                </div>
              </div>
              
              <h4 className="font-medium mt-4 mb-2">Items</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.order_items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">₦{(item.product_price / 100).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6">
                <Label htmlFor="order-status">Order Status</Label>
                <Select value={orderStatus} onValueChange={setOrderStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={handleUpdateOrderStatus} className="bg-coffee-dark hover:bg-coffee-accent">
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;
