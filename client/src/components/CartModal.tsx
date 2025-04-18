import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import EmptyCart from './EmptyCart';
import { X, Trash } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    deliveryFee, 
    total 
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div 
        className={`bg-white rounded-t-xl absolute bottom-0 left-0 right-0 max-h-[95vh] overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b">
          <h2 className="font-heading font-semibold text-xl">Your Cart</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {cart.length === 0 ? (
          <EmptyCart onClose={onClose} />
        ) : (
          <>
            <div className="p-4 divide-y">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex border rounded-md">
                      <button 
                        className="px-2 py-1 text-neutral-dark"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-medium">{item.quantity}</span>
                      <button 
                        className="px-2 py-1 text-neutral-dark"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      className="p-1 text-gray-400 hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-lg font-heading font-semibold border-t mt-2 pt-2">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
              
              <Button 
                onClick={onCheckout}
                className="mt-4 w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
