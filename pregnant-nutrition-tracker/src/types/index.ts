export interface User {
  id?: string;
  age?: number;
  zipCode?: string;
  pregnancyWeek?: number;
  trimester?: 1 | 2 | 3;
  weight?: number;
  height?: number;
  bmi?: number;
  dietaryRestrictions?: string[];
  cravings?: string[];
  cookingAccess?: 'microwave' | 'full-kitchen' | 'no-kitchen';
  budgetPerWeek?: '$20-40' | '$40-80' | '>$80';
  hydrationCups?: number;
  mood?: '😄' | '😐' | '😣';
}

export interface Nutrient {
  name: string;
  rda: string;
  current: number;
  target: number;
  unit: string;
  importance: string;
  budgetSources: string[];
  deficiencySigns: string[];
}

export interface FoodSafetyItem {
  name: string;
  category: 'avoid' | 'limit' | 'safe';
  safe: boolean;
  riskLevel: 'high' | 'medium' | 'low' | 'none';
  why: string;
  servingSize?: string;
  saferSwaps: string[];
  sources: string[];
}

export interface MealSuggestion {
  name: string;
  description: string;
  ingredients: string[];
  timeMinutes: number;
  whyGood: string;
  cost: string;
  nutrients: string[];
  cookingMethod: 'microwave' | 'stovetop' | 'no-cook' | 'any';
  nutrientAmounts?: Record<string, number>;
}

export interface TrimesterTip {
  trimester: 1 | 2 | 3;
  focus: string;
  calories: string;
  keyNutrients: string[];
  tips: string[];
  avoid: string[];
}

