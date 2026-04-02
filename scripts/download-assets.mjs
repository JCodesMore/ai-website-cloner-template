import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const assets = [
  // Logos & Branding
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/682e3a1ae025d0ef9838436b_leading-cards.svg', path: 'images/leading-cards.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68599defbfa86f41886e357e_logomark.svg', path: 'images/logomark.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68bea08e6450f4d17d1e6560_Socialist-logo.svg', path: 'images/socialist-logo.svg' },

  // Hero section
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68934e449c232a1db30453a3_line-left.svg', path: 'images/line-left.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68934e4458011d08baeda9aa_line-right.svg', path: 'images/line-right.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/689352f9437c75c6f2e6f481_home-banner-pattern.png', path: 'images/home-banner-pattern.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68beadf85ef125759422bf79_Line.svg', path: 'images/line-separator.svg' },

  // Banking Cards (hero slider)
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/689330c8fd8f2eeb6154bbac_525d605c505a91fa9f2d57ce0a0d52d4_Banking-Card-1.svg', path: 'images/banking-card-1.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/689330c82264f671e2d68543_8d9c869d3487ac68f621ac1e3bbd90f0_Banking-Card-2.svg', path: 'images/banking-card-2.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/689330c8e3f9b78a8e4f263f_8f1fae3e6e1fd66742b1ccecff921674_Banking-Card-3.svg', path: 'images/banking-card-3.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/689330c8458799b8a0942260_bd7b49f743e8ec6b079ea9f6bcf0441c_Banking-Card-4.svg', path: 'images/banking-card-4.svg' },

  // Integration icons
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/687b2be850d3fd572f32800c_openai.svg', path: 'images/integrations/openai.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/687b2be85ae71c3a521e6e83_midjourney.svg', path: 'images/integrations/midjourney.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/687b2be8d5b13165822a838f_netflix.svg', path: 'images/integrations/netflix.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/687b2be800007ddcc5ba559f_digitalocean.svg', path: 'images/integrations/digitalocean.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/687b2be833b231556d1416c7_amazon.svg', path: 'images/integrations/amazon.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/687b2be88eff450e5ef64b86_airbnb.svg', path: 'images/integrations/airbnb.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/687b2be8ad466abd53ed120f_spotify.svg', path: 'images/integrations/spotify.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/687b3c4587646a040d347d81_apple-pay.svg', path: 'images/integrations/apple-pay.svg' },

  // Feature icons
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688cdcab58a7b9b6498761da_wide-choice-of-BINs-icon.svg', path: 'images/features/bins-icon.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688ccc78222c5eed3b33f01f_analytics-%26-reports.svg', path: 'images/features/analytics-reports.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688cd08011ee092601cc2aab_24-support.svg', path: 'images/features/24-support.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688cd18d511b4c750e668b00_Online_Support.svg', path: 'images/features/online-support.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688cd3559f137270dbfb555a_setting-4.svg', path: 'images/features/customization.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688cabc1905674bbd3f3fa4d_instant-issuance-icon.svg', path: 'images/features/instant-issuance.svg' },

  // Video posters
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688c9f449aaf6671f51e848b_video-poster-1.jpg', path: 'images/video-poster-1.jpg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688ccac0526a9c1d60bcd6fa_video-poster-3.png', path: 'images/video-poster-3.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688ccfe04416b468314aa270_video-poster-2.png', path: 'images/video-poster-2.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688cd1f58d3665efa500f0ff_video-poster-5.png', path: 'images/video-poster-5.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688cd32bc65837aab696bb87_video-poster-4.png', path: 'images/video-poster-4.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/688cd50d3e1e36106c5ce041_video-poster-6.png', path: 'images/video-poster-6.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68b949a1f35bd2a156bf7806_mobile-view-poster-for-video-one.png', path: 'images/mobile-poster-1.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68b94e4d516ea438fbb2fe65_mobile-view-poster-for-video-six.png', path: 'images/mobile-poster-6.png' },

  // Team interface poster
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/687a76b594a0b2203346fdeb_team-Interface-poster.png', path: 'images/team-interface-poster.png' },

  // Partner logos
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b6991b8d5c27a5bab0d3_octobrowser%201.png', path: 'images/partners/octobrowser-1.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b69dbe0265cd734330bd_octobrowser%202.png', path: 'images/partners/octobrowser-2.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b64f9ad3f4c2f15f327e_Partner-dolphin-logo.png', path: 'images/partners/dolphin-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b65178a2d627fa68ca73_Popup-magid-dolphin-logo.png', path: 'images/partners/dolphin-popup-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b5f380a78b758f97f09a_Partner-adspower-logo.png', path: 'images/partners/adspower-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b5ff0443de4feb6f8902_Popup-magid-adspower-logo.png', path: 'images/partners/adspower-popup-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b5ac8ed91fa2ab5f1f26_Partner-mostbet-partners-logo.png', path: 'images/partners/mostbet-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b5b7c3fdc92bc22867e6_Popup-magid-mostbet-partners-logo.png', path: 'images/partners/mostbet-popup-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b562b25c5d2be5f6f53b_Partner-adxad-logo.png', path: 'images/partners/adxad-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b56ff52d0b9f7fbb3458_Popup-magid-adxad-logo.png', path: 'images/partners/adxad-popup-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b4f460944605a0415ff8_Partner-everad-logo.png', path: 'images/partners/everad-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b505130e2a54a061654a_Popup-everad-logo.png', path: 'images/partners/everad-popup-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b4acd5c2daf5cba04078_Partner-clickadilla-logo.png', path: 'images/partners/clickadilla-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b4bbe2e41fa1b589b7b1_Popup-magid-clickadilla-logo.png', path: 'images/partners/clickadilla-popup-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b45cd8e8fe9909f77263_Partner-admobispy-logo.png', path: 'images/partners/admobispy-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b468a64388e37af3b102_Popup-magid-admobispy-logo.png', path: 'images/partners/admobispy-popup-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b4121d1acee0832f108f_Partner-primeads-logo.png', path: 'images/partners/primeads-logo.png' },
  { url: 'https://cdn.prod.website-files.com/686cbaeec5641801a89078e7/68a5b41f4600b3080cb5ee78_Popup-magid-primeads-logo.png', path: 'images/partners/primeads-popup-logo.png' },

  // Video CTA
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/687a3538d7e125892ceff276_Video-CTA-Poster.png', path: 'images/video-cta-poster.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68905caad965015d4e8e0c95_Cards%20for%20ads%C2%A0.jpg', path: 'images/cards-for-ads.jpg' },

  // Reviews
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68792babba3cda3db93f790c_765cb68293d0972e4326545b36c4a57e_review-image.png', path: 'images/reviews/elsa-finance.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68792d3cef79710dbf2b28ac_review-stars.png', path: 'images/reviews/review-stars.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68a5ae59b875a3b950cd7b8f_Victor-Larichev.avif', path: 'images/reviews/victor-larichev.avif' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68a5afe540be55218fbe0a9d_Sergei-Kashaev.avif', path: 'images/reviews/sergei-kashaev.avif' },

  // Contact/Footer
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/6870f837542f990f755d9187_still-have-questions-bg.avif', path: 'images/still-have-questions-bg.avif' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/6870f982cae6ccbecd8ee47c_5925c14028572738b729b63f767dfff1_WhatsApp-icon.png', path: 'images/whatsapp-icon.png' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/686fa8ed9dda028edef7ce23_close.webp', path: 'images/close.webp' },

  // Social icons
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/6859a1b7763790da7eabc642_eefeb9a88ac35b1d5cf67d3d97c96b87_Telegram.webp', path: 'images/social/telegram.webp' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/6859a1b77db08479b8f4185_d01f97baa5835e76352c1d998ba9ee5b_Linkedin.webp', path: 'images/social/linkedin.webp' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/6859a1b7636f74b3000a1918_65d09cc111d93a99caa8d4eea3563dde_Instagram.webp', path: 'images/social/instagram.webp' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/6859a1b78ea1c5e76e3c80f8_d757c96766c3ea81857622f3487cf577_Facebook.webp', path: 'images/social/facebook.webp' },

  // Nav icons
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/689d981dd136d6b1dc8e3554_arrow-down.svg', path: 'images/arrow-down.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/689d9f9a9524189dc6004880_menu.svg', path: 'images/menu.svg' },

  // Favicons
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68a5a8545aa340bd12cc125f_Favicon-icon-image.svg', path: 'seo/favicon.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68a5a856b23a330adecbabc7_Webclip-icon-image.svg', path: 'seo/webclip.svg' },
  { url: 'https://cdn.prod.website-files.com/682e10925e475b2f723fc5bc/68a5a9d49c7b932a4949f931_Open%20graph%20image.png', path: 'seo/og-image.png' },
];

