import { FoodItem, FoodCache, CACHE_TTL_MS } from '../types/food';
import { GoogleGenerativeAI } from '@google/generative-ai';

const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1';
const OFF_BASE  = 'https://world.openfoodfacts.org/cgi/search.pl';
const USDA_KEY  = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY';
const AI_KEY    = import.meta.env.VITE_AI_VISION_KEY || '';

const CACHE_KEY = 'nutrisnap_food_cache';

// ─── Cache helpers ──────────────────────────────────────────────────────────
function readCache(): FoodCache {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch { return {}; }
}

function writeCache(cache: FoodCache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
}

function getCached(key: string): FoodItem[] | null {
  const cache = readCache();
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) return null;
  return entry.data;
}

function setCache(key: string, data: FoodItem[]) {
  const cache = readCache();
  cache[key] = { data, timestamp: Date.now() };
  const keys = Object.keys(cache);
  if (keys.length > 100) delete cache[keys[0]];
  writeCache(cache);
}

// ─── USDA normalizer ────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeUSDA(item: any): FoodItem {
  const nutrients = item.foodNutrients || [];
  const get = (id: number) => {
    const n = nutrients.find((n: any) => n.nutrientId === id || n.nutrient?.id === id);
    return n?.value ?? n?.amount ?? 0;
  };
  const cal     = get(1008) || get(2048) || 0;
  const protein = get(1003) || 0;
  const fat     = get(1004) || 0;
  const carbs   = get(1005) || 0;

  return {
    id:    `usda_${item.fdcId}`,
    name:  item.description || 'Unknown Food',
    brand: item.brandOwner || item.brandName,
    source: 'usda',
    serving_size: item.servingSize || 100,
    serving_unit: item.servingSizeUnit || 'g',
    nutrition_per_100g: { calories: cal, protein, carbs, fat },
    nutrition_per_serving: {
      calories: +(cal * (item.servingSize || 100) / 100).toFixed(1),
      protein:  +(protein * (item.servingSize || 100) / 100).toFixed(1),
      carbs:    +(carbs   * (item.servingSize || 100) / 100).toFixed(1),
      fat:      +(fat     * (item.servingSize || 100) / 100).toFixed(1),
    },
    category: item.foodCategory?.description,
  };
}

// ─── Open Food Facts normalizer ─────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeOFF(item: any): FoodItem {
  const n = item.nutriments || {};
  const servingSize = item.serving_quantity ? parseFloat(item.serving_quantity) : 100;
  const cal     = n['energy-kcal_100g'] || n['energy-kcal'] || 0;
  const protein = n['proteins_100g']    || n['proteins']    || 0;
  const carbs   = n['carbohydrates_100g'] || n['carbohydrates'] || 0;
  const fat     = n['fat_100g']          || n['fat']          || 0;

  return {
    id:    `off_${item.code || item._id}`,
    name:  item.product_name || item.product_name_en || 'Unknown Food',
    brand: item.brands,
    source: 'openfoodfacts',
    serving_size: servingSize,
    serving_unit: item.serving_size?.replace(/[0-9.]/g, '').trim() || 'g',
    nutrition_per_100g: { calories: cal, protein, carbs, fat },
    nutrition_per_serving: {
      calories: +(cal * servingSize / 100).toFixed(1),
      protein:  +(protein  * servingSize / 100).toFixed(1),
      carbs:    +(carbs    * servingSize / 100).toFixed(1),
      fat:      +(fat      * servingSize / 100).toFixed(1),
    },
    image_url: item.image_front_thumb_url || item.image_url,
    barcode:   item.code,
  };
}

// ─── USDA search ────────────────────────────────────────────────────────────
async function searchUSDA(query: string): Promise<FoodItem[]> {
  const res = await fetch(
    `${USDA_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=20&api_key=${USDA_KEY}`
  );
  if (!res.ok) throw new Error('USDA search failed');
  const data = await res.json();
  return (data.foods || []).map(normalizeUSDA);
}

