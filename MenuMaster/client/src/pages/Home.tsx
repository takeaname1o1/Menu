import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import FoodCard from '@/components/FoodCard';
import CartSummary from '@/components/CartSummary';
import CartModal from '@/components/CartModal';
import CheckoutModal from '@/components/CheckoutModal';
import { FoodItem } from '@shared/types';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  const { data: menuItems, isLoading } = useQuery<FoodItem[]>({
    queryKey: ['/api/menu'],
  });
  
  // Extract unique categories
  const categories = menuItems 
    ? [...new Set(menuItems.map(item => item.category))]
    : [];
  
  // Filter menu items based on active category
  const filteredItems = menuItems 
    ? activeCategory === 'All' 
      ? menuItems 
      : menuItems.filter(item => item.category === activeCategory)
    : [];
  
  const handleCartClick = () => {
    setShowCartModal(true);
  };
  
  const handleCartClose = () => {
    setShowCartModal(false);
  };
  
  const handleCheckoutClick = () => {
    setShowCartModal(false);
    setShowCheckoutModal(true);
  };
  
  const handleCheckoutClose = () => {
    setShowCheckoutModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={handleCartClick} />
      
      <CategoryNav 
        categories={categories} 
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section>
          <h2 className="font-heading font-semibold text-xl mb-4">Popular Items</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm h-72 animate-pulse">
                  <div className="bg-gray-200 h-40 w-full"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <CartSummary onViewCart={handleCartClick} />
      
      <CartModal 
        isOpen={showCartModal} 
        onClose={handleCartClose}
        onCheckout={handleCheckoutClick}
      />
      
      <CheckoutModal 
        isOpen={showCheckoutModal}
        onClose={handleCheckoutClose}
      />
    </div>
  );
};

export default Home;
