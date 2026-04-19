export type MealIdea = {
  name: string;
  cuisine: string;
  ingredients: string;
  approxCalories: number;
  type: "breakfast" | "lunch" | "dinner" | "snack";
};

export const breakfastMeals: MealIdea[] = [
  { name: "Scrambled Eggs on Toast", cuisine: "Classic", ingredients: "2 eggs, 1 slice whole grain toast, butter, salt, pepper", approxCalories: 280, type: "breakfast" },
  { name: "Oatmeal with Banana & Honey", cuisine: "Classic", ingredients: "½ cup oats, 1 banana, 1 tbsp honey, 1 cup water or milk", approxCalories: 310, type: "breakfast" },
  { name: "Yogurt with Granola & Berries", cuisine: "Classic", ingredients: "1 cup Greek yogurt, ¼ cup granola, ½ cup mixed berries, 1 tsp honey", approxCalories: 290, type: "breakfast" },
  { name: "Peanut Butter Toast with Banana", cuisine: "Classic", ingredients: "2 slices whole grain bread, 2 tbsp peanut butter, 1 banana", approxCalories: 320, type: "breakfast" },
  { name: "Cereal with Milk", cuisine: "Classic", ingredients: "1½ cups whole grain cereal, 1 cup milk, ½ cup berries", approxCalories: 270, type: "breakfast" },
  { name: "Avocado Toast with Egg", cuisine: "Classic", ingredients: "1 slice toast, ½ avocado, 1 fried egg, salt, pepper, red pepper flakes", approxCalories: 350, type: "breakfast" },
  { name: "Fried Eggs with Toast", cuisine: "Classic", ingredients: "2 eggs, 2 slices whole grain toast, butter, salt, pepper", approxCalories: 310, type: "breakfast" },
  { name: "Overnight Oats with Berries", cuisine: "Classic", ingredients: "½ cup oats, ½ cup milk, ½ cup berries, 1 tbsp honey", approxCalories: 300, type: "breakfast" },
  { name: "Banana Smoothie", cuisine: "Classic", ingredients: "1 banana, 1 cup milk, 1 tbsp peanut butter, handful of ice", approxCalories: 280, type: "breakfast" },
  { name: "Egg & Cheese Sandwich", cuisine: "Classic", ingredients: "1 English muffin, 2 eggs, 1 slice cheddar, butter", approxCalories: 370, type: "breakfast" },
  { name: "Cottage Cheese with Fruit", cuisine: "Classic", ingredients: "1 cup cottage cheese, ½ cup pineapple chunks, 1 tsp honey", approxCalories: 240, type: "breakfast" },
  { name: "Boiled Eggs with Toast", cuisine: "Classic", ingredients: "2 boiled eggs, 1 slice whole grain toast, butter, salt", approxCalories: 270, type: "breakfast" },
  { name: "Pancakes with Maple Syrup", cuisine: "Classic", ingredients: "1 cup pancake mix, 1 egg, ¾ cup milk, 2 tbsp maple syrup, butter", approxCalories: 400, type: "breakfast" },
  { name: "Bagel with Cream Cheese", cuisine: "Classic", ingredients: "1 whole grain bagel, 2 tbsp cream cheese, pinch of salt", approxCalories: 330, type: "breakfast" },
  { name: "Frozen Waffle with Fruit", cuisine: "Classic", ingredients: "2 frozen waffles, ½ cup strawberries, 1 tbsp maple syrup", approxCalories: 290, type: "breakfast" },
  { name: "Apple with Peanut Butter", cuisine: "Classic", ingredients: "1 large apple, 2 tbsp peanut butter", approxCalories: 250, type: "breakfast" },
  { name: "Berry Smoothie Bowl", cuisine: "Classic", ingredients: "1 cup frozen mixed berries, 1 banana, ½ cup yogurt, 2 tbsp granola", approxCalories: 310, type: "breakfast" },
  { name: "Muffin & Hard-Boiled Egg", cuisine: "Classic", ingredients: "1 store-bought whole grain muffin, 2 hard-boiled eggs", approxCalories: 340, type: "breakfast" },
  { name: "Cream of Wheat with Brown Sugar", cuisine: "Classic", ingredients: "½ cup cream of wheat, 1 tbsp brown sugar, 1 tsp butter, 1 cup milk", approxCalories: 280, type: "breakfast" },
  { name: "Toast with Butter & Jam", cuisine: "Classic", ingredients: "2 slices whole grain toast, 1 tbsp butter, 2 tbsp strawberry jam", approxCalories: 280, type: "breakfast" },
];

