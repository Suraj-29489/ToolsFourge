import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/cards/CategoryCard';
import Accordion from '../components/accordion/Accordion';
import { categories, toolsByCategory } from '../data/tools';

export default function Home() {
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // Global Escape key handler to collapse active accordion
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveCategoryId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleCategory = (categoryId) => {
    setActiveCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  const activeCategory = categories.find((cat) => cat.id === activeCategoryId);
  const activeTools = activeCategoryId ? toolsByCategory[activeCategoryId] || [] : [];

  return (
    <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Header section */}
      <section className="text-center mb-6 sm:mb-12">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-obsidian-text">
          Daily Tools
        </h1>
        <p className="text-xs sm:text-base text-obsidian-text-muted mt-1.5 sm:mt-2 max-w-xl mx-auto leading-relaxed">
          Fast, minimal, and modern client-side utilities. Select a category below to explore available tools.
        </p>
      </section>

      {/* DESKTOP & TABLET LAYOUT (>=768px): 2 or 3 Column Grid with Shared Accordion Below */}
      <div className="hidden md:block">
        <section 
          aria-label="Tool Categories"
          className="grid grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isOpen={activeCategoryId === category.id}
              onToggle={() => handleToggleCategory(category.id)}
            />
          ))}
        </section>

        {/* Shared Single Accordion Section (Below Grid on Desktop & Tablet) */}
        <Accordion
          activeCategory={activeCategory}
          tools={activeTools}
          onClose={() => setActiveCategoryId(null)}
        />
      </div>

      {/* MOBILE LAYOUT (<768px): Vertical Stack with Accordion Expanding Directly Below Clicked Card */}
      <div className="block md:hidden space-y-4">
        {categories.map((category) => {
          const isCategoryOpen = activeCategoryId === category.id;
          const categoryTools = toolsByCategory[category.id] || [];

          return (
            <div key={category.id} className="w-full">
              <CategoryCard
                category={category}
                isOpen={isCategoryOpen}
                onToggle={() => handleToggleCategory(category.id)}
              />
              
              {/* Mobile Inline Accordion Panel */}
              {isCategoryOpen && (
                <Accordion
                  activeCategory={category}
                  tools={categoryTools}
                  onClose={() => setActiveCategoryId(null)}
                  isMobileInline={true}
                />
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
