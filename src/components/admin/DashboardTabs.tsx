
import { Button } from '@/components/ui/button';
import { BarChart3, Package, Coffee, Users } from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={activeTab === 'analytics' ? 'default' : 'outline'}
        onClick={() => onTabChange('analytics')}
        className="flex items-center"
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Analytics
      </Button>
      <Button
        variant={activeTab === 'products' ? 'default' : 'outline'}
        onClick={() => onTabChange('products')}
        className="flex items-center"
      >
        <Coffee className="mr-2 h-4 w-4" />
        Products
      </Button>
      <Button
        variant={activeTab === 'orders' ? 'default' : 'outline'}
        onClick={() => onTabChange('orders')}
        className="flex items-center"
      >
        <Package className="mr-2 h-4 w-4" />
        Orders
      </Button>
      <Button
        variant={activeTab === 'users' ? 'default' : 'outline'}
        onClick={() => onTabChange('users')}
        className="flex items-center"
      >
        <Users className="mr-2 h-4 w-4" />
        Users
      </Button>
    </div>
  );
};
