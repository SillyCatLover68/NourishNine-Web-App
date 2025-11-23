import type { FoodSafetyItem } from '../types';

export const foodSafetyDatabase: FoodSafetyItem[] = [
  {
    name: 'Raw fish / Sushi',
    category: 'avoid',
    safe: false,
    riskLevel: 'high',
    why: 'May contain parasites and bacteria (listeria) that can harm your baby',
    saferSwaps: ['Cooked fish', 'Canned salmon', 'Cooked shrimp'],
    sources: ['ACOG', 'CDC']
  },
  {
    name: 'Raw eggs',
    category: 'avoid',
    safe: false,
    riskLevel: 'high',
    why: 'Risk of salmonella infection',
    saferSwaps: ['Cooked eggs', 'Pasteurized egg products'],
    sources: ['CDC', 'FDA']
  },
  {
    name: 'Unpasteurized dairy',
    category: 'avoid',
    safe: false,
    riskLevel: 'high',
    why: 'May contain listeria, which can cause miscarriage',
    saferSwaps: ['Pasteurized milk', 'Pasteurized cheese', 'Greek yogurt'],
    sources: ['ACOG', 'CDC']
  },
  {
    name: 'Deli meats',
    category: 'avoid',
    safe: false,
    riskLevel: 'high',
    why: 'Risk of listeria unless heated to steaming hot',
    servingSize: 'Safe if heated to 165°F',
    saferSwaps: ['Heated deli meats', 'Freshly cooked meats'],
    sources: ['ACOG', 'CDC']
  },
  {
    name: 'Hot Cheetos',
    category: 'limit',
    safe: true,
    riskLevel: 'low',
    why: 'High sodium can cause swelling, but safe in moderation',
    servingSize: '1 small bag (1-2x/week max)',
    saferSwaps: ['Baked chips', 'Carrots with hummus', 'Popcorn'],
    sources: ['ACOG']
  },
  {
    name: 'Ice cream',
    category: 'safe',
    safe: true,
    riskLevel: 'low',
    why: 'Safe if made with pasteurized ingredients',
    servingSize: '1/2 cup serving',
    saferSwaps: ['Frozen yogurt with fruit', 'Greek yogurt with berries'],
    sources: ['FDA']
  },
  {
    name: 'Caffeine',
    category: 'limit',
    safe: true,
    riskLevel: 'low',
    why: 'High amounts may increase miscarriage risk',
    servingSize: '<200 mg/day (1-2 cups coffee)',
    saferSwaps: ['Decaf coffee', 'Herbal tea', 'Water'],
    sources: ['ACOG', 'WHO']
  },
  {
    name: 'Tuna',
    category: 'limit',
    safe: true,
    riskLevel: 'medium',
    why: 'Contains mercury - limit to protect baby\'s nervous system',
    servingSize: '1 serving/week (6 oz)',
    saferSwaps: ['Canned salmon', 'Sardines', 'Shrimp'],
    sources: ['FDA', 'EPA']
  },
  {
    name: 'Kombucha',
    category: 'avoid',
    safe: false,
    riskLevel: 'medium',
    why: 'Contains trace amounts of alcohol and unpasteurized bacteria',
    saferSwaps: ['Sparkling water', 'Herbal tea', 'Water with lemon'],
    sources: ['ACOG']
  },
  {
    name: 'Soft cheeses (brie, feta)',
    category: 'avoid',
    safe: false,
    riskLevel: 'high',
    why: 'May contain listeria if unpasteurized',
    saferSwaps: ['Pasteurized soft cheeses', 'Hard cheeses (cheddar, swiss)'],
    sources: ['ACOG', 'CDC']
  },
  {
    name: 'Raw sprouts',
    category: 'avoid',
    safe: false,
    riskLevel: 'high',
    why: 'High risk of salmonella and E. coli',
    saferSwaps: ['Cooked sprouts', 'Lettuce', 'Spinach'],
    sources: ['CDC', 'FDA']
  },
  {
    name: 'Alcohol',
    category: 'avoid',
    safe: false,
    riskLevel: 'high',
    why: 'No safe amount during pregnancy - can cause birth defects',
    saferSwaps: ['Sparkling water', 'Mocktails', 'Juice'],
    sources: ['ACOG', 'CDC', 'WHO']
  }
];

export function searchFoodSafety(query: string): FoodSafetyItem | null {
  const lowerQuery = query.toLowerCase();
  return foodSafetyDatabase.find(item => 
    item.name.toLowerCase().includes(lowerQuery)
  ) || null;
}

