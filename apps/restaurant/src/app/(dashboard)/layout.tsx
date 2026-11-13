import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-surface-secondary overflow-hidden p-4">
      <div className="shrink-0 mb-4">
        <div className="bg-surface-primary rounded-2xl overflow-hidden shadow-sm border border-border-default/50">
          <Navbar />
        </div>
      </div>
      <main className="flex-1 overflow-hidden flex flex-col bg-surface-primary rounded-2xl shadow-sm border border-border-default/50">
        {children}
      </main>
      <div className="shrink-0 mt-3 flex justify-end px-2">
        <div className="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
          <span className="text-10 font-bold uppercase tracking-widest text-text-tertiary">Powered by</span>
          <span className="text-12 font-black tracking-tighter text-text-secondary">PLATED</span>
        </div>
      </div>
    </div>
  );
}
