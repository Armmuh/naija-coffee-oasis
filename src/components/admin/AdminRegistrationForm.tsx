
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { insertAdminRecord, validateAdminCode, useAdminCode } from '@/integrations/supabase/rpc';

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
  };
  
  const validateForm = () => {
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
      newErrors.email = 'Email is invalid';
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
      // Validate the registration code
      const { data: isValid, error: codeError } = await validateAdminCode(formData.registrationCode);
      
      if (codeError || !isValid) {
        setErrors(prev => ({
          ...prev,
          registrationCode: 'Invalid Admin Registration Code'
        }));
        setLoading(false);
        return;
      }
      
      // Proceed with user registration
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
        // Mark the code as used
        const { error: useCodeError } = await useAdminCode(
          formData.registrationCode,
          authData.user.id
        );
        
        if (useCodeError) {
          console.error('Failed to mark code as used:', useCodeError);
        }
        
        // Insert admin record
        const { error: adminInsertError } = await insertAdminRecord(
          authData.user.id,
          formData.fullName,
          formData.email
        );
          
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
              value={formData.fullName}
              onChange={handleInputChange}
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
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
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
              value={formData.confirmPassword}
              onChange={handleInputChange}
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
              value={formData.registrationCode}
              onChange={handleInputChange}
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
  );
};