export const lunchMeals: MealIdea[] = [
  { name: "Turkey & Cheese Sandwich", cuisine: "Classic", ingredients: "2 slices whole grain bread, 3 oz turkey, 1 slice cheddar, lettuce, tomato, mustard", approxCalories: 380, type: "lunch" },
  { name: "Grilled Cheese Sandwich", cuisine: "Classic", ingredients: "2 slices white bread, 2 slices American cheese, 1 tbsp butter", approxCalories: 380, type: "lunch" },
  { name: "Tuna Salad Sandwich", cuisine: "Classic", ingredients: "2 slices bread, 1 can tuna, 2 tbsp mayo, celery, pickle, lettuce", approxCalories: 390, type: "lunch" },
  { name: "PB&J Sandwich", cuisine: "Classic", ingredients: "2 slices whole grain bread, 2 tbsp peanut butter, 2 tbsp grape jelly", approxCalories: 370, type: "lunch" },
  { name: "Chicken Noodle Soup with Crackers", cuisine: "Classic", ingredients: "1 can chicken noodle soup, 10 crackers", approxCalories: 300, type: "lunch" },
  { name: "Mac & Cheese", cuisine: "Classic", ingredients: "1 box mac & cheese (Kraft or store brand), 2 tbsp butter, ¼ cup milk", approxCalories: 410, type: "lunch" },
  { name: "Bean & Rice Bowl", cuisine: "Classic", ingredients: "1 cup brown rice, 1 cup canned black beans, ¼ cup salsa, 2 tbsp shredded cheese", approxCalories: 420, type: "lunch" },
  { name: "Quesadilla with Cheese & Beans", cuisine: "Classic", ingredients: "1 flour tortilla, ½ cup canned beans, ¼ cup shredded cheddar, salsa", approxCalories: 390, type: "lunch" },
  { name: "Tomato Soup & Grilled Cheese", cuisine: "Classic", ingredients: "1 can tomato soup, 2 slices bread, 2 slices cheese, butter", approxCalories: 450, type: "lunch" },
  { name: "Caesar Salad with Chicken", cuisine: "Classic", ingredients: "2 cups romaine, 3 oz grilled chicken, 2 tbsp Caesar dressing, parmesan, croutons", approxCalories: 380, type: "lunch" },
  { name: "Leftovers Bowl", cuisine: "Classic", ingredients: "Whatever protein + veggies + grain you have from dinner, warmed up", approxCalories: 380, type: "lunch" },
  { name: "Egg Salad Sandwich", cuisine: "Classic", ingredients: "2 slices bread, 2 hard-boiled eggs, 1 tbsp mayo, mustard, salt, pepper", approxCalories: 370, type: "lunch" },
  { name: "Ham & Swiss Wrap", cuisine: "Classic", ingredients: "1 flour tortilla, 3 oz ham, 1 slice Swiss cheese, lettuce, mustard", approxCalories: 380, type: "lunch" },
  { name: "Veggie Wrap with Hummus", cuisine: "Classic", ingredients: "1 flour tortilla, 3 tbsp hummus, cucumber, tomato, spinach, shredded carrot", approxCalories: 330, type: "lunch" },
  { name: "Lentil Soup", cuisine: "Classic", ingredients: "1 cup red lentils, 1 can diced tomatoes, 1 carrot, garlic, cumin, salt", approxCalories: 350, type: "lunch" },
  { name: "Hot Dog with Bun", cuisine: "Classic", ingredients: "1 beef hot dog, 1 bun, ketchup, mustard, relish", approxCalories: 320, type: "lunch" },
  { name: "Simple Chicken Salad", cuisine: "Classic", ingredients: "3 oz rotisserie chicken, 2 cups romaine, tomato, cucumber, 2 tbsp Italian dressing", approxCalories: 310, type: "lunch" },
  { name: "Baked Potato with Toppings", cuisine: "Classic", ingredients: "1 large potato, 2 tbsp butter, 2 tbsp sour cream, shredded cheese, chives", approxCalories: 400, type: "lunch" },
  { name: "Ramen Noodles with Egg", cuisine: "Classic", ingredients: "1 pack instant ramen, 1 egg, handful of spinach, soy sauce", approxCalories: 380, type: "lunch" },
  { name: "Cheese & Crackers with Fruit", cuisine: "Classic", ingredients: "15 crackers, 2 oz cheddar cheese, 1 apple, handful of grapes", approxCalories: 370, type: "lunch" },
];

