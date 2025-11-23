import type { Nutrient } from '../types';

export const nutrients: Nutrient[] = [
  {
    name: 'Folate',
    rda: '600 mcg/day',
    current: 0,
    target: 600,
    unit: 'mcg',
    importance: 'Prevents neural tube defects, essential for DNA synthesis',
    budgetSources: ['Lentils ($1.50/lb)', 'Spinach ($2/bag)', 'Fortified cereals ($3/box)', 'Black beans ($1/can)'],
    deficiencySigns: ['Neural tube defects risk', 'Anemia', 'Fatigue']
  },
  {
    name: 'Iron',
    rda: '27 mg/day',
    current: 0,
    target: 27,
    unit: 'mg',
    importance: 'Prevents anemia, supports baby\'s growth and brain development',
    budgetSources: ['Canned beans ($1/can)', 'Spinach ($2/bag)', 'Lentils ($1.50/lb)', 'Fortified oatmeal ($3/box)'],
    deficiencySigns: ['Fatigue', 'Pale skin', 'Shortness of breath', 'Dizziness']
  },
  {
    name: 'Calcium',
    rda: '1000 mg/day',
    current: 0,
    target: 1000,
    unit: 'mg',
    importance: 'Builds baby\'s bones and teeth, maintains your bone health',
    budgetSources: ['Milk ($3/gallon)', 'Yogurt ($1/cup)', 'Canned sardines ($2/can)', 'Fortified tofu ($2/block)'],
    deficiencySigns: ['Bone loss', 'Muscle cramps', 'Weak teeth']
  },
  {
    name: 'Vitamin D',
    rda: '600 IU/day',
    current: 0,
    target: 600,
    unit: 'IU',
    importance: 'Helps absorb calcium, supports immune system',
    budgetSources: ['Sunlight (free!)', 'Fortified milk ($3/gallon)', 'Eggs ($2/dozen)', 'Canned salmon ($3/can)'],
    deficiencySigns: ['Weak bones', 'Low mood', 'Fatigue']
  },
  {
    name: 'DHA (Omega-3)',
    rda: '200-300 mg/day',
    current: 0,
    target: 250,
    unit: 'mg',
    importance: 'Critical for baby\'s brain and eye development',
    budgetSources: ['Canned salmon ($3/can)', 'Sardines ($2/can)', 'Walnuts ($4/lb)', 'Chia seeds ($5/bag)'],
    deficiencySigns: ['Poor brain development', 'Vision issues']
  },
  {
    name: 'Protein',
    rda: '71 g/day',
    current: 0,
    target: 71,
    unit: 'g',
    importance: 'Builds baby\'s tissues, muscles, and organs',
    budgetSources: ['Eggs ($2/dozen)', 'Beans ($1/can)', 'Lentils ($1.50/lb)', 'Greek yogurt ($1/cup)'],
    deficiencySigns: ['Slow growth', 'Weakness', 'Edema']
  },
  {
    name: 'Choline',
    rda: '450 mg/day',
    current: 0,
    target: 450,
    unit: 'mg',
    importance: 'Supports brain development and prevents birth defects',
    budgetSources: ['Eggs ($2/dozen)', 'Chicken ($3/lb)', 'Beans ($1/can)', 'Broccoli ($2/bunch)'],
    deficiencySigns: ['Neural tube defects risk', 'Memory issues']
  },
  {
    name: 'Vitamin C',
    rda: '85 mg/day',
    current: 0,
    target: 85,
    unit: 'mg',
    importance: 'Helps absorb iron, supports immune system',
    budgetSources: ['Oranges ($3/bag)', 'Bell peppers ($2/lb)', 'Broccoli ($2/bunch)', 'Tomatoes ($2/lb)'],
    deficiencySigns: ['Poor iron absorption', 'Weak immune system']
  }
];

