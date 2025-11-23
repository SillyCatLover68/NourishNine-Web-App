export interface CulturalFood {
  culture: string;
  foods: {
    name: string;
    description: string;
    nutrients: string[];
    safeDuringPregnancy: boolean;
    notes?: string;
    budgetFriendly: boolean;
    preparation: string;
  }[];
}

export const culturalFoods: CulturalFood[] = [
  {
    culture: 'Latin American',
    foods: [
      {
        name: 'Black Beans & Rice',
        description: 'Traditional staple providing complete protein',
        nutrients: ['Iron', 'Folate', 'Protein', 'Fiber'],
        safeDuringPregnancy: true,
        notes: 'Cook beans thoroughly. Avoid raw beans.',
        budgetFriendly: true,
        preparation: 'Cook beans until soft, serve with rice and vegetables'
      },
      {
        name: 'Plantains',
        description: 'Rich in potassium and vitamin C',
        nutrients: ['Potassium', 'Vitamin C', 'Fiber'],
        safeDuringPregnancy: true,
        notes: 'Cook thoroughly - avoid raw plantains',
        budgetFriendly: true,
        preparation: 'Fry or bake until soft and golden'
      },
      {
        name: 'Avocado',
        description: 'Healthy fats and folate',
        nutrients: ['Folate', 'Healthy Fats', 'Potassium'],
        safeDuringPregnancy: true,
        budgetFriendly: true,
        preparation: 'Eat fresh, add to salads or as a side'
      }
    ]
  },
  {
    culture: 'East Asian (e.g. China, Japan, Korea)',
    foods: [
      {
        name: 'Tofu',
        description: 'Plant-based protein and calcium source used across many East Asian cuisines',
        nutrients: ['Protein', 'Calcium', 'Iron'],
        safeDuringPregnancy: true,
        notes: 'Cook thoroughly. Avoid raw or unpasteurized tofu.',
        budgetFriendly: true,
        preparation: 'Pan-fry, steam, or add to soups'
      },
      {
        name: 'Steamed Rice',
        description: 'Staple carbohydrate, easy to digest',
        nutrients: ['Carbohydrates', 'B Vitamins'],
        safeDuringPregnancy: true,
        budgetFriendly: true,
        preparation: 'Steam or boil until soft'
      },
      {
        name: 'Miso or Fermented Soups',
        description: 'Fermented ingredients (miso, kimchi, etc.) can support gut health when prepared safely',
        nutrients: ['Probiotics', 'B Vitamins'],
        safeDuringPregnancy: true,
        notes: 'Prefer pasteurized or cooked preparations; avoid unpasteurized products when unsure.',
        budgetFriendly: true,
        preparation: 'Heat before eating to reduce risk from raw fermentation'
      }
    ]
  },
  {
    culture: 'Southeast Asian (e.g. Thailand, Vietnam, Philippines)',
    foods: [
      {
        name: 'Rice and Noodle Dishes',
        description: 'Staple dishes with vegetables and protein',
        nutrients: ['Carbohydrates', 'B Vitamins', 'Vegetable micronutrients'],
        safeDuringPregnancy: true,
        budgetFriendly: true,
        preparation: 'Cook rice/noodles with vegetables and cooked protein'
      },
      {
        name: 'Cooked Fish & Seafood',
        description: 'Good source of protein and omega-3s when cooked and low-mercury',
        nutrients: ['Protein', 'Omega-3s', 'Vitamin D'],
        safeDuringPregnancy: true,
        notes: 'Choose low-mercury fish and ensure fully cooked; avoid raw preparations.',
        budgetFriendly: false,
        preparation: 'Grill, steam, or simmer until fully cooked'
      },
      {
        name: 'Coconut in Cooking',
        description: 'Used widely (milk, oil) in many islands and mainland cuisines—nutritious but not the only ingredient',
        nutrients: ['Healthy Fats', 'Fiber'],
        safeDuringPregnancy: true,
        budgetFriendly: true,
        notes: 'Coconut is one ingredient among many; don\'t rely on a single food to represent a whole culture.',
        preparation: 'Use coconut milk in curries, soups, or use fresh coconut in moderation'
      }
    ]
  },
  {
    culture: 'South Asian (e.g. India, Pakistan, Bangladesh, Sri Lanka)',
    foods: [
      {
        name: 'Dal (Lentil Curry)',
        description: 'Staple legume dish rich in protein and iron',
        nutrients: ['Protein', 'Iron', 'Folate', 'Fiber'],
        safeDuringPregnancy: true,
        notes: 'Cook lentils until very soft',
        budgetFriendly: true,
        preparation: 'Simmer lentils with spices, serve with rice or roti'
      },
      {
        name: 'Chickpeas (Chana)',
        description: 'Versatile plant protein used in many preparations',
        nutrients: ['Protein', 'Iron', 'Folate', 'Fiber'],
        safeDuringPregnancy: true,
        budgetFriendly: true,
        preparation: 'Cook until soft, season with spices'
      },
      {
        name: 'Yogurt (Dahi)',
        description: 'Probiotics and calcium, commonly eaten or used in sauces',
        nutrients: ['Calcium', 'Protein', 'Probiotics'],
        safeDuringPregnancy: true,
        notes: 'Use pasteurized dairy products when possible',
        budgetFriendly: true,
        preparation: 'Eat plain or as part of raita and chutneys'
      }
    ]
  },
  {
    culture: 'African',
    foods: [
      {
        name: 'Lentils',
        description: 'Excellent source of iron and protein',
        nutrients: ['Iron', 'Protein', 'Folate', 'Fiber'],
        safeDuringPregnancy: true,
        notes: 'Cook until very soft',
        budgetFriendly: true,
        preparation: 'Boil with spices, serve with rice or bread'
      },
      {
        name: 'Collard Greens',
        description: 'High in folate and calcium',
        nutrients: ['Folate', 'Calcium', 'Iron', 'Vitamin K'],
        safeDuringPregnancy: true,
        budgetFriendly: true,
        preparation: 'Steam or boil until tender'
      },
      {
        name: 'Sweet Potatoes',
        description: 'Rich in beta-carotene and fiber',
        nutrients: ['Vitamin A', 'Fiber', 'Potassium'],
        safeDuringPregnancy: true,
        budgetFriendly: true,
        preparation: 'Bake, boil, or steam until soft'
      }
    ]
  },
  {
    culture: 'Middle Eastern',
    foods: [
      {
        name: 'Hummus',
        description: 'Chickpea-based dip, high in protein',
        nutrients: ['Protein', 'Fiber', 'Iron'],
        safeDuringPregnancy: true,
        notes: 'Ensure fresh, avoid if left out too long',
        budgetFriendly: true,
        preparation: 'Blend chickpeas with tahini, lemon, and garlic'
      },
      {
        name: 'Falafel',
        description: 'Chickpea fritters, protein-rich',
        nutrients: ['Protein', 'Iron', 'Fiber'],
        safeDuringPregnancy: true,
        notes: 'Cook thoroughly - ensure fully cooked inside',
        budgetFriendly: true,
        preparation: 'Deep fry or bake until golden and cooked through'
      },
      {
        name: 'Lentil Soup',
        description: 'Comforting, nutrient-dense soup',
        nutrients: ['Iron', 'Protein', 'Folate'],
        safeDuringPregnancy: true,
        budgetFriendly: true,
        preparation: 'Simmer lentils with vegetables and spices'
      }
    ]
  },

  {
    culture: 'Caribbean',
    foods: [
      {
        name: 'Callaloo',
        description: 'Leafy green high in iron and folate',
        nutrients: ['Iron', 'Folate', 'Calcium', 'Vitamin A'],
        safeDuringPregnancy: true,
        budgetFriendly: true,
        preparation: 'Steam or sauté until tender'
      },
      {
        name: 'Ackee',
        description: 'Fruit high in healthy fats',
        nutrients: ['Healthy Fats', 'Vitamin C'],
        safeDuringPregnancy: true,
        notes: 'Must be fully ripe and cooked - unripe ackee is toxic',
        budgetFriendly: true,
        preparation: 'Cook thoroughly with saltfish or vegetables'
      },
      {
        name: 'Rice and Peas',
        description: 'Staple side dish made with rice and beans/peas, often cooked in coconut milk',
        nutrients: ['Carbohydrates', 'Protein', 'Fiber', 'Healthy Fats (if coconut used)'],
        safeDuringPregnancy: true,
        budgetFriendly: true,
        preparation: 'Simmer rice with kidney beans/peas, coconut milk, and spices'
      },
      {
        name: 'Jerk Chicken (or Jerk Tofu)',
        description: 'Spiced, cooked protein rich in flavor—use lean cuts and fully cook',
        nutrients: ['Protein', 'B Vitamins'],
        safeDuringPregnancy: true,
        notes: 'Ensure meat is fully cooked; choose less spicy options if needed',
        budgetFriendly: false,
        preparation: 'Marinate and grill or bake until fully cooked'
      }
    ]
  }
];

export function getCulturalFoodsByCulture(culture: string): CulturalFood | undefined {
  return culturalFoods.find(cf => 
    cf.culture.toLowerCase().includes(culture.toLowerCase())
  );
}

export function getAllCultures(): string[] {
  return culturalFoods.map(cf => cf.culture);
}

