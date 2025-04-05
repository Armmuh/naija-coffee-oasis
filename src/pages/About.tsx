
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-center mb-8">About Coming Soon</h1>
          <p className="text-center text-muted-foreground">
            The full story of our Nigerian coffee journey is coming soon. Please check back to learn more about our mission and values.
          </p>
        </div>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default About;
