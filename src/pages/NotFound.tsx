
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-coffee-light/30">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-coffee-dark">404</h1>
        <p className="text-xl text-coffee-medium mb-6">Oops! This page has been brewed away.</p>
        <Button asChild>
          <Link to="/" className="inline-flex items-center">
            <Home className="mr-2 h-4 w-4" /> Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
