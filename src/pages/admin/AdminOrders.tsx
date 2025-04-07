
import { useState, useEffect } from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

const AdminOrders = () => {
  const { user, isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState('');

  useEffect(() => {
    if (user && isAdmin) {
      fetchOrders();
    }
  }, [user, isAdmin]);

  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

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
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
          updated_at: new Date().toISOString()
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
      <AdminPageLayout title="Orders" icon={<Package className="text-white" size={24} />}>
        <div className="flex justify-center items-center h-48">
          <p>Loading orders...</p>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Orders" description="View and manage all your customer orders" icon={<Package className="text-white" size={24} />}>
      <div className="border rounded-lg bg-white p-6">
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
      </div>

      {/* Order Modal */}
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
              <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>
                Close
              </Button>
              <Button onClick={handleUpdateOrderStatus} className="bg-coffee-dark hover:bg-coffee-accent">
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminPageLayout>
  );
};

export default AdminOrders;