export const dinnerMeals: MealIdea[] = [
  { name: "Baked Chicken with Rice & Broccoli", cuisine: "Classic", ingredients: "2 chicken breasts, 1 cup white rice, 2 cups broccoli, olive oil, garlic, salt", approxCalories: 480, type: "dinner" },
  { name: "Spaghetti with Marinara Sauce", cuisine: "Classic", ingredients: "2 oz dry spaghetti, 1 jar marinara sauce, parmesan cheese, garlic bread optional", approxCalories: 440, type: "dinner" },
  { name: "Beef Tacos", cuisine: "Classic", ingredients: "½ lb ground beef, 6 corn tortillas, taco seasoning, shredded cheese, lettuce, tomato, sour cream", approxCalories: 520, type: "dinner" },
  { name: "Grilled Cheese & Tomato Soup", cuisine: "Classic", ingredients: "2 slices bread, 2 slices cheese, butter, 1 can tomato soup", approxCalories: 460, type: "dinner" },
  { name: "Chicken Stir-Fry with Rice", cuisine: "Classic", ingredients: "2 chicken breasts, 2 cups frozen stir-fry vegetables, 1 cup rice, 3 tbsp soy sauce, garlic", approxCalories: 490, type: "dinner" },
  { name: "Chili with Cornbread", cuisine: "Classic", ingredients: "1 can kidney beans, ½ lb ground beef, 1 can diced tomatoes, chili seasoning, boxed cornbread mix", approxCalories: 550, type: "dinner" },
  { name: "Baked Salmon with Potatoes", cuisine: "Classic", ingredients: "1 salmon fillet, 2 medium potatoes, olive oil, lemon, garlic, dill, salt", approxCalories: 480, type: "dinner" },
  { name: "Pasta with Butter & Parmesan", cuisine: "Classic", ingredients: "2 oz pasta, 2 tbsp butter, ¼ cup parmesan, garlic powder, salt, pepper", approxCalories: 420, type: "dinner" },
  { name: "Chicken Quesadillas", cuisine: "Classic", ingredients: "2 flour tortillas, 1 cup shredded chicken, ½ cup cheese, salsa, sour cream", approxCalories: 500, type: "dinner" },
  { name: "Meatloaf with Mashed Potatoes", cuisine: "Classic", ingredients: "1 lb ground beef, breadcrumbs, egg, ketchup, onion, 4 potatoes, butter, milk", approxCalories: 580, type: "dinner" },
  { name: "Pork Chops with Applesauce & Green Beans", cuisine: "Classic", ingredients: "2 pork chops, canned applesauce, 1 cup green beans, butter, salt, pepper", approxCalories: 460, type: "dinner" },
  { name: "Hamburgers with Fries", cuisine: "Classic", ingredients: "½ lb ground beef, 2 buns, lettuce, tomato, ketchup, mustard, frozen fries", approxCalories: 620, type: "dinner" },
  { name: "Pizza (Store-Bought or Frozen)", cuisine: "Classic", ingredients: "Store-bought pizza dough or frozen pizza, marinara sauce, mozzarella, toppings of choice", approxCalories: 520, type: "dinner" },
  { name: "Baked Mac & Cheese", cuisine: "Classic", ingredients: "2 cups elbow macaroni, 2 cups cheddar, 2 tbsp butter, 1½ cups milk, breadcrumbs", approxCalories: 540, type: "dinner" },
  { name: "Sheet Pan Chicken & Veggies", cuisine: "Classic", ingredients: "2 chicken thighs, 1 zucchini, 1 bell pepper, 1 cup cherry tomatoes, olive oil, Italian seasoning", approxCalories: 430, type: "dinner" },
  { name: "Chicken Soup with Noodles", cuisine: "Classic", ingredients: "2 chicken breasts, egg noodles, chicken broth, celery, carrots, onion, salt, pepper", approxCalories: 390, type: "dinner" },
  { name: "Hot Dogs with Mac & Cheese", cuisine: "Classic", ingredients: "2 hot dogs, 1 box mac & cheese", approxCalories: 520, type: "dinner" },
  { name: "Simple Steak with Potatoes", cuisine: "Classic", ingredients: "6 oz sirloin steak, 2 potatoes, butter, garlic, salt, pepper", approxCalories: 550, type: "dinner" },
  { name: "Bean & Cheese Burritos", cuisine: "Classic", ingredients: "2 flour tortillas, 1 can refried beans, 1 cup shredded cheese, salsa, sour cream", approxCalories: 500, type: "dinner" },
  { name: "Tuna Noodle Casserole", cuisine: "Classic", ingredients: "egg noodles, 2 cans tuna, 1 can cream of mushroom soup, peas, breadcrumbs", approxCalories: 470, type: "dinner" },
];

