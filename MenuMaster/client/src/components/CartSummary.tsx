import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  onViewCart: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ onViewCart }) => {
  const { totalItems, subtotal } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 transition-transform transform">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-heading font-semibold">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            <span className="mx-2">|</span>
            <span className="font-heading font-semibold text-primary">${subtotal.toFixed(2)}</span>
          </div>
          <Button 
            onClick={onViewCart}
            className="bg-primary text-white py-2 px-6 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            View Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
