'use client';

import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
}

interface CategoryRailProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryRail({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryRailProps) {
  return (
    <nav className="sticky top-[64px] z-30 bg-background/95 backdrop-blur-md border-b border-border-default py-2.5 px-4 overflow-x-auto no-scrollbar shadow-sm">
      <div className="flex items-center gap-2 max-w-md mx-auto min-w-max">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="relative px-4 py-2 rounded-xl text-12 font-extrabold transition-colors duration-200 outline-none select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-action-primary rounded-xl shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  isActive ? 'text-surface-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
