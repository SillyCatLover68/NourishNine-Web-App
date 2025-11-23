import type { MealSuggestion } from '../types';

export const mealSuggestions: MealSuggestion[] = [
  {
    name: 'Iron Boost Rice Bowl',
    description: 'Quick, filling, and packed with iron',
    ingredients: ['Microwave rice ($1)', 'Canned beans ($1)', 'Lime or orange ($0.50)'],
    timeMinutes: 5,
    whyGood: 'Beans provide iron, citrus adds vitamin C to boost absorption',
    cost: '$2.50',
    nutrients: ['Iron', 'Protein', 'Vitamin C'],
    nutrientAmounts: { Iron: 6, Protein: 10, 'Vitamin C': 30 },
    calories: 420,
    cookingMethod: 'microwave'
  },
  {
    name: 'Greek Yogurt Parfait',
    description: 'Calcium and protein powerhouse',
    ingredients: ['Greek yogurt ($1)', 'Frozen berries ($2)', 'Granola ($1)'],
    timeMinutes: 2,
    whyGood: 'High in calcium, protein, and antioxidants',
    cost: '$4',
    nutrients: ['Calcium', 'Protein', 'Vitamin C'],
    nutrientAmounts: { Calcium: 200, Protein: 15, 'Vitamin C': 10 },
    calories: 300,
    cookingMethod: 'no-cook'
  },
  {
    name: 'Egg Scramble with Spinach',
    description: 'Quick protein and folate boost',
    ingredients: ['2 eggs ($0.33)', 'Frozen spinach ($1)', 'Whole wheat toast ($0.50)'],
    timeMinutes: 10,
    whyGood: 'Eggs provide choline and protein, spinach adds folate and iron',
    cost: '$1.83',
    nutrients: ['Protein', 'Folate', 'Iron', 'Choline'],
    nutrientAmounts: { Protein: 12, Folate: 80, Iron: 2, Choline: 150 },
    calories: 260,
    cookingMethod: 'stovetop'
  },
  {
    name: 'Lentil Soup',
    description: 'Budget-friendly iron and protein',
    ingredients: ['Lentils ($1.50)', 'Canned tomatoes ($1)', 'Onion ($0.50)'],
    timeMinutes: 15,
    whyGood: 'Lentils are rich in iron, folate, and protein - perfect for pregnancy',
    cost: '$3',
    nutrients: ['Iron', 'Folate', 'Protein'],
    nutrientAmounts: { Iron: 5, Folate: 150, Protein: 12 },
    calories: 220,
    cookingMethod: 'stovetop'
  },
  {
    name: 'Canned Salmon Salad',
    description: 'Omega-3 for baby\'s brain development',
    ingredients: ['Canned salmon ($3)', 'Lettuce ($1)', 'Lemon ($0.50)'],
    timeMinutes: 5,
    whyGood: 'Salmon provides DHA (omega-3) critical for brain development',
    cost: '$4.50',
    nutrients: ['DHA', 'Protein', 'Vitamin D'],
    nutrientAmounts: { DHA: 250, Protein: 20, 'Vitamin D': 200 },
    calories: 360,
    cookingMethod: 'no-cook'
  },
  {
    name: 'Oatmeal with Walnuts',
    description: 'Fiber, iron, and omega-3',
    ingredients: ['Oatmeal ($0.50)', 'Walnuts ($1)', 'Banana ($0.30)'],
    timeMinutes: 5,
    whyGood: 'Iron-fortified oatmeal plus omega-3 from walnuts',
    cost: '$1.80',
    nutrients: ['Iron', 'Fiber', 'DHA'],
    nutrientAmounts: { Iron: 4, Fiber: 6, DHA: 100 },
    calories: 320,
    cookingMethod: 'microwave'
  },
  {
    name: 'Bean and Cheese Quesadilla',
    description: 'Protein, calcium, and iron combo',
    ingredients: ['Tortilla ($0.25)', 'Canned beans ($1)', 'Cheese ($0.75)'],
    timeMinutes: 8,
    whyGood: 'Complete protein from beans and cheese, plus calcium',
    cost: '$2',
    nutrients: ['Protein', 'Calcium', 'Iron'],
    nutrientAmounts: { Protein: 14, Calcium: 200, Iron: 3 },
    calories: 480,
    cookingMethod: 'microwave'
  }
];

export function getMealSuggestions(filters: {
  cookingMethod?: string;
  maxCost?: number;
  nutrients?: string[];
  cravings?: string[];
}): MealSuggestion[] {
  let filtered = [...mealSuggestions];
  
  if (filters.cookingMethod) {
    filtered = filtered.filter(m => 
      m.cookingMethod === filters.cookingMethod || m.cookingMethod === 'any'
    );
  }
  
  if (filters.nutrients && filters.nutrients.length > 0) {
    filtered = filtered.filter(m =>
      filters.nutrients!.some(n => m.nutrients.includes(n))
    );
  }
  
  return filtered.slice(0, 5);
}

