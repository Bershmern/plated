import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export type RoleOption = 'cashier' | 'kitchen' | 'admin';

interface SegmentedControlProps {
  active: RoleOption;
  onChange: (role: RoleOption) => void;
}

export function SegmentedControl({ active, onChange }: SegmentedControlProps) {
  // calculate transform based on active role
  let translateClass = "translate-x-0";
  if (active === 'kitchen') translateClass = "translate-x-full";
  if (active === 'admin') translateClass = "translate-x-[200%]";

  return (
    <div className="flex p-1 bg-surface-tertiary rounded-full border border-border-default relative w-full mb-8">
      {/* Background sliding pill */}
      <div
        className={cn(
          "absolute inset-y-1 w-[calc(33.333%-2.5px)] bg-surface-secondary rounded-full shadow-sm border border-border-default transition-transform duration-300 ease-out",
          translateClass
        )}
      />

      <button
        type="button"
        onClick={() => onChange('cashier')}
        className={cn(
          "relative flex-1 py-2.5 text-13 font-semibold rounded-full transition-colors z-10",
          active === 'cashier' ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
        )}
      >
        Cashier
      </button>

      <button
        type="button"
        onClick={() => onChange('kitchen')}
        className={cn(
          "relative flex-1 py-2.5 text-13 font-semibold rounded-full transition-colors z-10",
          active === 'kitchen' ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
        )}
      >
        Kitchen
      </button>

      <button
        type="button"
        onClick={() => onChange('admin')}
        className={cn(
          "relative flex-1 py-2.5 text-13 font-semibold rounded-full transition-colors z-10",
          active === 'admin' ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
        )}
      >
        Admin
      </button>
    </div>
  );
}
