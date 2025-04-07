
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LogOut, BarChart3, Package, Coffee, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import AdminAnalytics from './AdminAnalytics';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const { toast } = useToast();
  
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleAdminLogout = async () => {
    await signOut();
    toast({
      title: "Admin Logout",
      description: "You have been logged out of the admin panel.",
    });
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

  // Render the appropriate admin content based on the active tab
  const renderAdminContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AdminAnalytics />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'users':
        return <AdminUsers />;
      default:
        return <AdminAnalytics />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button 
              onClick={handleAdminLogout} 
              variant="outline" 
              className="flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('analytics')}
              className="flex items-center"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'outline'}
              onClick={() => setActiveTab('products')}
              className="flex items-center"
            >
              <Coffee className="mr-2 h-4 w-4" />
              Products
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'outline'}
              onClick={() => setActiveTab('orders')}
              className="flex items-center"
            >
              <Package className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'outline'}
              onClick={() => setActiveTab('users')}
              className="flex items-center"
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
          </div>
          
          {renderAdminContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
