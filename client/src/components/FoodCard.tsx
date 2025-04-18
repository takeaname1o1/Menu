import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FoodItem } from '@shared/types';
import { useCart } from '@/contexts/CartContext';

interface FoodCardProps {
  item: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price
    });
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-40 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading font-semibold text-neutral-dark">{item.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
          <span className="font-heading font-semibold text-primary">${item.price.toFixed(2)}</span>
        </div>
        <Button 
          onClick={handleAddToCart}
          className="mt-3 w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default FoodCard;
