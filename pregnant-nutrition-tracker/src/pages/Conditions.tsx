import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Condition {
  name: string;
  description: string;
  foodsToEat: string[];
  foodsToAvoid: string[];
  recipeIdeas: string[];
  tips: string[];
}

const conditions: Condition[] = [
  {
    name: 'Constipation',
    description: 'Common in pregnancy due to hormonal changes and iron supplements',
    foodsToEat: [
      'Oatmeal (28-34g fiber/day)',
      'Prunes ($2/bag)',
      'Chia seeds ($5/bag)',
      'Whole grains',
      'Beans and lentils',
      'Fruits and vegetables'
    ],
    foodsToAvoid: [
      'Processed foods',
      'White bread',
      'Excessive dairy (can be constipating)'
    ],
    recipeIdeas: [
      'Oatmeal with prunes and chia seeds',
      'Lentil soup with vegetables',
      'Whole grain toast with avocado'
    ],
    tips: [
      'Drink 3+ liters of water daily',
      'Add fiber gradually to avoid bloating',
      'Light exercise helps (10-min walk)',
      'Consider stool softeners if needed (ask doctor)'
    ]
  },
  {
    name: 'Morning Sickness / Nausea',
    description: 'Common in first trimester, can occur at any time',
    foodsToEat: [
      'Crackers (before getting out of bed)',
      'Ginger tea or ginger candies',
      'Cold foods (smoothies, yogurt)',
      'Small, frequent meals',
      'Plain rice or toast',
      'Bananas'
    ],
    foodsToAvoid: [
      'Strong-smelling foods',
      'Greasy or fried foods',
      'Spicy foods',
      'Large meals'
    ],
    recipeIdeas: [
      'Crackers with peanut butter',
      'Banana smoothie',
      'Plain rice with scrambled eggs'
    ],
    tips: [
      'Eat before getting out of bed',
      'Small meals every 2-3 hours',
      'Stay hydrated - sip water throughout day',
      'Cold foods reduce smell sensitivity',
      'Ginger can help (tea, candies, supplements)',
      'Avoid cooking smells - ask for help'
    ]
  },
  {
    name: 'Heartburn',
    description: 'Common in later pregnancy due to pressure on stomach',
    foodsToEat: [
      'Small, frequent meals',
      'Non-acidic fruits (bananas, melons)',
      'Lean proteins',
      'Whole grains',
      'Vegetables (non-spicy)'
    ],
    foodsToAvoid: [
      'Spicy foods',
      'Citrus fruits',
      'Tomatoes',
      'Chocolate',
      'Caffeine',
      'Large meals',
      'Fried foods'
    ],
    recipeIdeas: [
      'Oatmeal with banana',
      'Grilled chicken with rice',
      'Steamed vegetables with quinoa'
    ],
    tips: [
      'Eat smaller meals more frequently',
      'Avoid lying down immediately after eating',
      'Sleep propped up if needed',
      'Avoid tight clothing',
      'Eat slowly and chew thoroughly'
    ]
  },
  {
    name: 'Gestational Diabetes',
    description: 'High blood sugar during pregnancy - requires careful meal planning',
    foodsToEat: [
      'Complex carbs (whole grains, beans)',
      'Lean proteins',
      'Non-starchy vegetables',
      'Healthy fats (avocado, nuts)',
      'Fiber-rich foods'
    ],
    foodsToAvoid: [
      'Simple sugars',
      'White bread and pasta',
      'Sugary drinks',
      'Candy and desserts',
      'Fruit juices'
    ],
    recipeIdeas: [
      'Quinoa bowl with vegetables and chicken',
      'Lentil soup',
      'Greek yogurt with berries (limited)'
    ],
    tips: [
      'Eat balanced meals with protein + carbs',
      'Monitor blood sugar as directed by doctor',
      'Regular, light exercise',
      'Work with a dietitian if possible',
      'Space meals evenly throughout day'
    ]
  },
  {
    name: 'Anemia (Iron Deficiency)',
    description: 'Low iron levels - common in pregnancy',
    foodsToEat: [
      'Iron-rich foods: beans, lentils, spinach',
      'Fortified cereals',
      'Lean red meat (if you eat meat)',
      'Pair with vitamin C foods (oranges, bell peppers)',
      'Dark leafy greens'
    ],
    foodsToAvoid: [
      'Tea with meals (reduces iron absorption)',
      'Calcium supplements with iron (take separately)'
    ],
    recipeIdeas: [
      'Lentil soup with bell peppers',
      'Spinach salad with orange slices',
      'Bean and rice bowl with lime'
    ],
    tips: [
      'Take iron supplements as prescribed',
      'Pair iron foods with vitamin C for better absorption',
      'Avoid tea/coffee with iron-rich meals',
      'Cook in cast iron pans if possible',
      'Get regular blood tests as recommended'
    ]
  },
  {
    name: 'Preeclampsia Risk',
    description: 'High blood pressure condition - nutrition can help reduce risk',
    foodsToEat: [
      'Foods rich in calcium and magnesium',
      'Potassium-rich foods (bananas, sweet potatoes)',
      'Lean proteins',
      'Whole grains',
      'Fruits and vegetables'
    ],
    foodsToAvoid: [
      'High sodium foods',
      'Processed foods',
      'Excessive salt',
      'Caffeine (limit)'
    ],
    recipeIdeas: [
      'Salmon with sweet potato',
      'Greek yogurt with berries',
      'Quinoa with vegetables'
    ],
    tips: [
      'Monitor blood pressure regularly',
      'Stay hydrated',
      'Limit sodium intake',
      'Get adequate protein and calcium',
      'Follow doctor\'s recommendations closely',
      'Rest and manage stress'
    ]
  }
];

export default function Conditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Common Pregnancy Conditions & Nutrition Fixes</h1>
          <p className="text-gray-600">
            Troubleshooting guide for common pregnancy-related conditions
          </p>
        </div>

        <div className="space-y-6">
          {conditions.map((condition, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                {condition.name}
              </h2>
              <p className="text-gray-700 mb-4">{condition.description}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    Foods to Eat
                  </h3>
                  <ul className="space-y-2">
                    {condition.foodsToEat.map((food, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-700">
                    <XCircle className="w-5 h-5" />
                    Foods to Avoid
                  </h3>
                  <ul className="space-y-2">
                    {condition.foodsToAvoid.map((food, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Recipe Ideas</h3>
                <ul className="space-y-1">
                  {condition.recipeIdeas.map((recipe, i) => (
                    <li key={i} className="text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">🍽</span>
                      <span>{recipe}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Tips & Recommendations</h3>
                <ul className="space-y-2">
                  {condition.tips.map((tip, i) => (
                    <li key={i} className="text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="font-semibold mb-2">Important Medical Disclaimer:</p>
          <p className="text-sm text-gray-700">
            This information is for educational purposes only and is not a substitute for professional 
            medical advice. Always consult with your healthcare provider for diagnosis and treatment 
            of any medical condition. If you experience severe symptoms, contact your doctor immediately.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

