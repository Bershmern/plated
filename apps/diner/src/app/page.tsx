export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-surface-secondary">
      <div className="max-w-md w-full bg-surface-primary rounded-2xl p-8 border border-border-default-default shadow-sm">
        <h1 className="text-24 font-bold tracking-tight text-text-primary mb-2">Plated</h1>
        <p className="text-text-secondary text-14 mb-6">
          Please scan the QR code on your restaurant table to view the menu and order.
        </p>
        <div className="text-12 text-text-tertiary uppercase tracking-widest pt-4 border-t border-border-default-default">
          POWERED BY PLATED
        </div>
      </div>
    </main>
  );
}
