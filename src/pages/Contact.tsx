
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-center mb-8">Contact Coming Soon</h1>
          <p className="text-center text-muted-foreground">
            Our contact page is currently under construction. Please check back soon to get in touch with our team.
          </p>
        </div>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
