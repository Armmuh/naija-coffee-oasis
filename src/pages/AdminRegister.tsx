
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  
  // Error states
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationCode: ''
  });
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      registrationCode: ''
    };
    
    // Validate first name
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    
    // Validate last name
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
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
      // First, validate the registration code
      const { data: isValidCode, error: codeValidationError } = await supabase
        .rpc('validate_admin_code', { registration_code: registrationCode });
        
      if (codeValidationError) {
        throw new Error('Failed to validate registration code');
      }
      
      if (!isValidCode) {
        setErrors(prev => ({
          ...prev,
          registrationCode: 'Invalid or expired registration code'
        }));
        setLoading(false);
        return;
      }
      
      // Registration code is valid, proceed with user registration
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            is_admin: true
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (authData.user) {
        // Mark the registration code as used
        const { error: useCodeError } = await supabase
          .rpc('use_admin_code', { 
            registration_code: registrationCode, 
            user_id: authData.user.id 
          });
          
        if (useCodeError) {
          console.error('Failed to mark code as used:', useCodeError);
        }
        
        toast({
          title: 'Registration Successful',
          description: 'Your admin account has been created. You can now log in.',
          variant: 'default',
        });
        
        // Sign out the user after registration to force them to log in again
        await supabase.auth.signOut();
        navigate('/admin/login');
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName}</p>
                    )}
                  </div>
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
