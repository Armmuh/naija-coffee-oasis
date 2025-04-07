
import { useState, useEffect } from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users } from 'lucide-react';
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

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  is_admin: boolean | null;
  created_at: string | null;
}

const AdminUsers = () => {
  const { user, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

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
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'User Updated',
        description: `Admin status has been ${!currentStatus ? 'granted' : 'revoked'}.`,
      });

      // Update the local state to reflect the change
      setUsers(users.map(u => {
        if (u.id === userId) {
          return { ...u, is_admin: !currentStatus };
        }
        return u;
      }));
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
      <AdminPageLayout title="Users" icon={<Users className="text-white" size={24} />}>
        <div className="flex justify-center items-center h-48">
          <p>Loading users...</p>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Users" description="Manage user accounts" icon={<Users className="text-white" size={24} />}>
      <div className="border rounded-lg bg-white p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name || ''} {user.last_name || ''}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>{user.city ? `${user.city}, ${user.state || 'N/A'}` : 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded text-xs
                      ${user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`
                    }>
                      {user.is_admin ? 'Admin' : 'Customer'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => viewUserDetails(user)}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant={user.is_admin ? "destructive" : "outline"}
                        onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                        className={!user.is_admin ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Complete profile information for {selectedUser.first_name} {selectedUser.last_name}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Full Name</h3>
                  <p>{selectedUser.first_name} {selectedUser.last_name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Email</h3>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Joined</h3>
                  <p>{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Role</h3>
                  <p>{selectedUser.is_admin ? 'Administrator' : 'Customer'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">City</h3>
                  <p>{selectedUser.city || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">State</h3>
                  <p>{selectedUser.state || 'N/A'}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminPageLayout>
  );
};

export default AdminUsers;
