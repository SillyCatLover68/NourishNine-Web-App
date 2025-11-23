import type { TrimesterTip } from '../types';

export const trimesterTips: TrimesterTip[] = [
  {
    trimester: 1,
    focus: 'Folate and nausea management',
    calories: 'No extra calories needed',
    keyNutrients: ['Folate', 'Iron', 'Vitamin B6'],
    tips: [
      'Eat crackers before getting out of bed to reduce morning sickness',
      'Cold foods reduce smell sensitivity - try smoothies, yogurt, cold sandwiches',
      'Small, frequent meals (6-8 per day) help with nausea',
      'Ginger tea or ginger candies can ease nausea',
      'Stay hydrated - sip water throughout the day',
      'Avoid strong smells - ask for help with cooking if needed'
    ],
    avoid: [
      'Raw fish and sushi',
      'Unpasteurized dairy',
      'Alcohol',
      'High-mercury fish'
    ]
  },
  {
    trimester: 2,
    focus: 'Iron peaks and energy boost',
    calories: '+340 calories/day',
    keyNutrients: ['Iron', 'Calcium', 'Protein', 'DHA'],
    tips: [
      'Add iron-rich foods: beans, lentils, spinach, fortified cereals',
      'Pair iron foods with vitamin C (oranges, bell peppers) for better absorption',
      'This is your energy peak - great time for light exercise',
      'Baby is growing fast - prioritize protein and calcium',
      'Drink plenty of water to prevent constipation',
      'Start taking prenatal vitamins if you haven\'t already'
    ],
    avoid: [
      'Raw or undercooked meats',
      'Unpasteurized cheeses',
      'Excessive caffeine (>200mg/day)',
      'High-mercury fish (shark, swordfish)'
    ]
  },
  {
    trimester: 3,
    focus: 'Omega-3, calcium, and preparation',
    calories: '+450 calories/day',
    keyNutrients: ['DHA (Omega-3)', 'Calcium', 'Magnesium', 'Protein'],
    tips: [
      'Omega-3 is critical now for baby\'s brain development - eat salmon, walnuts, chia seeds',
      'Calcium needs peak - aim for 3-4 servings of dairy or fortified alternatives',
      'Smaller, more frequent meals help with heartburn and digestion',
      'Stay hydrated to reduce swelling - aim for 8-10 cups water/day',
      'Light exercise helps with sleep and circulation',
      'Avoid lying flat on your back after 20 weeks',
      'Eat fiber-rich foods to prevent constipation'
    ],
    avoid: [
      'Large meals (causes heartburn)',
      'Spicy foods if you have heartburn',
      'Lying flat after eating',
      'Raw or undercooked foods'
    ]
  }
];