export const snackMeals: MealIdea[] = [
  { name: "Apple with Peanut Butter", cuisine: "Classic", ingredients: "1 apple, 2 tbsp peanut butter", approxCalories: 200, type: "snack" },
  { name: "Cheese & Crackers", cuisine: "Classic", ingredients: "1 oz cheddar, 10 crackers", approxCalories: 180, type: "snack" },
  { name: "Greek Yogurt with Honey", cuisine: "Classic", ingredients: "½ cup Greek yogurt, 1 tsp honey", approxCalories: 130, type: "snack" },
  { name: "Carrots & Hummus", cuisine: "Classic", ingredients: "1 cup baby carrots, 3 tbsp hummus", approxCalories: 120, type: "snack" },
  { name: "Banana with Peanut Butter", cuisine: "Classic", ingredients: "1 banana, 1 tbsp peanut butter", approxCalories: 190, type: "snack" },
  { name: "Trail Mix", cuisine: "Classic", ingredients: "¼ cup mixed nuts, 2 tbsp dried cranberries, 1 tbsp chocolate chips", approxCalories: 210, type: "snack" },
  { name: "Hard-Boiled Eggs", cuisine: "Classic", ingredients: "2 hard-boiled eggs, salt, pepper", approxCalories: 140, type: "snack" },
  { name: "String Cheese & Grapes", cuisine: "Classic", ingredients: "1 string cheese, 1 cup grapes", approxCalories: 150, type: "snack" },
  { name: "Popcorn", cuisine: "Classic", ingredients: "3 cups air-popped popcorn, light butter, salt", approxCalories: 120, type: "snack" },
  { name: "Rice Cakes with Peanut Butter", cuisine: "Classic", ingredients: "2 rice cakes, 2 tbsp peanut butter", approxCalories: 190, type: "snack" },
  { name: "Celery & Peanut Butter", cuisine: "Classic", ingredients: "3 stalks celery, 2 tbsp peanut butter, raisins optional", approxCalories: 160, type: "snack" },
  { name: "Cottage Cheese with Peaches", cuisine: "Classic", ingredients: "½ cup cottage cheese, ½ cup canned peaches", approxCalories: 150, type: "snack" },
];

export function getRandomMealSample(
  type: "breakfast" | "lunch" | "dinner" | "snack",
  count: number
): MealIdea[] {
  const pools: Record<string, MealIdea[]> = {
    breakfast: breakfastMeals,
    lunch: lunchMeals,
    dinner: dinnerMeals,
    snack: snackMeals,
  };
  const pool = pools[type] ?? breakfastMeals;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRandomCuisines(count: number): string[] {
  const cuisines = ["Classic American", "Quick & Easy", "Comfort Food", "Simple Home Cooking"];
  return cuisines.slice(0, count);
}

export function getRandomIngredients(): [string, string, string] {
  const proteins = ["chicken", "ground beef", "eggs", "tuna", "peanut butter", "beans", "turkey"];
  const veggies = ["broccoli", "carrots", "spinach", "frozen peas", "corn", "green beans"];
  const grains = ["white rice", "pasta", "whole grain bread", "potatoes", "oats"];
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  return [pick(proteins), pick(veggies), pick(grains)];
}
