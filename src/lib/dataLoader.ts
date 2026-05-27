/**
 * Data Loader - reads from /data/*.json files or falls back to inline data.
 * Replace inline data exports with API calls by swapping the loader.
 */

const DATA_DIR = '/data';

// Client-side: load from public/data/ (Next.js serves /public/data/ as /data/)
// Server-side: load from process.cwd()/data/
async function loadData<T>(filename: string): Promise<T | null> {
  try {
    const baseUrl = typeof window === 'undefined' 
      ? `file://${process.cwd()}${DATA_DIR}/`
      : `${DATA_DIR}/`;
    
    const res = await fetch(`${baseUrl}${filename}`);
    if (!res.ok) return null;
    return await res.json() as T;
  } catch {
    return null;
  }
}

export { loadData };
