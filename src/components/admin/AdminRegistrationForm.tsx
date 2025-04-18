import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { insertAdminRecord, validateAdminCode, useAdminCode } from '@/integrations/supabase/rpc';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  registrationCode: string;
}

interface FormErrors {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  registrationCode: string;
}

export const AdminRegistrationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationCode: ''
  });
  
  // Error states
  const [errors, setErrors] = useState<FormErrors>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    registrationCode: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user starts typing
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
    
    // Clear general error when user makes any change
    if (generalError) {
      setGeneralError(null);
    }
  };
  
  const validateForm = async () => {
    let valid = true;
    const newErrors: FormErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      registrationCode: ''
    };
    
    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    // Validate registration code
    if (!formData.registrationCode.trim()) {
      newErrors.registrationCode = 'Registration code is required';
      valid = false;
    } else {
      // Check if admin code is valid using the supabase function
      const { data: isValid, error: codeError } = await validateAdminCode(formData.registrationCode);
      
      if (codeError || !isValid) {
        newErrors.registrationCode = 'Invalid Admin Code. Please contact support for access.';
        valid = false;
      }
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setGeneralError(null);
    
    try {
      // Validate form first
      if (!await validateForm()) {
        setLoading(false);
        return;
      }
      
      // Create the auth user account first
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            is_admin: true
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (authData.user) {
        // Insert admin record first to make sure it exists
        const { error: adminInsertError } = await insertAdminRecord(
          authData.user.id,
          formData.fullName,
          formData.email
        );
          
        if (adminInsertError) {
          console.error('Failed to insert admin record:', adminInsertError);
          throw new Error('Failed to create admin record');
        }
        
        // Now mark the registration code as used
        const { error: useCodeError } = await useAdminCode(
          formData.registrationCode, 
          authData.user.id
        );
        
        if (useCodeError) {
          console.error('Failed to mark admin code as used:', useCodeError);
          // Continue anyway - as the user has been created
        }
        
        toast({
          title: 'Registration Successful',
          description: 'Your admin account has been created. You can now login.',
          variant: 'default',
        });
        
        // Redirect to admin login page
        navigate('/admin/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setGeneralError(error.message || 'Failed to create admin account. Please try again.');
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
    <Card className="border-coffee-medium shadow-lg">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create Admin Account</CardTitle>
          <CardDescription>
            Register with your details and admin registration code
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {generalError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={errors.fullName ? "border-destructive" : ""}
              aria-invalid={!!errors.fullName}
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
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "border-destructive" : ""}
              aria-invalid={!!errors.email}
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
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "border-destructive" : ""}
              aria-invalid={!!errors.password}
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
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? "border-destructive" : ""}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="registrationCode">Admin Registration Code</Label>
            <Input
              id="registrationCode"
              value={formData.registrationCode}
              onChange={handleInputChange}
              className={errors.registrationCode ? "border-destructive" : ""}
              aria-invalid={!!errors.registrationCode}
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
  );
};
