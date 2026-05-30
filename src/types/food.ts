import { MacroNutrients } from './nutrition';

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  source: 'usda' | 'openfoodfacts' | 'custom';
  serving_size: number;
  serving_unit: string;
  nutrition_per_100g: MacroNutrients;
  nutrition_per_serving: MacroNutrients;
  image_url?: string;
  barcode?: string;
  category?: string;
}

export interface SearchResult {
  items: FoodItem[];
  total: number;
  source: 'usda' | 'openfoodfacts' | 'cache';
  loading: boolean;
  error?: string;
}

export interface FoodCache {
  [key: string]: {
    data: FoodItem[];
    timestamp: number;
  };
}

export const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
