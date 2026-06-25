import type { Profile } from "@workspace/db";
import type { GroceryItem } from "@workspace/db";
import type { DayMeal, MealDetail } from "@workspace/db";

// ─── Meal Templates ────────────────────────────────────────────────────────

const VEG_BREAKFASTS: MealDetail[] = [
  { name: "Oats Porridge with Fruits", calories: 320, protein: 10, carbs: 55, fat: 6, cookingTime: 10, recipeId: null },
  { name: "Poha with Peanuts", calories: 290, protein: 8, carbs: 50, fat: 7, cookingTime: 15, recipeId: null },
  { name: "Idli Sambar", calories: 280, protein: 9, carbs: 52, fat: 4, cookingTime: 20, recipeId: null },
  { name: "Upma with Vegetables", calories: 310, protein: 8, carbs: 48, fat: 8, cookingTime: 15, recipeId: null },
  { name: "Besan Chilla", calories: 260, protein: 12, carbs: 35, fat: 7, cookingTime: 15, recipeId: null },
  { name: "Wheat Dosa with Chutney", calories: 300, protein: 8, carbs: 52, fat: 6, cookingTime: 20, recipeId: null },
  { name: "Bread Toast with Peanut Butter", calories: 350, protein: 12, carbs: 45, fat: 12, cookingTime: 5, recipeId: null },
];

const EGG_BREAKFASTS: MealDetail[] = [
  { name: "Scrambled Eggs with Toast", calories: 380, protein: 22, carbs: 30, fat: 16, cookingTime: 10, recipeId: null },
  { name: "Egg Bhurji with Paratha", calories: 420, protein: 20, carbs: 45, fat: 15, cookingTime: 15, recipeId: null },
  { name: "Boiled Eggs with Oats", calories: 350, protein: 20, carbs: 42, fat: 10, cookingTime: 10, recipeId: null },
  { name: "Omelette with Vegetables", calories: 300, protein: 18, carbs: 12, fat: 18, cookingTime: 10, recipeId: null },
  ...VEG_BREAKFASTS,
];

const NON_VEG_BREAKFASTS: MealDetail[] = [
  { name: "Chicken Sandwich", calories: 450, protein: 35, carbs: 40, fat: 12, cookingTime: 15, recipeId: null },
  { name: "Tuna Salad Toast", calories: 380, protein: 30, carbs: 30, fat: 10, cookingTime: 10, recipeId: null },
  ...EGG_BREAKFASTS,
];

const VEG_LUNCHES: MealDetail[] = [
  { name: "Dal Rice with Sabzi", calories: 480, protein: 16, carbs: 80, fat: 8, cookingTime: 30, recipeId: null },
  { name: "Rajma Chawal", calories: 520, protein: 20, carbs: 85, fat: 7, cookingTime: 40, recipeId: null },
  { name: "Chole with Bhatura", calories: 580, protein: 18, carbs: 85, fat: 16, cookingTime: 35, recipeId: null },
  { name: "Palak Paneer with Roti", calories: 490, protein: 22, carbs: 55, fat: 18, cookingTime: 30, recipeId: null },
  { name: "Vegetable Biryani", calories: 550, protein: 14, carbs: 90, fat: 12, cookingTime: 45, recipeId: null },
  { name: "Aloo Gobi with Roti", calories: 440, protein: 12, carbs: 70, fat: 10, cookingTime: 30, recipeId: null },
  { name: "Mixed Veg Curry Rice", calories: 460, protein: 13, carbs: 78, fat: 9, cookingTime: 30, recipeId: null },
];

const NON_VEG_LUNCHES: MealDetail[] = [
  { name: "Chicken Curry with Rice", calories: 580, protein: 38, carbs: 65, fat: 16, cookingTime: 40, recipeId: null },
  { name: "Fish Curry with Rice", calories: 520, protein: 35, carbs: 60, fat: 14, cookingTime: 35, recipeId: null },
  { name: "Mutton Biryani", calories: 650, protein: 40, carbs: 75, fat: 20, cookingTime: 60, recipeId: null },
  { name: "Egg Curry with Roti", calories: 490, protein: 24, carbs: 55, fat: 18, cookingTime: 30, recipeId: null },
  { name: "Chicken Biryani", calories: 620, protein: 42, carbs: 72, fat: 18, cookingTime: 50, recipeId: null },
  ...VEG_LUNCHES,
];

