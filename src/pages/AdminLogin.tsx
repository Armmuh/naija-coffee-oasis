
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Lock } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/components/ui/use-toast';

const AdminLogin = () => {
  const { user, isAdmin, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // If user is already logged in and is an admin, redirect to admin dashboard
  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  // If user is logged in but not an admin, redirect to home
  if (!loading && user && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Access Denied",
        description: "Invalid credentials or you don't have admin privileges.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 bg-gradient-to-b from-coffee-light to-white">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coffee-dark mb-4">
              <Lock size={32} className="text-coffee-light" />
            </div>
            <h1 className="text-3xl font-bold text-coffee-dark font-playfair">Admin Access</h1>
            <p className="text-muted-foreground mt-2">Sign in to manage your coffee store</p>
          </div>
          
          <Card className="border-coffee-medium shadow-lg">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle>Administrator Login</CardTitle>
                <CardDescription>
                  Only authorized personnel can access the admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input 
                    id="admin-email"
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input 
                    id="admin-password"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <Button 
                  type="submit" 
                  className="w-full bg-coffee-dark hover:bg-coffee-accent"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Login to Admin"}
                </Button>
                <p className="text-center text-sm">
                  Need an admin account?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-coffee-accent"
                    onClick={() => navigate('/admin/register')}
                  >
                    Register
                  </Button>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
