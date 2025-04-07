
import { ReactNode } from 'react';
import Header from '@/components/Header';

interface AdminPageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export const AdminPageLayout = ({ 
  children, 
  title, 
  description, 
  icon 
}: AdminPageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-coffee-light to-white py-12">
        <div className="container max-w-md px-4">
          <div className="text-center mb-8">
            {icon && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coffee-dark mb-4">
                {icon}
              </div>
            )}
            <h1 className="text-3xl font-bold text-coffee-dark font-playfair">{title}</h1>
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
};
