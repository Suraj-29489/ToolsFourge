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
    <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header section */}
      <section className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-obsidian-text">
          Daily Tools
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted mt-2 max-w-xl mx-auto">
          Fast, minimal, and modern client-side utilities. Select a category below to explore available tools.
        </p>
      </section>

      {/* 6 Category Grid Layout */}
      {/* Desktop: 3 cols, Tablet: 2 cols, Mobile: 1 col */}
      <section 
        aria-label="Tool Categories"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
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

      {/* Shared Single Accordion Section (Appears below the entire grid) */}
      <Accordion
        activeCategory={activeCategory}
        tools={activeTools}
        onClose={() => setActiveCategoryId(null)}
      />
    </main>
  );
}
