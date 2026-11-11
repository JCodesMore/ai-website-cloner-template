export const PRELOADER_STORAGE_KEY = "slPreloaderShown";

// Runs while the HTML is parsed, like the source's inline scripts: skip the
// preloader for returning visitors, otherwise pick one of three icons at random.
// Kept outside the "use client" module so the root layout can inline it.
export const preloaderScript = `try{var d=document.documentElement;if(sessionStorage.getItem("${PRELOADER_STORAGE_KEY}"))d.classList.add("sl-preloaded");else d.dataset.slPreloader=["compass","plane","globe"][Math.floor(Math.random()*3)]}catch(e){}`;
