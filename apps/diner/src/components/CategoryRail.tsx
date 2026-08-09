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
    <nav className="sticky top-[57px] z-30 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800/80 py-2.5 px-4 overflow-x-auto no-scrollbar shadow-lg">
      <div className="flex items-center gap-2 max-w-md mx-auto min-w-max">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="relative px-4 py-2 rounded-xl text-xs font-extrabold transition-colors duration-200 outline-none select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-600/30 border border-blue-400/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
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
