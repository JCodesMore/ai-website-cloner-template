"use client";

import { siteConfig, navLinks } from "@/data/site";
import { events } from "@/lib/analytics";

export function Footer() {
  return (
    <footer className="hidden md:block bg-deep-light text-warm-white py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <img
            src="/images/logos/bajablue-mark.svg?v=2"
            alt="Bajablue Tours"
            width={127}
            height={115}
            decoding="async"
            className="h-32 md:h-48 w-auto mx-auto mb-6"
          />
          <p className="text-warm-white/40 text-sm font-body tracking-widest uppercase mb-8">{siteConfig.tagline}</p>
          <a href={siteConfig.whatsappLink} target="_blank" rel="noopener noreferrer"
            onClick={() => events.whatsappClick("footer-start-journey")}
            className="inline-block bg-coral hover:bg-coral-light text-deep px-10 py-3 font-body text-sm tracking-widest uppercase transition-colors duration-300">
            Start Your Journey
          </a>
        </div>

        <div className="dashed-divider w-full mb-12" />

        <div className="grid md:grid-cols-3 gap-10 text-center md:text-left">
          <div>
            <h4 className="text-warm-white/30 text-xs font-body tracking-widest uppercase mb-4">Explore</h4>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-warm-white/50 hover:text-warm-white text-sm font-body transition-colors">{link.label}</a>
              ))}
              <a href="/blog" className="text-warm-white/50 hover:text-warm-white text-sm font-body transition-colors">Blog</a>
              <a href="/privacy" className="text-warm-white/50 hover:text-warm-white text-sm font-body transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-warm-white/50 hover:text-warm-white text-sm font-body transition-colors">Terms of Service</a>
            </div>
          </div>
          <div>
            <h4 className="text-warm-white/30 text-xs font-body tracking-widest uppercase mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm font-body">
              <a href={siteConfig.whatsappLink} target="_blank" rel="noopener noreferrer" onClick={() => events.whatsappClick("footer-contact")} className="text-warm-white/50 hover:text-warm-white transition-colors">WhatsApp: {siteConfig.phone}</a>
              <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="text-warm-white/50 hover:text-warm-white transition-colors">Call: {siteConfig.phone}</a>
              <a href={`mailto:${siteConfig.email}`} className="text-warm-white/50 hover:text-warm-white transition-colors">{siteConfig.email}</a>
              <p className="text-warm-white/30">{siteConfig.address}<br />{siteConfig.city}, {siteConfig.state}<br />{siteConfig.country}</p>
            </div>
          </div>
          <div>
            <h4 className="text-warm-white/30 text-xs font-body tracking-widest uppercase mb-4">Follow</h4>
            <div className="flex flex-col gap-2 text-sm font-body">
              <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-warm-white/50 hover:text-warm-white transition-colors">Instagram {siteConfig.instagram}</a>
              <a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-warm-white/50 hover:text-warm-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>

        <div className="dashed-divider w-full mt-12 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between text-warm-white/20 text-xs font-body gap-2">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Small-group marine expeditions since 2025</p>
        </div>
      </div>
      <div className="h-16 md:hidden" />
    </footer>
  );
}
