
import { Shield } from 'lucide-react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { AdminRegistrationForm } from '@/components/admin/AdminRegistrationForm';

const AdminRegister = () => {
  return (
    <AdminPageLayout
      title="Admin Registration"
      description="Register a new administrator account"
      icon={<Shield size={32} className="text-coffee-light" />}
    >
      <AdminRegistrationForm />
    </AdminPageLayout>
  );
};

export default AdminRegister;
