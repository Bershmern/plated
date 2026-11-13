'use client';

import { useState, createContext, useContext } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';

const QuoteModal = dynamic(() => import('@/components/modals/QuoteModal/QuoteModal').then(mod => mod.QuoteModal), { ssr: false });
const BookDemoModal = dynamic(() => import('@/components/modals/BookDemoModal/BookDemoModal').then(mod => mod.BookDemoModal), { ssr: false });

interface ModalContextType {
  openQuoteModal: () => void;
  openDemoModal: () => void;
}

export const ModalContext = createContext<ModalContextType>({
  openQuoteModal: () => {},
  openDemoModal: () => {},
});

export const useModals = () => useContext(ModalContext);

export function GlobalLayoutProvider({ children }: { children: React.ReactNode }) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <ModalContext.Provider value={{
      openQuoteModal: () => setShowQuoteModal(true),
      openDemoModal: () => setShowDemoModal(true),
    }}>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        
        <div className="flex-1 w-full flex flex-col">
          {children}
        </div>

        <Footer />

        <QuoteModal isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} />
        <BookDemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
      </div>
    </ModalContext.Provider>
  );
}
