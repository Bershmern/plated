'use client';

import { useState } from 'react';

function formatNaira(koboMinor: number): string {
  const naira = Math.floor(koboMinor / 100);
  return `₦${naira.toLocaleString('en-NG')}`;
}

export default function InternalOpsDashboard() {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'specific'>('all');

  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-1',
      title: 'Scheduled Maintenance: Supabase Storage Upgrade',
      body: 'Platform maintenance scheduled for Monday 02:00 AM Lagos time.',
      created_at: new Date().toISOString(),
    },
  ]);

  const handlePublishAnnouncement = () => {
    if (!announcementTitle || !announcementBody) {
      alert('Please enter announcement title and message body');
      return;
    }

    setAnnouncements([
      {
        id: crypto.randomUUID(),
        title: announcementTitle,
        body: announcementBody,
        created_at: new Date().toISOString(),
      },
      ...announcements,
    ]);

    setShowBroadcastModal(false);
    setAnnouncementTitle('');
    setAnnouncementBody('');
    alert('Broadcast announcement published to restaurant consoles.');
  };

  return (
    <main className="min-h-screen bg-porcelain text-graphite p-8">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto pb-6 border-b border-linen flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-graphite">Plated Internal Ops</h1>
          <p className="text-xs text-graphite opacity-80">Platform governance, corporate metrics & restaurant broadcasts</p>
        </div>
        <button
          onClick={() => setShowBroadcastModal(true)}
          className="px-4 py-2.5 bg-ink text-chalk text-xs font-bold rounded-xl shadow-xs hover:bg-graphite transition-all"
        >
          + Broadcast Announcement
        </button>
      </header>

      {/* METRICS & FINANCES */}
      <section className="max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-chalk p-6 rounded-2xl border border-linen shadow-2xs">
          <span className="text-[11px] font-bold text-brass uppercase tracking-wider block">Monthly Retainer MRR</span>
          <span className="text-2xl font-extrabold text-graphite mt-1 block">{formatNaira(84000000)}</span>
          <span className="text-[10px] text-ok font-semibold block mt-1">+18.5% from last month</span>
        </div>

        <div className="bg-chalk p-6 rounded-2xl border border-linen shadow-2xs">
          <span className="text-[11px] font-bold text-brass uppercase tracking-wider block">Setup Revenues (YTD)</span>
          <span className="text-2xl font-extrabold text-graphite mt-1 block">{formatNaira(1250000000)}</span>
          <span className="text-[10px] text-graphite/70 block mt-1">25 Active Chains Onboarded</span>
        </div>

        <div className="bg-chalk p-6 rounded-2xl border border-linen shadow-2xs">
          <span className="text-[11px] font-bold text-brass uppercase tracking-wider block">Platform API Call Volume</span>
          <span className="text-2xl font-extrabold text-graphite mt-1 block">1.42M reqs</span>
          <span className="text-[10px] text-ok font-semibold block mt-1">99.98% uptime SLA</span>
        </div>

        <div className="bg-chalk p-6 rounded-2xl border border-linen shadow-2xs">
          <span className="text-[11px] font-bold text-brass uppercase tracking-wider block">Image Credits Purchased</span>
          <span className="text-2xl font-extrabold text-graphite mt-1 block">420 credits</span>
          <span className="text-[10px] text-graphite/70 block mt-1">₦420,000 at ₦1,000/credit</span>
        </div>
      </section>

      {/* CLIENT ACTIVITY & CHAIN METRICS TABLE */}
      <section className="max-w-6xl mx-auto mt-10">
        <h2 className="text-lg font-bold text-graphite mb-4">Active Client Chains</h2>
        <div className="bg-chalk rounded-2xl border border-linen overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-linen/60 text-[11px] font-bold uppercase tracking-wider text-brass border-b border-linen">
                <th className="p-3">Chain Name</th>
                <th className="p-3">Outlets</th>
                <th className="p-3">Retainer Plan</th>
                <th className="p-3">Monthly Orders</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linen text-xs text-graphite">
              <tr className="hover:bg-porcelain/60">
                <td className="p-3 font-semibold">Café Neo</td>
                <td className="p-3 font-mono">3 Outlets</td>
                <td className="p-3 font-bold">{formatNaira(6000000)}/mo</td>
                <td className="p-3 font-mono">4,250 orders</td>
                <td className="p-3"><span className="px-2.5 py-1 bg-ok/15 text-ok rounded-full font-bold text-[10px]">ACTIVE</span></td>
                <td className="p-3"><button className="text-alert hover:underline font-semibold text-[11px]">Suspend</button></td>
              </tr>
              <tr className="hover:bg-porcelain/60">
                <td className="p-3 font-semibold">Tasty Bites Nigeria</td>
                <td className="p-3 font-mono">1 Outlet</td>
                <td className="p-3 font-bold">{formatNaira(2500000)}/mo</td>
                <td className="p-3 font-mono">1,820 orders</td>
                <td className="p-3"><span className="px-2.5 py-1 bg-ok/15 text-ok rounded-full font-bold text-[10px]">ACTIVE</span></td>
                <td className="p-3"><button className="text-alert hover:underline font-semibold text-[11px]">Suspend</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ANNOUNCEMENT BROADCAST LOG */}
      <section className="max-w-6xl mx-auto mt-10 space-y-4">
        <h2 className="text-lg font-bold text-graphite">Active Restaurant Announcements</h2>
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-4 bg-chalk rounded-2xl border border-linen flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold text-graphite">{ann.title}</h4>
                <p className="text-xs text-graphite/80 mt-1">{ann.body}</p>
                <span className="text-[10px] text-graphite/60 block mt-2">
                  Published {new Date(ann.created_at).toLocaleDateString()}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brass text-porcelain">
                Live Broadcast
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* BROADCAST MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-porcelain rounded-2xl p-6 shadow-2xl space-y-4 border border-linen text-graphite">
            <div className="flex justify-between items-center pb-3 border-b border-linen">
              <h3 className="text-sm font-bold">New Restaurant Broadcast Announcement</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-graphite font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Announcement Title</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="e.g. System Maintenance Notice"
                  className="w-full p-2.5 bg-chalk border border-linen rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Audience</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value as any)}
                  className="w-full p-2.5 bg-chalk border border-linen rounded-xl"
                >
                  <option value="all">All Restaurant Consoles</option>
                  <option value="specific">Specific Chain Only</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Message Body</label>
                <textarea
                  value={announcementBody}
                  onChange={(e) => setAnnouncementBody(e.target.value)}
                  placeholder="Write message to appear in restaurant staff consoles..."
                  rows={3}
                  className="w-full p-2.5 bg-chalk border border-linen rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handlePublishAnnouncement}
                className="flex-1 py-3 bg-ink text-chalk text-xs font-bold rounded-xl shadow-xs"
              >
                Publish Broadcast
              </button>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-3 bg-linen text-graphite rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