const VEG_DINNERS: MealDetail[] = [
  { name: "Moong Dal Khichdi", calories: 380, protein: 14, carbs: 65, fat: 6, cookingTime: 25, recipeId: null },
  { name: "Paneer Bhurji with Roti", calories: 450, protein: 24, carbs: 48, fat: 18, cookingTime: 20, recipeId: null },
  { name: "Vegetable Soup with Bread", calories: 280, protein: 8, carbs: 42, fat: 6, cookingTime: 20, recipeId: null },
  { name: "Masoor Dal with Rice", calories: 430, protein: 18, carbs: 72, fat: 6, cookingTime: 30, recipeId: null },
  { name: "Baingan Bharta with Roti", calories: 380, protein: 10, carbs: 55, fat: 10, cookingTime: 35, recipeId: null },
  { name: "Matar Paneer with Roti", calories: 480, protein: 22, carbs: 58, fat: 18, cookingTime: 30, recipeId: null },
  { name: "Kadhi Chawal", calories: 400, protein: 12, carbs: 68, fat: 8, cookingTime: 30, recipeId: null },
];

const NON_VEG_DINNERS: MealDetail[] = [
  { name: "Grilled Chicken with Salad", calories: 420, protein: 45, carbs: 15, fat: 18, cookingTime: 25, recipeId: null },
  { name: "Fish Tikka with Dal", calories: 480, protein: 42, carbs: 35, fat: 16, cookingTime: 30, recipeId: null },
  { name: "Chicken Soup with Bread", calories: 350, protein: 30, carbs: 32, fat: 10, cookingTime: 25, recipeId: null },
  ...VEG_DINNERS,
];

const SNACKS: MealDetail[] = [
  { name: "Mixed Nuts", calories: 180, protein: 6, carbs: 8, fat: 14, cookingTime: 0, recipeId: null },
  { name: "Fruit Salad", calories: 120, protein: 2, carbs: 28, fat: 1, cookingTime: 5, recipeId: null },
  { name: "Roasted Chana", calories: 140, protein: 8, carbs: 20, fat: 3, cookingTime: 0, recipeId: null },
  { name: "Green Tea with Biscuits", calories: 100, protein: 2, carbs: 18, fat: 3, cookingTime: 5, recipeId: null },
  { name: "Buttermilk", calories: 60, protein: 3, carbs: 8, fat: 1, cookingTime: 5, recipeId: null },
  { name: "Apple with Peanut Butter", calories: 200, protein: 5, carbs: 28, fat: 8, cookingTime: 0, recipeId: null },
  { name: "Sprouts Salad", calories: 130, protein: 8, carbs: 20, fat: 2, cookingTime: 10, recipeId: null },
];

function pick<T>(arr: T[], idx: number): T {
  return arr[idx % arr.length];
}

function getBreakfasts(diet: string) {
  if (diet === "Non-Veg") return NON_VEG_BREAKFASTS;
  if (diet === "Eggitarian") return EGG_BREAKFASTS;
  return VEG_BREAKFASTS;
}
function getLunches(diet: string) {
  if (diet === "Non-Veg") return NON_VEG_LUNCHES;
  return VEG_LUNCHES;
}
function getDinners(diet: string) {
  if (diet === "Non-Veg") return NON_VEG_DINNERS;
  return VEG_DINNERS;
}

// Adjust calories based on goal
function adjustCalories(meal: MealDetail, goal: string): MealDetail {
  const factor = goal === "Weight Loss" ? 0.85 : goal === "Muscle Gain" ? 1.15 : 1;
  return {
    ...meal,
    calories: Math.round(meal.calories * factor),
    protein: goal === "Muscle Gain" ? Math.round(meal.protein * 1.2 * 10) / 10 : meal.protein,
  };
}

