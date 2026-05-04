"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [notified, setNotified] = useState(false);

  const settings = [
    { label: "Business Name", value: "Bajablue Tours", editable: false },
    { label: "Phone / WhatsApp", value: "+52 612 348 3865", editable: false },
    { label: "Email", value: "info@bajablue.mx", editable: false },
    { label: "Address", value: "Calle Medusa, Ejido El Sargento, 23232 La Ventana, B.C.S.", editable: false },
    { label: "Instagram", value: "@bajabluetours", editable: false },
    { label: "Facebook", value: "Bajablue Tours", editable: false },
    { label: "Website", value: "bajablue.mx", editable: false },
    { label: "Signup Email", value: "bajabluetours@gmail.com", editable: false },
    { label: "Hosting", value: "Vercel — live", editable: false },
    { label: "Domain", value: "bajablue.mx — DNS flip to Vercel pending (requires 2FA on phone)", editable: false },
    { label: "Admin Dashboard", value: "Firebase Auth — active", editable: false },
  ];

  async function requestChange(setting: string) {
    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "settings-change",
          setting,
          request: `Requesting change to the "${setting}" setting.`,
          priority: "normal",
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        alert("Could not send your request. Please try again, or contact your developer via WhatsApp.");
        return;
      }
    } catch {
      alert("Could not send your request. Please check your connection and try again.");
      return;
    }
    setNotified(true);
    setTimeout(() => setNotified(false), 3000);
  }

  return (
    <div>
      <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">SITE SETTINGS</h1>
      <p className="text-warm-white/40 text-sm font-body mb-10">View current settings. Request changes and your developer will be notified.</p>

      {notified && (
        <div className="bg-teal/20 border border-teal/30 text-teal-light text-sm font-body p-4 rounded-sm mb-6">
          Notification sent to your developer.
        </div>
      )}

      <div className="glass-card rounded-sm divide-y divide-white/[0.05]">
        {settings.map((s) => (
          <div key={s.label} className="flex items-center justify-between p-5">
            <div>
              <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase">{s.label}</p>
              <p className="text-warm-white text-sm font-body mt-1">{s.value}</p>
            </div>
            <button onClick={() => requestChange(s.label)}
              className="text-warm-white/30 hover:text-teal-light text-xs font-body transition-colors border border-teal/10 hover:border-teal/30 px-3 py-1.5 rounded-sm">
              Request Change
            </button>
          </div>
        ))}
      </div>

      {/* Telegram setup info */}
      <div className="mt-8 glass-card p-6 rounded-sm">
        <h3 className="text-warm-white text-sm font-body font-medium mb-3">Notification Settings</h3>
        <p className="text-warm-white/40 text-xs font-body leading-relaxed">
          Change requests are sent directly to your developer via Telegram. You'll receive confirmation when the change is implemented.
          For urgent requests, contact directly via WhatsApp.
        </p>
      </div>
    </div>
  );
}
