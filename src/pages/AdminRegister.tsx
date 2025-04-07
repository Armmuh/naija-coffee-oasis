import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User } from 'lucide-react';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';

const AdminRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  
  // Error states
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationCode: ''
  });
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      registrationCode: ''
    };
    
    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }
    
    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    // Validate registration code
    if (!registrationCode.trim()) {
      newErrors.registrationCode = 'Registration code is required';
      valid = false;
    } else if (registrationCode !== 'SECRET123') {
      newErrors.registrationCode = 'Invalid Admin Registration Code';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Registration code is hardcoded to SECRET123
      if (registrationCode !== 'SECRET123') {
        setErrors(prev => ({
          ...prev,
          registrationCode: 'Invalid Admin Registration Code'
        }));
        setLoading(false);
        return;
      }
      
      // Proceed with user registration
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            is_admin: true
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (authData.user) {
        // Insert into admins table using raw SQL instead of from() method
        // This bypasses the type checking issue
        const { error: adminInsertError } = await supabase
          .rpc('insert_admin_record', { 
            admin_id: authData.user.id,
            admin_full_name: fullName,
            admin_email: email
          });
          
        if (adminInsertError) {
          console.error('Failed to insert admin record:', adminInsertError);
          throw new Error('Failed to create admin record');
        }
        
        toast({
          title: 'Registration Successful',
          description: 'Your admin account has been created. Redirecting to dashboard.',
          variant: 'default',
        });
        
        // Redirect to admin dashboard
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to create admin account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-coffee-light to-white py-12">
        <div className="container max-w-md px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coffee-dark mb-4">
              <Shield size={32} className="text-coffee-light" />
            </div>
            <h1 className="text-3xl font-bold text-coffee-dark font-playfair">Admin Registration</h1>
            <p className="text-muted-foreground mt-2">Register a new administrator account</p>
          </div>
          
          <Card className="border-coffee-medium shadow-lg">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Create Admin Account</CardTitle>
                <CardDescription>
                  Register with your details and admin registration code
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrationCode">Admin Registration Code</Label>
                  <Input
                    id="registrationCode"
                    value={registrationCode}
                    onChange={(e) => setRegistrationCode(e.target.value)}
                    className={errors.registrationCode ? "border-destructive" : ""}
                  />
                  {errors.registrationCode && (
                    <p className="text-sm text-destructive">{errors.registrationCode}</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex-col space-y-2">
                <Button 
                  type="submit" 
                  className="w-full bg-coffee-dark hover:bg-coffee-accent"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Register Admin Account"}
                </Button>
                <p className="text-center text-sm">
                  Already have an account?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-coffee-accent"
                    onClick={() => navigate('/admin/login')}
                  >
                    Log in
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

export default AdminRegister;