export function generateMealPlan(profile: Profile): DayMeal[] {
  const breakfasts = getBreakfasts(profile.dietPreference);
  const lunches = getLunches(profile.dietPreference);
  const dinners = getDinners(profile.dietPreference);

  const today = new Date();
  const days: DayMeal[] = [];

  for (let day = 1; day <= 30; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day - 1);
    const dateStr = date.toISOString().split("T")[0];

    const breakfast = adjustCalories(pick(breakfasts, day * 3), profile.goal);
    const lunch = adjustCalories(pick(lunches, day * 7 + 1), profile.goal);
    const dinner = adjustCalories(pick(dinners, day * 5 + 2), profile.goal);
    const snack = pick(SNACKS, day * 2);

    const totalCalories = breakfast.calories + lunch.calories + dinner.calories + snack.calories;
    const totalProtein = breakfast.protein + lunch.protein + dinner.protein + snack.protein;
    const totalCarbs = breakfast.carbs + lunch.carbs + dinner.carbs + snack.carbs;
    const totalFat = breakfast.fat + lunch.fat + dinner.fat + snack.fat;

    days.push({
      day,
      date: dateStr,
      breakfast,
      lunch,
      dinner,
      snacks: [snack],
      totalCalories,
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalFat: Math.round(totalFat * 10) / 10,
    });
  }

  return days;
}

// ─── Grocery Planner ──────────────────────────────────────────────────────

