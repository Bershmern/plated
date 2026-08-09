export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-chalk rounded-2xl p-8 border border-linen shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-graphite mb-2">Plated</h1>
        <p className="text-graphite text-sm mb-6">
          Please scan the QR code on your restaurant table to view the menu and order.
        </p>
        <div className="text-xs text-graphite uppercase tracking-widest pt-4 border-t border-linen">
          POWERED BY PLATED
        </div>
      </div>
    </main>
  );
}
