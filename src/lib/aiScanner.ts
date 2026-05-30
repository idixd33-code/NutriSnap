import { FoodItem } from '../types/food';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AI_API_KEY = import.meta.env.VITE_AI_VISION_KEY || '';

// Mock fallback in case the API key is invalid or fails
const MOCK_AI_RESULTS: FoodItem[] = [
  { id: 'ai-1', name: 'Grilled Salmon with Asparagus', brand: 'AI Estimate', serving_size: 1, serving_unit: 'plate', source: 'usda', nutrition_per_serving: { calories: 450, protein: 42, carbs: 12, fat: 24 }, nutrition_per_100g: { calories: 450, protein: 42, carbs: 12, fat: 24 } },
];

function fileToGenerativePart(file: File): Promise<{inlineData: {data: string, mimeType: string}}> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: { data: base64Data, mimeType: file.type }
      });
    };
    reader.readAsDataURL(file);
  });
}

export async function scanFoodImage(file: File): Promise<FoodItem> {
  if (!AI_API_KEY || AI_API_KEY.includes('placeholder')) {
    console.warn("No valid Gemini API key found, using mock data.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_AI_RESULTS[0]), 2000));
  }

  try {
    const genAI = new GoogleGenerativeAI(AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePart = await fileToGenerativePart(file);
    const prompt = `You are a strict nutritionist AI. Analyze this image. First, determine if the image contains ACTUAL FOOD or BEVERAGE. If it is NOT food (e.g., a pen, a person, a car, an empty table), set "is_food" to false and return 0 for everything else.
    If it IS food, identify the primary food item and estimate its nutritional values for one standard serving.
    Return STRICTLY a JSON object (no markdown formatting, no code blocks) matching this exact interface:
    {
      "is_food": boolean,
      "name": "string (name of food, or 'Not Food' if is_food is false)",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting from the response
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    if (parsed.is_food === false) {
      throw new Error("NOT_FOOD");
    }

    return {
      id: 'ai-' + Date.now().toString(),
      name: parsed.name || 'Unknown Food',
      brand: 'Gemini AI',
      serving_size: 1,
      serving_unit: 'serving',
      source: 'usda',
      nutrition_per_serving: {
        calories: parsed.calories || 0,
        protein: parsed.protein || 0,
        carbs: parsed.carbs || 0,
        fat: parsed.fat || 0
      },
      nutrition_per_100g: {
        calories: parsed.calories || 0,
        protein: parsed.protein || 0,
        carbs: parsed.carbs || 0,
        fat: parsed.fat || 0
      }
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to mock on error (e.g. if key is invalid format)
    return MOCK_AI_RESULTS[0];
  }
}
