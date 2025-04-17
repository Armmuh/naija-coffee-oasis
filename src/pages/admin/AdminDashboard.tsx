
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import AdminAnalytics from './AdminAnalytics';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { DashboardTabs } from '@/components/admin/DashboardTabs';

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
          <DashboardHeader onLogout={handleAdminLogout} />
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          {renderAdminContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
