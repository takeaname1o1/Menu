import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface EmptyCartProps {
  onClose: () => void;
}

const EmptyCart: React.FC<EmptyCartProps> = ({ onClose }) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <ShoppingCart className="text-gray-300 mb-4" size={48} />
      <h3 className="font-heading font-semibold text-lg text-neutral-dark mb-1">Your cart is empty</h3>
      <p className="text-gray-500 mb-4">Add some delicious items to your cart!</p>
      <Button 
        onClick={onClose}
        className="bg-primary text-white py-2 px-6 rounded-md font-medium hover:bg-primary/90 transition-colors"
      >
        Start Ordering
      </Button>
    </div>
  );
};

export default EmptyCart;
