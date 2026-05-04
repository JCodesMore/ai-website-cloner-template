"use client";

import { useState } from "react";

const sitePages = [
  { path: "/", name: "Homepage", status: "built", lastUpdated: "2026-04-13", sections: ["Hero Video", "Intro", "Image Comparison", "Seasons", "Tours", "Quote", "FAQ"] },
  { path: "/tours", name: "Tours Hub", status: "built", lastUpdated: "2026-04-13", sections: ["Hero", "Tour Cards", "Season Info", "CTA"] },
  { path: "/tours/ocean-safari", name: "Ocean Safari", status: "built", lastUpdated: "2026-04-13", sections: ["Hero", "Description", "Includes", "Pricing Card"] },
  { path: "/tours/blue-expedition", name: "Blue Expedition", status: "built", lastUpdated: "2026-04-13", sections: ["Hero", "Description", "Includes", "Pricing Card"] },
  { path: "/tours/master-seafari", name: "Master Seafari", status: "built", lastUpdated: "2026-04-13", sections: ["Hero", "Description", "Includes", "Pricing Card"] },
  { path: "/gallery", name: "Gallery", status: "built", lastUpdated: "2026-04-18", sections: ["Hero", "Filter Bar", "Image Grid", "Lightbox"] },
  { path: "/about", name: "About", status: "built", lastUpdated: "2026-04-13", sections: ["Hero", "Story", "Mission", "Hostel Connection"] },
  { path: "/accommodations", name: "Accommodations", status: "built", lastUpdated: "2026-04-18", sections: ["Hero", "Description", "Amenities", "Photo Grid"] },
  { path: "/faq", name: "FAQ", status: "built", lastUpdated: "2026-04-13", sections: ["Hero", "Accordion (8 questions)", "CTA"] },
  { path: "/contact", name: "Contact", status: "built", lastUpdated: "2026-04-13", sections: ["Hero", "WhatsApp Primary", "Contact Form", "Info"] },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  built: { label: "Built", color: "bg-teal/20 text-teal-light" },
  draft: { label: "Draft", color: "bg-warm-gray text-warm-white/40" },
  "needs-photos": { label: "Needs Photos", color: "bg-amber-400/20 text-amber-400" },
  deployed: { label: "Live", color: "bg-teal/30 text-teal" },
};

