
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  onLogout: () => void;
}

export const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <Button 
        onClick={onLogout} 
        variant="outline" 
        className="flex items-center"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};
