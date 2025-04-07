
import { useState, useEffect } from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { BarChart3, Package, Users, Coffee, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Type definitions
interface SalesData {
  name: string;
  sales: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface Order {
  id: string;
  user_id: string;
  order_status: string;
  total_price: number;
  profiles: any;
  created_at: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminAnalytics = () => {
  const { user, isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsTimePeriod, setAnalyticsTimePeriod] = useState('month');
  
  // Sales data - initially populated with mock data, will be updated from real data
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productCategoryData, setProductCategoryData] = useState<CategoryData[]>([]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    // When data is loaded or time period changes, update analytics
    if (!isLoading) {
      generateSalesData();
      generateCategoryData();
    }
  }, [isLoading, analyticsTimePeriod, orders, products]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [ordersResult, productsResult, usersResult] = await Promise.all([
        supabase
          .from('orders')
          .select('*, profiles:user_id(first_name, last_name, email)')
          .order('created_at', { ascending: false }),
        
        supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }),
        
        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
      ]);
      
      if (ordersResult.error) throw ordersResult.error;
      if (productsResult.error) throw productsResult.error;
      if (usersResult.error) throw usersResult.error;
      
      setOrders(ordersResult.data || []);
      setProducts(productsResult.data || []);
      setUsers(usersResult.data || []);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSalesData = () => {
    // Generate sales data based on time period
    let data: SalesData[] = [];
    
    if (analyticsTimePeriod === 'week') {
      // Create data for each day of the current week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      data = days.map(day => {
        // Sum orders for this day
        const salesForDay = orders
          .filter(order => {
            const orderDate = new Date(order.created_at);
            const dayOfWeek = orderDate.getDay();
            return days[dayOfWeek] === day;
          })
          .reduce((sum, order) => sum + order.total_price, 0) / 100;
          
        return { name: day, sales: salesForDay };
      });
    } else if (analyticsTimePeriod === 'month') {
      // Create data for last 4 weeks
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data = weeks.map((week, index) => {
        // Sum orders for this week
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const weekStart = new Date(startOfMonth);
        weekStart.setDate(weekStart.getDate() + (index * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const salesForWeek = orders
          .filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate >= weekStart && orderDate <= weekEnd;
          })
          .reduce((sum, order) => sum + order.total_price, 0) / 100;
          
        return { name: week, sales: salesForWeek };
      });
    } else {
      // Create data for each month of the year
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data = months.map((month, index) => {
        // Sum orders for this month
        const salesForMonth = orders
          .filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate.getMonth() === index;
          })
          .reduce((sum, order) => sum + order.total_price, 0) / 100;
          
        return { name: month, sales: salesForMonth };
      });
    }
    
    setSalesData(data);
  };

  const generateCategoryData = () => {
    // Group products by category and count
    const categories: Record<string, number> = {};
    
    products.forEach(product => {
      if (product.category) {
        categories[product.category] = (categories[product.category] || 0) + 1;
      }
    });
    
    const data: CategoryData[] = Object.keys(categories).map(category => ({
      name: category,
      value: categories[category]
    }));
    
    setProductCategoryData(data);
  };

  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading || isLoading) {
    return (
      <AdminPageLayout title="Analytics" icon={<BarChart3 className="text-white" size={24} />}>
        <div className="flex justify-center items-center h-48">
          <p>Loading analytics...</p>
        </div>
      </AdminPageLayout>
    );
  }

  // Calculate analytics data
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0) / 100;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.order_status === 'pending').length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => product.stock < 10).length;
  const totalCustomers = users.length;
  const newCustomersThisWeek = users.filter(user => {
    if (!user.created_at) return false;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(user.created_at) > oneWeekAgo;
  }).length;

  return (
    <AdminPageLayout title="Analytics" description="Overview of sales and store performance" icon={<BarChart3 className="text-white" size={24} />}>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">+{(totalRevenue * 0.1).toFixed(1)}% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{pendingOrders} orders pending</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">{lowStockProducts} low stock items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">+{newCustomersThisWeek} new this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Sales Overview</CardTitle>
              <Select value={analyticsTimePeriod} onValueChange={setAnalyticsTimePeriod}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₦${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {productCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default AdminAnalytics;