export default function AdminPagesPage() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState({ page: "", request: "", priority: "normal" });
  const [tickets, setTickets] = useState<Array<{ page: string; request: string; priority: string; date: string; status: string }>>([]);
  const [showTicketForm, setShowTicketForm] = useState(false);

  async function submitTicket() {
    if (!ticketForm.request.trim()) return;

    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "page-request",
          page: ticketForm.page || "General",
          request: ticketForm.request,
          priority: ticketForm.priority === "urgent" ? "high" : ticketForm.priority,
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

    const newTicket = {
      ...ticketForm,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setTickets([newTicket, ...tickets]);
    setTicketForm({ page: "", request: "", priority: "normal" });
    setShowTicketForm(false);

    alert("Change request submitted. Your developer will be in touch.");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">WEBSITE PAGES</h1>
          <p className="text-warm-white/40 text-sm font-body">View page status and submit change requests</p>
        </div>
        <button onClick={() => setShowTicketForm(!showTicketForm)}
          className="bg-coral text-deep px-6 py-2.5 text-xs font-body tracking-[0.2em] uppercase rounded-sm">
          Request Change
        </button>
      </div>

      {/* Change request form */}
      {showTicketForm && (
        <div className="glass-card p-6 rounded-sm mb-8">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Submit Change Request</h3>
          <div className="space-y-4">
            <div>
              <label className="text-warm-white/40 text-[10px] font-body tracking-[0.3em] uppercase block mb-1">Page</label>
              <select value={ticketForm.page} onChange={(e) => setTicketForm({ ...ticketForm, page: e.target.value })}
                className="w-full bg-white/[0.05] border border-teal/20 text-warm-white py-2.5 px-4 text-sm font-body outline-none rounded-sm">
                <option value="">Select a page</option>
                {sitePages.map((p) => <option key={p.path} value={p.name}>{p.name}</option>)}
                <option value="General">General / Sitewide</option>
              </select>
            </div>
            <div>
              <label className="text-warm-white/40 text-[10px] font-body tracking-[0.3em] uppercase block mb-1">What would you like changed?</label>
              <textarea value={ticketForm.request} onChange={(e) => setTicketForm({ ...ticketForm, request: e.target.value })}
                rows={4} placeholder="Describe the change you'd like..."
                className="w-full bg-white/[0.05] border border-teal/20 text-warm-white py-2.5 px-4 text-sm font-body outline-none rounded-sm resize-none" />
            </div>
            <div>
              <label className="text-warm-white/40 text-[10px] font-body tracking-[0.3em] uppercase block mb-1">Priority</label>
              <div className="flex gap-3">
                {["low", "normal", "urgent"].map((p) => (
                  <button key={p} onClick={() => setTicketForm({ ...ticketForm, priority: p })}
                    className={`px-4 py-1.5 text-xs font-body rounded-sm uppercase tracking-wider transition-colors ${
                      ticketForm.priority === p
                        ? p === "urgent" ? "bg-red-400/20 text-red-400 border border-red-400/30" : "bg-teal/20 text-teal-light border border-teal/30"
                        : "bg-white/[0.03] text-warm-white/30 border border-teal/10"
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={submitTicket} className="bg-teal text-deep px-6 py-2.5 text-xs font-body tracking-[0.2em] uppercase rounded-sm">Submit Request</button>
              <button onClick={() => setShowTicketForm(false)} className="text-warm-white/40 text-xs font-body hover:text-warm-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Submitted tickets */}
      {tickets.length > 0 && (
        <div className="glass-card p-6 rounded-sm mb-8">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Your Requests</h3>
          <div className="space-y-3">
            {tickets.map((t, i) => (
              <div key={i} className="flex items-start justify-between py-3 border-b border-teal/5">
                <div>
                  <p className="text-warm-white/70 text-sm font-body">{t.request}</p>
                  <p className="text-warm-white/30 text-xs font-body mt-1">{t.page} · {t.date}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider ${
                  t.priority === "urgent" ? "bg-red-400/20 text-red-400" : "bg-teal/10 text-teal-light"
                }`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page list */}
      <div className="space-y-3">
        {sitePages.map((page) => (
          <div key={page.path} className="glass-card rounded-sm overflow-hidden">
            <button onClick={() => setSelectedPage(selectedPage === page.path ? null : page.path)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center gap-4">
                <span className={`text-[10px] px-2 py-1 rounded-sm uppercase tracking-wider ${statusLabels[page.status]?.color}`}>
                  {statusLabels[page.status]?.label}
                </span>
                <div>
                  <h3 className="text-warm-white text-sm font-body font-medium">{page.name}</h3>
                  <p className="text-warm-white/30 text-xs font-body">{page.path}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-warm-white/20 text-xs font-body">{page.lastUpdated}</span>
                <span className="text-warm-white/30 text-xs">{selectedPage === page.path ? "▲" : "▼"}</span>
              </div>
            </button>

            {selectedPage === page.path && (
              <div className="px-5 pb-5 border-t border-teal/5">
                <p className="text-warm-white/30 text-[10px] font-body tracking-[0.3em] uppercase mt-4 mb-3">Page Sections</p>
                <div className="flex flex-wrap gap-2">
                  {page.sections.map((s) => (
                    <span key={s} className="text-xs font-body text-warm-white/50 bg-white/[0.05] px-3 py-1.5 rounded-sm">{s}</span>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <a href={`http://localhost:3333${page.path}`} target="_blank" rel="noopener noreferrer"
                    className="text-teal-light text-xs font-body hover:underline">View page →</a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