// Videos (large files - download separately)
const videos = [
  { url: 'https://cdn.prod.website-files.com/68185a5ac5e91731a60d1b18/682486ae86deecdc8d59725e_Card_01%20(1)-transcode.mp4', path: 'videos/card-01.mp4' },
  { url: 'https://cdn.prod.website-files.com/68185a5ac5e91731a60d1b18/684fa0d45a2b95252bafbfa1_card_02%20(3)%20(1)-transcode.mp4', path: 'videos/card-02.mp4' },
  { url: 'https://cdn.prod.website-files.com/68185a5ac5e91731a60d1b18/68255baba957c5ef54c92403_Card_03%20(1)-transcode.mp4', path: 'videos/card-03.mp4' },
  { url: 'https://cdn.prod.website-files.com/68185a5ac5e91731a60d1b18/68255d603b18e1094f7fbd04_Card_04%20(2)-transcode.mp4', path: 'videos/card-04.mp4' },
  { url: 'https://cdn.prod.website-files.com/68185a5ac5e91731a60d1b18/683fe8eca146b3c1c83d8464_card_05%20(3)-transcode.mp4', path: 'videos/card-05.mp4' },
  { url: 'https://cdn.prod.website-files.com/68185a5ac5e91731a60d1b18/68db6b62842664598dea791b_card_06-transcode.mp4', path: 'videos/card-06.mp4' },
  { url: 'https://cdn.prod.website-files.com/68185a5ac5e91731a60d1b18/684134a9f544bc64251b56e5_insane%20issuance_mobile%20(1)-transcode.mp4', path: 'videos/card-01-mobile.mp4' },
  { url: 'https://cdn.prod.website-files.com/68185a5ac5e91731a60d1b18/68e1f84634626e3842575999_card_06_mobile%20(1)-transcode.mp4', path: 'videos/card-06-mobile.mp4' },
  { url: 'https://cdn.prod.website-files.com/68185a5ac5e91731a60d1b18/685389b4a427b7743f79473a_add%20team%20member%20video%20for%20website%20(1)-transcode.mp4', path: 'videos/team-interface.mp4' },
  { url: 'https://cdn.prod.website-files.com/68185a5ac5e91731a60d1b18/6825675b1e23d6f431d2a158_3d%20cards%20(2)-transcode.mp4', path: 'videos/3d-cards-cta.mp4' },
];

async function download(url, filePath) {
  const fullPath = join(PUBLIC, filePath);
  await mkdir(dirname(fullPath), { recursive: true });
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(fullPath, buffer);
    console.log(`OK: ${filePath} (${(buffer.length / 1024).toFixed(1)}KB)`);
  } catch (err) {
    console.error(`FAIL: ${filePath} - ${err.message}`);
  }
}

async function batchDownload(items, concurrency = 4) {
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    await Promise.all(batch.map(item => download(item.url, item.path)));
  }
}

console.log(`Downloading ${assets.length} image assets...`);
await batchDownload(assets);

console.log(`\nDownloading ${videos.length} video assets...`);
await batchDownload(videos, 2);

console.log('\nDone!');