// ─── Open Food Facts search ─────────────────────────────────────────────────
async function searchOFF(query: string): Promise<FoodItem[]> {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '20',
    fields: 'code,product_name,product_name_en,brands,nutriments,serving_quantity,serving_size,image_front_thumb_url',
  });
  const res = await fetch(`${OFF_BASE}?${params}`);
  if (!res.ok) throw new Error('OpenFoodFacts search failed');
  const data = await res.json();
  return (data.products || [])
    .filter((p: any) => p.product_name || p.product_name_en)
    .map(normalizeOFF);
}

// ─── Gemini AI food search (fallback for any food name) ─────────────────────
async function searchWithGemini(query: string): Promise<FoodItem[]> {
  if (!AI_KEY || AI_KEY.includes('placeholder')) return [];

  const genAI = new GoogleGenerativeAI(AI_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a professional nutritionist database. The user searched for: "${query}".
Generate a list of 5 realistic food items related to this query (e.g. if they search "pizza", give 5 pizza variations).
For each food, provide accurate, realistic nutritional values per standard serving.

Return STRICTLY a JSON array (no markdown, no code blocks) with this exact structure:
[
  {
    "name": "string (specific food name, e.g. 'Margherita Pizza, 1 slice')",
    "brand": "string or null (e.g. 'Homemade' or a real brand)",
    "serving_size": number (in grams, realistic serving, e.g. 107 for pizza slice),
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "category": "string (e.g. 'Fast Food', 'Baked Goods', 'Fruits', etc.)"
  }
]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

  const parsed: any[] = JSON.parse(jsonStr);

  return parsed.map((item, i) => ({
    id: `ai_${Date.now()}_${i}`,
    name: item.name || query,
    brand: item.brand || 'AI Estimate',
    source: 'usda' as const,
    serving_size: item.serving_size || 100,
    serving_unit: 'g',
    category: item.category,
    nutrition_per_100g: {
      calories: +((item.calories / (item.serving_size || 100)) * 100).toFixed(1),
      protein:  +((item.protein  / (item.serving_size || 100)) * 100).toFixed(1),
      carbs:    +((item.carbs    / (item.serving_size || 100)) * 100).toFixed(1),
      fat:      +((item.fat      / (item.serving_size || 100)) * 100).toFixed(1),
    },
    nutrition_per_serving: {
      calories: Math.round(item.calories),
      protein:  Math.round(item.protein),
      carbs:    Math.round(item.carbs),
      fat:      Math.round(item.fat),
    },
  }));
}

// ─── Unified search: USDA → OFF → Gemini AI ─────────────────────────────────
export async function searchFood(query: string): Promise<FoodItem[]> {
  if (!query.trim()) return [];
  const key = `search_${query.toLowerCase().trim()}`;

  const cached = getCached(key);
  if (cached && cached.length > 0) return cached;

  let results: FoodItem[] = [];

  // 1. Try USDA
  try {
    results = await searchUSDA(query);
  } catch { /* silent */ }

  // 2. Supplement with Open Food Facts if needed
  if (results.length < 5) {
    try {
      const offResults = await searchOFF(query);
      const combined = [...results, ...offResults];
      results = combined.filter((item, idx, arr) =>
        arr.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase()) === idx
      );
    } catch { /* silent */ }
  }

  // 3. If still no good results, use Gemini AI to generate accurate data
  if (results.length < 3) {
    try {
      const aiResults = await searchWithGemini(query);
      // Merge: put real DB results first, then AI-generated ones
      const combined = [...results, ...aiResults];
      results = combined.filter((item, idx, arr) =>
        arr.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase()) === idx
      );
    } catch (e) {
      console.error('Gemini food search failed:', e);
    }
  }

  if (results.length > 0) setCache(key, results);
  return results;
}

// ─── Get food details by USDA FDC ID ────────────────────────────────────────
export async function getFoodDetails(fdcId: string): Promise<FoodItem | null> {
  const key = `detail_${fdcId}`;
  const cached = getCached(key);
  if (cached?.[0]) return cached[0];

  try {
    const res = await fetch(`${USDA_BASE}/food/${fdcId}?api_key=${USDA_KEY}`);
    if (!res.ok) return null;
    const data = await res.json();
    const item = normalizeUSDA(data);
    setCache(key, [item]);
    return item;
  } catch { return null; }
}

// ─── Clear food cache ────────────────────────────────────────────────────────
export function clearFoodCache() {
  localStorage.removeItem(CACHE_KEY);
}
