
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';

const Shop = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-center mb-8">Shop Coming Soon</h1>
          <p className="text-center text-muted-foreground">
            Our shop is currently under construction. Please check back soon to browse our full collection of Nigerian coffee products.
          </p>
        </div>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