export function generateGroceryList(profile: Profile): GroceryItem[] {
  const isVeg = profile.dietPreference === "Veg";
  const isEgg = profile.dietPreference === "Eggitarian";
  const budgetFactor = Math.min(profile.monthlyBudget / 5000, 1.5);

  const items: GroceryItem[] = [
    // Grains & Cereals
    { name: "Basmati Rice", quantity: 5, unit: "kg", estimatedCost: Math.round(300 * budgetFactor), category: "Grains & Cereals" },
    { name: "Wheat Flour (Atta)", quantity: 5, unit: "kg", estimatedCost: Math.round(220 * budgetFactor), category: "Grains & Cereals" },
    { name: "Rolled Oats", quantity: 1, unit: "kg", estimatedCost: 180, category: "Grains & Cereals" },
    { name: "Poha", quantity: 1, unit: "kg", estimatedCost: 60, category: "Grains & Cereals" },
    { name: "Semolina (Rava)", quantity: 0.5, unit: "kg", estimatedCost: 30, category: "Grains & Cereals" },
    // Pulses & Legumes
    { name: "Toor Dal", quantity: 1, unit: "kg", estimatedCost: 160, category: "Pulses & Legumes" },
    { name: "Moong Dal", quantity: 0.5, unit: "kg", estimatedCost: 80, category: "Pulses & Legumes" },
    { name: "Rajma (Kidney Beans)", quantity: 0.5, unit: "kg", estimatedCost: 90, category: "Pulses & Legumes" },
    { name: "Chana Dal", quantity: 0.5, unit: "kg", estimatedCost: 70, category: "Pulses & Legumes" },
    { name: "Masoor Dal", quantity: 0.5, unit: "kg", estimatedCost: 65, category: "Pulses & Legumes" },
    // Vegetables
    { name: "Tomatoes", quantity: 3, unit: "kg", estimatedCost: 90, category: "Vegetables" },
    { name: "Onions", quantity: 3, unit: "kg", estimatedCost: 75, category: "Vegetables" },
    { name: "Potatoes", quantity: 3, unit: "kg", estimatedCost: 75, category: "Vegetables" },
    { name: "Spinach (Palak)", quantity: 1, unit: "kg", estimatedCost: 40, category: "Vegetables" },
    { name: "Cauliflower", quantity: 2, unit: "pcs", estimatedCost: 60, category: "Vegetables" },
    { name: "Capsicum", quantity: 0.5, unit: "kg", estimatedCost: 40, category: "Vegetables" },
    { name: "Brinjal (Baingan)", quantity: 0.5, unit: "kg", estimatedCost: 30, category: "Vegetables" },
    { name: "Green Peas", quantity: 0.5, unit: "kg", estimatedCost: 50, category: "Vegetables" },
    // Fruits
    { name: "Bananas", quantity: 2, unit: "dozen", estimatedCost: 60, category: "Fruits" },
    { name: "Apples", quantity: 1, unit: "kg", estimatedCost: 120, category: "Fruits" },
    { name: "Seasonal Fruit Mix", quantity: 2, unit: "kg", estimatedCost: 160, category: "Fruits" },
    // Dairy
    { name: "Milk", quantity: 15, unit: "litres", estimatedCost: 750, category: "Dairy" },
    { name: "Curd (Dahi)", quantity: 2, unit: "kg", estimatedCost: 120, category: "Dairy" },
    { name: "Paneer", quantity: isVeg || isEgg ? 0.5 : 0.25, unit: "kg", estimatedCost: isVeg || isEgg ? 130 : 65, category: "Dairy" },
    { name: "Ghee", quantity: 0.5, unit: "kg", estimatedCost: 300, category: "Dairy" },
    // Oils & Condiments
    { name: "Refined Oil", quantity: 2, unit: "litres", estimatedCost: 200, category: "Oils & Condiments" },
    { name: "Mustard Oil", quantity: 1, unit: "litre", estimatedCost: 180, category: "Oils & Condiments" },
    { name: "Salt", quantity: 1, unit: "kg", estimatedCost: 20, category: "Oils & Condiments" },
    { name: "Turmeric Powder", quantity: 0.1, unit: "kg", estimatedCost: 30, category: "Spices & Masalas" },
    { name: "Red Chilli Powder", quantity: 0.1, unit: "kg", estimatedCost: 35, category: "Spices & Masalas" },
    { name: "Coriander Powder", quantity: 0.1, unit: "kg", estimatedCost: 30, category: "Spices & Masalas" },
    { name: "Garam Masala", quantity: 0.05, unit: "kg", estimatedCost: 40, category: "Spices & Masalas" },
    { name: "Cumin Seeds (Jeera)", quantity: 0.1, unit: "kg", estimatedCost: 25, category: "Spices & Masalas" },
    { name: "Ginger-Garlic Paste", quantity: 0.2, unit: "kg", estimatedCost: 40, category: "Spices & Masalas" },
    // Snacks & Dry Fruits
    { name: "Mixed Nuts", quantity: 0.25, unit: "kg", estimatedCost: 200, category: "Snacks & Dry Fruits" },
    { name: "Roasted Chana", quantity: 0.5, unit: "kg", estimatedCost: 60, category: "Snacks & Dry Fruits" },
    { name: "Peanut Butter", quantity: 1, unit: "jar", estimatedCost: 180, category: "Snacks & Dry Fruits" },
    { name: "Biscuits (whole grain)", quantity: 4, unit: "packs", estimatedCost: 80, category: "Snacks & Dry Fruits" },
  ];

  // Add eggs/non-veg items
  if (isEgg || !isVeg) {
    items.push({ name: "Eggs", quantity: 30, unit: "pcs", estimatedCost: 270, category: "Eggs & Poultry" });
  }
  if (!isVeg && !isEgg) {
    items.push({ name: "Chicken (boneless)", quantity: 2, unit: "kg", estimatedCost: 500, category: "Eggs & Poultry" });
    items.push({ name: "Fish (rohu/catla)", quantity: 1, unit: "kg", estimatedCost: 280, category: "Fish & Seafood" });
  }

  // Filter allergies (simple keyword match)
  const allergies = (profile.foodAllergies ?? "").toLowerCase();
  return items.filter(item => {
    if (allergies.includes("nut") && item.name.toLowerCase().includes("nut")) return false;
    if (allergies.includes("dairy") && item.category === "Dairy") return false;
    if (allergies.includes("gluten") && (item.name.includes("Wheat") || item.name.includes("Atta") || item.name.includes("Bread"))) return false;
    return true;
  });
}
