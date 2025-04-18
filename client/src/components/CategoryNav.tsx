import React, { useState } from 'react';

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto scrollbar-hide">
          <ul className="flex space-x-6 py-3 whitespace-nowrap">
            <li>
              <button 
                className={`font-heading text-sm font-medium px-2 py-1 rounded-full 
                  ${activeCategory === 'All' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-primary/10 text-neutral-dark'}`}
                onClick={() => onSelectCategory('All')}
              >
                All
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button 
                  className={`font-heading text-sm font-medium px-2 py-1 rounded-full 
                    ${activeCategory === category 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-primary/10 text-neutral-dark'}`}
                  onClick={() => onSelectCategory(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
