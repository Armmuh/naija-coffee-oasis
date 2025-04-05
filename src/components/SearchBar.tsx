
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar = ({ onSearch, className = '' }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center relative ${className}`}>
      <Input
        type="search"
        placeholder="Search for coffee, accessories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10"
      />
      <Button 
        type="submit"
        size="icon"
        variant="ghost" 
        className="absolute right-0 h-full"
      >
        <Search size={18} />
      </Button>
    </form>
  );
};

export default SearchBar;
