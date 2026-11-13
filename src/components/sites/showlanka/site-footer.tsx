/* eslint-disable @next/next/no-img-element */
import { ASSETS, footerMenus, partnerLogos } from "./data";
import { AtIcon, FacebookIcon, PhoneIcon, YoutubeIcon } from "./icons";
import { SiteLink } from "./site-link";

export function SiteFooter() {
  return (
    <footer id="footer" className="flex flex-col site-footer">
      <div className="flex footer-top-container">
        <div className="row top-inner">
          {footerMenus.map((menu) => (
            <div key={menu.label} className="col-lg-3 col-12 menu-inner-wrapper">
              <nav className="flex footer-menu" aria-label={menu.label}>
                <ul className="nav-menu">
                  {menu.links.map((link) => (
                    <li key={link.label}>
                      <SiteLink href={link.href} target={link.external ? "_blank" : undefined}>
                        {link.label}
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
          <div className="col-lg-3 col-12">
            <p>
              No. 21 - 6/1,
              <br />
              Nelu Gardens,
              <br />
              Yatiyana, Minuwangda,
              <br />
              Sri Lanka.
            </p>
            <div className="contact-wrapper">
              <div>
                <PhoneIcon />
                <span>0094 779 144664</span>
              </div>
              <div>
                <PhoneIcon />
                <span>0094 112281729</span>
              </div>
              <div>
                <AtIcon />
                <a href="mailto:showlankatours@gmail.com">showlankatours@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="flex flex-col footer-bottom-wrapper">
          <div className="icons-wrapper">
            {partnerLogos.map((logo) => (
              <a key={logo.src} href={logo.href} target="_blank" rel="noopener" className="outer-wrapper">
                <img src={`${ASSETS}/icons/${logo.src}`} alt={logo.alt} loading="lazy" />
              </a>
            ))}
          </div>
          <div className="social-wrapper">
            <a href="https://web.facebook.com/showlankatouroperators/" target="_blank" rel="noopener" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="https://www.youtube.com/@showlanka" target="_blank" rel="noopener" aria-label="YouTube">
              <YoutubeIcon />
            </a>
          </div>
          <p>&copy; Showlanka tours 2026</p>
        </div>
      </div>
    </footer>
  );
}
