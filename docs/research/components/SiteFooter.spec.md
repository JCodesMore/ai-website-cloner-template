# SiteFooter Specification

## Overview
- **Target file:** `src/components/SiteFooter.tsx`
- **Interaction model:** static (newsletter form is client-side stub)
- **Component type:** Client component (for the form `onSubmit` preventDefault). If you prefer a server component, omit the onSubmit and let the form fail gracefully.

## Structure

```
<footer class="bg-secondary text-white relative">
  // TOP CONTACT ROW
  <div class="yo-container border-b border-white/10 py-10 md:py-16 lg:py-20">
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
      // logo
      <div>
        <Image src="/img/logos/footer-light-logo.png" width={180} height={50} alt="Yodden" />
      </div>
      // phone / email / location — three identical mini-blocks
      {[
        { icon: <PhoneIcon />, label: "Phone Number", value: FOOTER_CONTACT.phone },
        { icon: <EnvelopeIcon />, label: "Email Address", value: FOOTER_CONTACT.email },
        { icon: <MapPinIcon />, label: "Loaction", value: FOOTER_CONTACT.location },
      ].map(item => (
        <div class="flex items-start gap-4">
          <div class="shrink-0 mt-2 text-white">{item.icon}</div>
          <div class="flex-grow border-l border-white/10 pl-4">
            <h5 class="text-base mb-1 font-bold">{item.label}</h5>
            <span class="text-sm opacity-90">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  </div>

  // MIDDLE 4-COLUMN ROW
  <div class="yo-container py-10 md:py-16 lg:py-20">
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
      // Newsletter
      <div>
        <h4 class="text-xl mb-7 font-bold flex items-center gap-2"><span class="text-primary">|</span>Newsletter</h4>
        <p class="text-white/90 mb-6">{FOOTER_NEWSLETTER_BLURB}</p>
        <form onSubmit={(e) => e.preventDefault()} class="relative">
          <input type="email" placeholder="Subscribe with us" class="w-full h-12 rounded-full bg-white text-secondary placeholder:text-body/60 px-5 pr-14 outline-none" />
          <button type="submit" class="absolute right-1 top-1/2 -translate-y-1/2 size-10 rounded-full bg-primary text-white grid place-items-center">
            <PaperPlaneIcon class="size-4" />
          </button>
        </form>
      </div>
      // Quick Links
      <div class="lg:pl-10">
        <h4 class="text-xl mb-7 font-bold flex items-center gap-2"><span class="text-primary">|</span>Quick Links</h4>
        <ul class="space-y-3">
          {FOOTER_QUICK_LINKS.map(l => <li><a href={l.href} class="hover:text-primary transition-colors">{l.label}</a></li>)}
        </ul>
      </div>
      // Our Services
      <div class="lg:pl-10">
        <h4 class="text-xl mb-7 font-bold flex items-center gap-2"><span class="text-primary">|</span>Our Services</h4>
        <ul class="space-y-3">
          {FOOTER_SERVICES.map(l => <li><a href={l.href} class="hover:text-primary transition-colors">{l.label}</a></li>)}
        </ul>
      </div>
      // Schedule
      <div>
        <h4 class="text-xl mb-7 font-bold flex items-center gap-2"><span class="text-primary">|</span>Schedule</h4>
        <ul class="space-y-4">
          {FOOTER_SCHEDULE.map(s => (
            <li class="flex items-start gap-3">
              <ClockIcon class="size-5 shrink-0 mt-1" />
              <div>
                <h5 class="font-medium mb-1">{s.day}</h5>
                <p class="text-sm opacity-90">{s.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>

  // BOTTOM BAR
  <div class="bg-secondary border-t border-white/10">
    <div class="yo-container py-6">
      <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-white/90">© <CurrentYear /> Yodden Powered By <a href="#" class="text-primary hover:text-white">Website Design Templates</a></p>
        <div class="flex items-center gap-4">
          <span class="font-semibold">Follow Us:</span>
          <ul class="flex gap-3">
            {[
              { Icon: FacebookIcon, href: "#" },
              { Icon: XIcon, href: "#" },
              { Icon: YoutubeIcon, href: "#" },
              { Icon: LinkedinIcon, href: "#" },
            ].map(({Icon, href}) => (
              <li>
                <a href={href} class="size-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                  <Icon class="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
</footer>
```

`<CurrentYear />`: client subcomponent that renders `new Date().getFullYear()`. Use `"use client"` and `useEffect` to hydrate the year to avoid SSR mismatch, OR simply compute server-side: `const year = new Date().getFullYear()` and render `{year}`.

## Computed styles
- Footer bg: `#010101` everywhere
- Top contact row separators: `1px solid rgba(255,255,255,0.1)`
- Section heading: 20px / 700 / white, with red `|` accent
- Body links: white, hover primary
- Newsletter input: 48px high, full pill, white bg, paper-plane submit pill at right

## Data
Import: `FOOTER_CONTACT, FOOTER_NEWSLETTER_BLURB, FOOTER_QUICK_LINKS, FOOTER_SERVICES, FOOTER_SCHEDULE` from `@/lib/content`.
Icons: `PhoneIcon, EnvelopeIcon, MapPinIcon, PaperPlaneIcon, ClockIcon, FacebookIcon, XIcon, YoutubeIcon, LinkedinIcon` from `@/components/icons`.
