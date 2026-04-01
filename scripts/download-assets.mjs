import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const assets = [
  // Logos & icons
  { url: 'https://es.smartluxe.com/static/media/logo_positive_center.67684921ee126236da68e9b04d1dd6e0.svg', dest: 'images/logo_positive_center.svg' },
  { url: 'https://es.smartluxe.com/static/media/logo_positive_left.3f271176d47be586afd482a953f3de76.svg', dest: 'images/logo_positive_left.svg' },
  { url: 'https://es.smartluxe.com/static/media/logo_negative_no_text.d6be892e99228af1f272.png', dest: 'images/logo_negative_no_text.png' },
  { url: 'https://es.smartluxe.com/static/media/logo_negative_left.5079ffae253fdd93368d.png', dest: 'images/logo_negative_left.png' },
  { url: 'https://es.smartluxe.com/static/media/fb_black_icon.5f6726e850e5e5fe1ef1dde83e219a0d.svg', dest: 'images/fb_black_icon.svg' },
  { url: 'https://es.smartluxe.com/static/media/instagram_black_icon.2a480a5dc06ec28102c4ce70e83ecfd1.svg', dest: 'images/instagram_black_icon.svg' },
  { url: 'https://es.smartluxe.com/static/media/linkedin-icon-logo-svg-vector.3d32eedd3cc3a637d6ad453727c3579b.svg', dest: 'images/linkedin_icon.svg' },
  { url: 'https://es.smartluxe.com/static/media/fb_icon.6f2348b56683d6063070b5fa08e48c2d.svg', dest: 'images/fb_icon.svg' },
  { url: 'https://es.smartluxe.com/static/media/instagram_icon.3f38637b9bab4962e0022488d7bd2e18.svg', dest: 'images/instagram_icon.svg' },
  // Hero
  { url: 'https://es.smartluxe.com/static/media/video_preview.09a5932a1ef0efa62af5.jpg', dest: 'images/video_preview.jpg' },
  // Deal badges
  { url: 'https://es.smartluxe.com/static/media/smart_deal_es.e3b2808d3520ddb776aa.png', dest: 'images/smart_deal_es.png' },
  { url: 'https://es.smartluxe.com/static/media/great_deal_es.f14dce1012f64dabbe97.png', dest: 'images/great_deal_es.png' },
  { url: 'https://es.smartluxe.com/static/media/excellent_deal_es.98ff11008bc0399a583e.png', dest: 'images/excellent_deal_es.png' },
  { url: 'https://es.smartluxe.com/static/media/s_location_offer.f97008d6db1f84fbf10a.png', dest: 'images/s_location_offer.png' },
  // Property card images
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/425030707/f3b61b38.jpeg', dest: 'images/property1_1.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/425030707/83dcefb7.jpeg', dest: 'images/property1_2.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/426629154/f3b61b38.jpeg', dest: 'images/property2_1.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/426629154/83dcefb7.jpeg', dest: 'images/property2_2.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/426411877/f3b61b38.jpeg', dest: 'images/property3_1.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/426411877/83dcefb7.jpeg', dest: 'images/property3_2.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/441062787/f3b61b38.jpeg', dest: 'images/property4_1.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/441062787/83dcefb7.jpeg', dest: 'images/property4_2.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/425422972/f3b61b38.jpeg', dest: 'images/property5_1.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/425422972/83dcefb7.jpeg', dest: 'images/property5_2.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/424227622/f3b61b38.jpeg', dest: 'images/property6_1.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/424227622/83dcefb7.jpeg', dest: 'images/property6_2.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/403788303/f3b61b38.jpeg', dest: 'images/property7_1.jpeg' },
  { url: 'https://dvvjkgh94f2v6.cloudfront.net/523fa3e6/403788303/83dcefb7.jpeg', dest: 'images/property7_2.jpeg' },
  { url: 'https://es.smartluxe.com/static/media/Find_Deal_Generic_button_backgrounds_310x316px_AM_19-Aug-22_1.681ae56c0925205c829b.jpg', dest: 'images/find_more_deals.jpg' },
  // Projects
  { url: 'https://ngirealty.com/storage/projects/85ad97ce_editionhero.jpeg', dest: 'images/project_edition.jpeg' },
  { url: 'https://ngirealty.com/storage/projects/187c6e28_2bd05b64_image-proimage.jpg', dest: 'images/project_cove.jpg' },
  { url: 'https://ngirealty.com/storage/projects/8a92440b_onda_front.jpg', dest: 'images/project_onda.jpg' },
  { url: 'https://ngirealty.com/storage/projects/962e82a0__o-TBKEA.jpeg', dest: 'images/project_1428brickell.jpeg' },
  { url: 'https://ngirealty.com/storage/projects/e99a4cd9_ARMANICASA.png', dest: 'images/project_armani.png' },
  { url: 'https://ngirealty.com/storage/projects/f2bdbf86_d225db47_NATIIVO_PROJECT_PICTURE.jpg', dest: 'images/project_natiivo.jpg' },
  { url: 'https://ngirealty.com/storage/projects/d550826d_Avenia_by_Fendi.png', dest: 'images/project_avenia.png' },
  { url: 'https://es.smartluxe.com/static/media/more-projects-3.e8eebc3029f8f1fc40dc.jpg', dest: 'images/more_projects.jpg' },
  // Neighborhoods
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/a9fe761a_Pompano_Beach_small.jpg', dest: 'images/neighborhood_pompano.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/south_beach.jpg', dest: 'images/neighborhood_south_beach.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/sunny_isles.jpg', dest: 'images/neighborhood_sunny_isles.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/surfside.jpg', dest: 'images/neighborhood_surfside.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/aventura.jpg', dest: 'images/neighborhood_aventura.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/bal_harbour.jpg', dest: 'images/neighborhood_bal_harbour.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/ca2c894e_Bay_Harbor_small.jpg', dest: 'images/neighborhood_bay_harbor.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/brickell.jpg', dest: 'images/neighborhood_brickell.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/29246f44_coconut_grove.jpg', dest: 'images/neighborhood_coconut_grove.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/839edf5b_Coral_Gables_small.jpg', dest: 'images/neighborhood_coral_gables.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/downtown.jpg', dest: 'images/neighborhood_downtown.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/b04088be_Fort_Lauderdale_small.jpg', dest: 'images/neighborhood_fort_lauderdale.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/hollywood.jpg', dest: 'images/neighborhood_hollywood.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/d680cd9d_Miami_Beach_small.jpg', dest: 'images/neighborhood_miami_beach.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/edgewater.jpg', dest: 'images/neighborhood_edgewater.jpg' },
  { url: 'https://ngirealty.com/img/smart_luxe/areas/thumbs/ebc595ba_north_bay_village_thumb.jpg', dest: 'images/neighborhood_north_bay.jpg' },
  // News
  { url: 'https://ngirealty.com/img/blog/986/NmBQJ47KOVQQHs6drGqP0rIlJHfA3J9obN4EI5xz.webp', dest: 'images/news1.webp' },
  { url: 'https://ngirealty.com/img/blog/983/2LIyhqATTz6PZCwYzqnIaX8G5XY9rgpVmel7YkVU.jpg', dest: 'images/news2.jpg' },
  { url: 'https://ngirealty.com/img/blog/980/photo.jpg', dest: 'images/news3.jpg' },
  // Footer icons
  { url: 'https://es.smartluxe.com/static/media/s_location_footer.f33a42003302a48ea290.png', dest: 'images/s_location_footer.png' },
  { url: 'https://es.smartluxe.com/static/media/s_phone_footer.0ddbc1056304c6df9d22.png', dest: 'images/s_phone_footer.png' },
  { url: 'https://es.smartluxe.com/static/media/s_letter_footer.1b8ab66d8e71e6869e76.png', dest: 'images/s_letter_footer.png' },
  { url: 'https://es.smartluxe.com/static/media/icon_date_white.eb501da20c0e3f35720e5e059e229c13.svg', dest: 'images/icon_date_white.svg' },
  // Favicon
  { url: 'https://es.smartluxe.com/favicon.ico', dest: 'seo/favicon.ico' },
  { url: 'https://es.smartluxe.com/logo192.png', dest: 'seo/logo192.png' },
];

async function download(url, dest) {
  const fullDest = path.join(publicDir, dest);
  const dir = path.dirname(fullDest);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (existsSync(fullDest)) { console.log(`SKIP ${dest}`); return; }
  try {
    const resp = await fetch(url);
    if (!resp.ok) { console.error(`FAIL ${url}: ${resp.status}`); return; }
    await pipeline(resp.body, createWriteStream(fullDest));
    console.log(`OK   ${dest}`);
  } catch (e) {
    console.error(`ERR  ${dest}: ${e.message}`);
  }
}

// Download in batches of 4
for (let i = 0; i < assets.length; i += 4) {
  await Promise.all(assets.slice(i, i + 4).map(a => download(a.url, a.dest)));
}
console.log('Done!');
