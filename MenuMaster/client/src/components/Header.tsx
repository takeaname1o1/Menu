import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Utensils } from 'lucide-react';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { totalItems } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Utensils className="text-primary mr-2" size={24} />
          <h1 className="font-heading font-bold text-xl text-neutral-dark">FoodOrder</h1>
        </div>
        <button 
          onClick={onCartClick}
          className="relative p-2"
        >
          <ShoppingCart className="text-neutral-dark" size={24} />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
