export type MealIdea = {
  name: string;
  cuisine: string;
  ingredients: string;
  approxCalories: number;
  type: "breakfast" | "lunch" | "dinner" | "snack";
};

export const breakfastMeals: MealIdea[] = [
  { name: "Scrambled Eggs on Toast", cuisine: "Classic", ingredients: "2 eggs, 1 slice whole grain toast, butter, salt, pepper", approxCalories: 280, type: "breakfast" },
  { name: "Oatmeal with Banana & Honey", cuisine: "Classic", ingredients: "½ cup oats, 1 banana, 1 tbsp honey, 1 cup milk", approxCalories: 310, type: "breakfast" },
  { name: "Greek Yogurt with Granola & Berries", cuisine: "Classic", ingredients: "1 cup Greek yogurt, ¼ cup granola, ½ cup mixed berries, 1 tsp honey", approxCalories: 290, type: "breakfast" },
  { name: "Peanut Butter Toast with Banana", cuisine: "Classic", ingredients: "2 slices whole grain bread, 2 tbsp peanut butter, 1 banana", approxCalories: 320, type: "breakfast" },
  { name: "Avocado Toast with Egg", cuisine: "Classic", ingredients: "1 slice sourdough, ½ avocado, 1 fried egg, red pepper flakes, salt", approxCalories: 350, type: "breakfast" },
  { name: "Egg & Cheese English Muffin", cuisine: "Classic", ingredients: "1 English muffin, 2 eggs, 1 slice cheddar, butter", approxCalories: 370, type: "breakfast" },
  { name: "Cottage Cheese with Fruit & Honey", cuisine: "Classic", ingredients: "1 cup cottage cheese, ½ cup pineapple chunks, 1 tsp honey", approxCalories: 240, type: "breakfast" },
  { name: "Pancakes with Maple Syrup", cuisine: "Classic", ingredients: "1 cup pancake mix, 1 egg, ¾ cup milk, 2 tbsp maple syrup, butter", approxCalories: 400, type: "breakfast" },
  { name: "Overnight Oats with Berries", cuisine: "Classic", ingredients: "½ cup oats, ½ cup milk, ½ cup berries, 1 tbsp chia seeds, 1 tbsp honey", approxCalories: 300, type: "breakfast" },
  { name: "Protein Smoothie", cuisine: "Classic", ingredients: "1 scoop whey protein, 1 banana, 1 cup milk, 1 tbsp peanut butter, handful of ice", approxCalories: 350, type: "breakfast" },
  { name: "Breakfast Burrito", cuisine: "Mexican", ingredients: "1 flour tortilla, 2 scrambled eggs, ¼ cup black beans, shredded cheese, salsa", approxCalories: 420, type: "breakfast" },
  { name: "Huevos Rancheros", cuisine: "Mexican", ingredients: "2 fried eggs, 2 corn tortillas, ½ cup salsa, ¼ cup black beans, cotija cheese", approxCalories: 430, type: "breakfast" },
  { name: "Chorizo & Egg Scramble", cuisine: "Mexican", ingredients: "2 oz chorizo, 2 eggs, ¼ cup onion, ¼ cup bell pepper, salt, 1 tortilla", approxCalories: 440, type: "breakfast" },
  { name: "Smoked Salmon Bagel", cuisine: "Deli", ingredients: "1 bagel, 2 oz smoked salmon, 2 tbsp cream cheese, red onion, capers, cucumber", approxCalories: 420, type: "breakfast" },
  { name: "Lox & Cream Cheese Toast", cuisine: "Deli", ingredients: "2 slices rye bread, 3 oz smoked salmon, 2 tbsp cream cheese, dill, lemon", approxCalories: 380, type: "breakfast" },
  { name: "Steel-Cut Oats with Protein Powder", cuisine: "Classic", ingredients: "½ cup steel-cut oats, 1 scoop protein powder, 1 tbsp almond butter, cinnamon, 1 cup water", approxCalories: 380, type: "breakfast" },
  { name: "Egg White Veggie Omelet", cuisine: "Classic", ingredients: "4 egg whites, ¼ cup spinach, ¼ cup mushrooms, ¼ cup bell pepper, 1 oz feta, olive oil", approxCalories: 200, type: "breakfast" },
  { name: "Açai Bowl", cuisine: "Brazilian", ingredients: "1 frozen açai packet, 1 banana, ½ cup almond milk, ¼ cup granola, 1 tbsp honey, berries", approxCalories: 380, type: "breakfast" },
  { name: "Shakshuka", cuisine: "Middle Eastern", ingredients: "2 eggs, ½ cup tomato sauce, ¼ cup onion, ½ tsp cumin, ½ tsp paprika, 1 pita bread", approxCalories: 360, type: "breakfast" },
  { name: "Turkey Bacon & Egg Wrap", cuisine: "Classic", ingredients: "1 flour tortilla, 2 eggs, 2 strips turkey bacon, 1 slice American cheese, hot sauce", approxCalories: 390, type: "breakfast" },
  { name: "High-Protein French Toast", cuisine: "Classic", ingredients: "2 slices thick bread, 2 eggs, ¼ cup milk, cinnamon, vanilla, 1 tbsp maple syrup", approxCalories: 340, type: "breakfast" },
  { name: "Miso Soup with Rice & Egg", cuisine: "Japanese", ingredients: "1 cup miso soup, ½ cup white rice, 1 soft-boiled egg, 1 tsp sesame oil", approxCalories: 280, type: "breakfast" },
  { name: "Congee with Egg & Green Onion", cuisine: "Asian", ingredients: "½ cup rice, 2 cups broth, 1 soft-boiled egg, 2 tbsp soy sauce, green onion, sesame oil", approxCalories: 300, type: "breakfast" },
  { name: "Cottage Cheese Pancakes", cuisine: "Classic", ingredients: "½ cup cottage cheese, 2 eggs, ¼ cup oats, cinnamon, 1 tsp honey, vanilla", approxCalories: 310, type: "breakfast" },
  { name: "Turkey Sausage & Egg Bowl", cuisine: "Classic", ingredients: "2 turkey sausage links, 2 eggs, ½ cup frozen hash browns, hot sauce", approxCalories: 420, type: "breakfast" },
  { name: "Whole Grain Waffles with Nut Butter", cuisine: "Classic", ingredients: "2 whole grain waffles, 2 tbsp almond butter, ½ banana, 1 tsp honey", approxCalories: 370, type: "breakfast" },
  { name: "Ricotta Toast with Berries", cuisine: "Italian", ingredients: "2 slices sourdough, ¼ cup ricotta, ½ cup blueberries, 1 tsp honey, lemon zest", approxCalories: 340, type: "breakfast" },
  { name: "Chia Pudding with Mango", cuisine: "Classic", ingredients: "3 tbsp chia seeds, 1 cup coconut milk, 1 mango sliced, 1 tsp honey", approxCalories: 320, type: "breakfast" },
  { name: "Protein Oatmeal with Peanut Butter", cuisine: "Classic", ingredients: "½ cup oats, 1 scoop vanilla protein powder, 1 tbsp peanut butter, banana, 1 cup water", approxCalories: 420, type: "breakfast" },
  { name: "Baked Egg in Avocado", cuisine: "Classic", ingredients: "1 avocado, 2 eggs, salt, pepper, paprika, chives", approxCalories: 310, type: "breakfast" },
];

export const lunchMeals: MealIdea[] = [
  { name: "Turkey & Cheese Sandwich", cuisine: "Classic", ingredients: "2 slices whole grain bread, 3 oz turkey, 1 slice cheddar, lettuce, tomato, mustard", approxCalories: 380, type: "lunch" },
  { name: "Tuna Salad Wrap", cuisine: "Classic", ingredients: "1 flour tortilla, 1 can tuna, 2 tbsp mayo, celery, pickle relish, lettuce", approxCalories: 390, type: "lunch" },
  { name: "Grilled Chicken Caesar Wrap", cuisine: "Classic", ingredients: "1 flour tortilla, 3 oz grilled chicken, romaine, parmesan, 2 tbsp Caesar dressing, croutons", approxCalories: 440, type: "lunch" },
  { name: "Bean & Rice Bowl", cuisine: "Mexican", ingredients: "1 cup brown rice, 1 cup black beans, ¼ cup salsa, 2 tbsp shredded cheese, sour cream", approxCalories: 420, type: "lunch" },
  { name: "Chipotle-Style Burrito Bowl", cuisine: "Mexican", ingredients: "1 cup rice, 4 oz seasoned chicken, ½ cup black beans, ¼ cup corn, salsa, guacamole, sour cream", approxCalories: 580, type: "lunch" },
  { name: "Ground Beef Taco Salad", cuisine: "Mexican", ingredients: "4 oz ground beef, taco seasoning, 2 cups romaine, ¼ cup salsa, 2 tbsp sour cream, shredded cheese, tortilla chips", approxCalories: 520, type: "lunch" },
  { name: "Chicken Teriyaki Rice Bowl", cuisine: "Japanese", ingredients: "4 oz chicken breast, 1 cup white rice, 2 tbsp teriyaki sauce, steamed broccoli, sesame seeds", approxCalories: 490, type: "lunch" },
  { name: "Spicy Tuna Rice Bowl", cuisine: "Japanese", ingredients: "1 can tuna, 1 cup white rice, 1 tbsp sriracha mayo, cucumber, avocado, soy sauce, sesame seeds", approxCalories: 460, type: "lunch" },
  { name: "Poke Bowl", cuisine: "Hawaiian", ingredients: "4 oz canned tuna or salmon, 1 cup rice, edamame, cucumber, soy sauce, sesame oil, green onion", approxCalories: 450, type: "lunch" },
  { name: "Greek Salad with Chicken", cuisine: "Mediterranean", ingredients: "3 oz grilled chicken, 2 cups romaine, cucumber, cherry tomatoes, olives, feta, 2 tbsp Greek dressing", approxCalories: 380, type: "lunch" },
  { name: "Falafel Wrap", cuisine: "Middle Eastern", ingredients: "1 pita, 4 falafel balls, hummus, cucumber, tomato, tahini sauce, lettuce", approxCalories: 440, type: "lunch" },
  { name: "Chicken Shawarma Plate", cuisine: "Middle Eastern", ingredients: "4 oz marinated chicken, 1 pita, hummus, lettuce, tomato, cucumber, tzatziki", approxCalories: 500, type: "lunch" },
  { name: "Beef & Veggie Stir-Fry Rice Bowl", cuisine: "Asian", ingredients: "4 oz ground beef, 1 cup rice, frozen stir-fry vegetables, 2 tbsp soy sauce, garlic, ginger", approxCalories: 510, type: "lunch" },
  { name: "Thai Peanut Noodle Bowl", cuisine: "Thai", ingredients: "2 oz rice noodles, 3 oz chicken, 2 tbsp peanut butter, soy sauce, lime juice, sriracha, cucumber", approxCalories: 480, type: "lunch" },
  { name: "Egg Fried Rice", cuisine: "Asian", ingredients: "1 cup cooked rice, 2 eggs, ½ cup frozen peas and carrots, soy sauce, garlic, sesame oil, green onion", approxCalories: 400, type: "lunch" },
  { name: "Chicken Gyro Wrap", cuisine: "Greek", ingredients: "1 pita, 3 oz grilled chicken, tzatziki, tomato, red onion, cucumber, feta", approxCalories: 460, type: "lunch" },
  { name: "Italian Sub", cuisine: "Italian", ingredients: "1 hoagie roll, 2 oz ham, 2 oz salami, 1 slice provolone, lettuce, tomato, oil and vinegar", approxCalories: 520, type: "lunch" },
  { name: "Caprese Sandwich", cuisine: "Italian", ingredients: "1 ciabatta roll, fresh mozzarella, tomato, basil, balsamic glaze, olive oil", approxCalories: 420, type: "lunch" },
  { name: "Salmon & Avocado Rice Bowl", cuisine: "Classic", ingredients: "4 oz canned salmon, 1 cup rice, ½ avocado, cucumber, lemon juice, soy sauce", approxCalories: 470, type: "lunch" },
  { name: "Lentil & Feta Salad", cuisine: "Mediterranean", ingredients: "1 cup cooked lentils, feta cheese, cucumber, tomato, red onion, olive oil, lemon juice", approxCalories: 380, type: "lunch" },
  { name: "BBQ Chicken Quesadilla", cuisine: "American", ingredients: "2 flour tortillas, 1 cup shredded chicken, 2 tbsp BBQ sauce, ½ cup cheddar, sour cream", approxCalories: 520, type: "lunch" },
  { name: "Chicken & Sweet Potato Bowl", cuisine: "Classic", ingredients: "4 oz grilled chicken, 1 medium sweet potato, 1 cup spinach, 1 tbsp olive oil, paprika", approxCalories: 450, type: "lunch" },
  { name: "Ramen with Soft-Boiled Egg", cuisine: "Japanese", ingredients: "1 pack ramen noodles, 2 soft-boiled eggs, 1 cup spinach, 2 tbsp soy sauce, sesame oil, green onion", approxCalories: 430, type: "lunch" },
  { name: "Steak & Veggie Bowl", cuisine: "American", ingredients: "4 oz sirloin steak, 1 cup rice, roasted bell peppers, onion, 1 tbsp chimichurri", approxCalories: 530, type: "lunch" },
  { name: "Pulled Pork Sandwich", cuisine: "BBQ", ingredients: "3 oz pulled pork, 1 brioche bun, 2 tbsp BBQ sauce, coleslaw", approxCalories: 510, type: "lunch" },
  { name: "Shrimp & Rice Bowl", cuisine: "Classic", ingredients: "4 oz shrimp, 1 cup white rice, ½ cup edamame, 2 tbsp soy sauce, sriracha, garlic", approxCalories: 430, type: "lunch" },
  { name: "Veggie & Hummus Power Bowl", cuisine: "Mediterranean", ingredients: "½ cup hummus, 1 cup quinoa, roasted red pepper, cucumber, tomato, olives, feta", approxCalories: 430, type: "lunch" },
  { name: "Cottage Cheese & Turkey Bowl", cuisine: "Classic", ingredients: "1 cup cottage cheese, 3 oz deli turkey, cherry tomatoes, cucumber, 5 crackers", approxCalories: 350, type: "lunch" },
  { name: "Black Bean Burger", cuisine: "American", ingredients: "1 black bean patty, 1 whole grain bun, lettuce, tomato, avocado, sriracha mayo", approxCalories: 450, type: "lunch" },
  { name: "Cold Sesame Noodles", cuisine: "Asian", ingredients: "2 oz soba noodles, 2 tbsp peanut butter, soy sauce, sesame oil, cucumber, green onion", approxCalories: 400, type: "lunch" },
];

export const dinnerMeals: MealIdea[] = [
  { name: "Baked Chicken with Rice & Broccoli", cuisine: "Classic", ingredients: "6 oz chicken breast, 1 cup white rice, 2 cups broccoli, olive oil, garlic, salt", approxCalories: 480, type: "dinner" },
  { name: "Beef Tacos", cuisine: "Mexican", ingredients: "½ lb ground beef, 6 corn tortillas, taco seasoning, shredded cheese, lettuce, tomato, sour cream", approxCalories: 520, type: "dinner" },
  { name: "Chicken Enchiladas", cuisine: "Mexican", ingredients: "2 flour tortillas, 1 cup shredded chicken, ½ cup enchilada sauce, ½ cup cheese, sour cream", approxCalories: 540, type: "dinner" },
  { name: "Carne Asada Bowl", cuisine: "Mexican", ingredients: "6 oz flank steak, 1 cup rice, ½ cup black beans, pico de gallo, avocado, lime", approxCalories: 570, type: "dinner" },
  { name: "Chicken Stir-Fry with Rice", cuisine: "Asian", ingredients: "6 oz chicken breast, 2 cups frozen stir-fry vegetables, 1 cup rice, 3 tbsp soy sauce, garlic, ginger", approxCalories: 490, type: "dinner" },
  { name: "Beef & Broccoli Stir-Fry", cuisine: "Chinese", ingredients: "6 oz beef sirloin, 2 cups broccoli, 1 cup rice, 3 tbsp oyster sauce, soy sauce, garlic, ginger", approxCalories: 510, type: "dinner" },
  { name: "Teriyaki Salmon with Rice", cuisine: "Japanese", ingredients: "6 oz salmon fillet, 1 cup white rice, 2 tbsp teriyaki sauce, steamed bok choy, sesame seeds", approxCalories: 520, type: "dinner" },
  { name: "Sesame Chicken with Noodles", cuisine: "Asian", ingredients: "6 oz chicken breast, 2 oz lo mein noodles, 2 tbsp sesame sauce, broccoli, soy sauce, green onion", approxCalories: 500, type: "dinner" },
  { name: "Korean BBQ Ground Beef Bowl", cuisine: "Korean", ingredients: "6 oz ground beef, 1 cup rice, 2 tbsp soy sauce, 1 tbsp sesame oil, garlic, ginger, green onion", approxCalories: 530, type: "dinner" },
  { name: "Chicken Tikka Masala with Rice", cuisine: "Indian", ingredients: "6 oz chicken, 1 cup basmati rice, ½ cup tikka masala sauce (jarred), ¼ cup Greek yogurt, cilantro", approxCalories: 560, type: "dinner" },
  { name: "Butter Chicken with Naan", cuisine: "Indian", ingredients: "6 oz chicken breast, ½ cup butter chicken sauce, ¼ cup heavy cream, 1 naan bread, basmati rice", approxCalories: 590, type: "dinner" },
  { name: "Lamb Chops with Couscous", cuisine: "Mediterranean", ingredients: "2 lamb chops, ½ cup couscous, roasted cherry tomatoes, garlic, rosemary, olive oil", approxCalories: 560, type: "dinner" },
  { name: "Greek Chicken with Tzatziki & Pita", cuisine: "Mediterranean", ingredients: "6 oz chicken thighs, lemon, garlic, oregano, 1 pita, 3 tbsp tzatziki, cucumber, tomato", approxCalories: 500, type: "dinner" },
  { name: "Spaghetti Bolognese", cuisine: "Italian", ingredients: "2 oz spaghetti, 4 oz ground beef, ½ cup marinara, garlic, onion, parmesan, basil", approxCalories: 520, type: "dinner" },
  { name: "Chicken Parmesan", cuisine: "Italian", ingredients: "6 oz chicken breast, ½ cup marinara, ¼ cup mozzarella, breadcrumbs, parmesan, 1 cup pasta", approxCalories: 580, type: "dinner" },
  { name: "Shrimp Scampi with Pasta", cuisine: "Italian", ingredients: "6 oz shrimp, 2 oz linguine, 2 tbsp butter, garlic, white wine, lemon juice, parsley, parmesan", approxCalories: 510, type: "dinner" },
  { name: "Baked Salmon with Asparagus", cuisine: "Classic", ingredients: "6 oz salmon, 8 asparagus spears, 1 tbsp olive oil, lemon, garlic, dill, 1 cup rice", approxCalories: 480, type: "dinner" },
  { name: "Pork Tenderloin with Sweet Potato", cuisine: "Classic", ingredients: "6 oz pork tenderloin, 1 large sweet potato, olive oil, garlic, rosemary, salt", approxCalories: 470, type: "dinner" },
  { name: "Chili with Cornbread", cuisine: "American", ingredients: "½ lb ground beef, 1 can kidney beans, 1 can diced tomatoes, chili seasoning, 1 boxed cornbread muffin", approxCalories: 550, type: "dinner" },
  { name: "BBQ Chicken with Roasted Veggies", cuisine: "BBQ", ingredients: "6 oz chicken thighs, 2 tbsp BBQ sauce, 1 zucchini, 1 bell pepper, olive oil, garlic powder", approxCalories: 450, type: "dinner" },
  { name: "Pulled Chicken Tacos", cuisine: "Mexican", ingredients: "6 oz pulled chicken (slow cooker), 4 corn tortillas, cabbage slaw, avocado, lime, hot sauce", approxCalories: 500, type: "dinner" },
  { name: "Simple Steak with Mashed Potatoes", cuisine: "Classic", ingredients: "6 oz sirloin steak, 2 potatoes, 2 tbsp butter, garlic, salt, pepper", approxCalories: 550, type: "dinner" },
  { name: "Shrimp Tacos with Slaw", cuisine: "Mexican", ingredients: "6 oz shrimp, 4 corn tortillas, cabbage slaw, sriracha mayo, lime, cilantro, avocado", approxCalories: 480, type: "dinner" },
  { name: "Thai Green Curry with Rice", cuisine: "Thai", ingredients: "6 oz chicken, ½ cup coconut milk, 2 tbsp green curry paste, zucchini, bell pepper, 1 cup rice", approxCalories: 540, type: "dinner" },
  { name: "Ground Turkey & Veggie Bowl", cuisine: "Classic", ingredients: "6 oz ground turkey, 1 cup rice, zucchini, bell pepper, garlic, Italian seasoning, olive oil", approxCalories: 470, type: "dinner" },
  { name: "Sheet Pan Salmon & Veggies", cuisine: "Classic", ingredients: "6 oz salmon, 1 cup broccoli, 1 bell pepper, 1 tbsp olive oil, lemon, garlic powder, paprika", approxCalories: 430, type: "dinner" },
  { name: "Beef Burrito", cuisine: "Mexican", ingredients: "1 large flour tortilla, ½ lb ground beef, ½ cup rice, black beans, cheese, salsa, sour cream", approxCalories: 600, type: "dinner" },
  { name: "Lemon Herb Chicken with Quinoa", cuisine: "Mediterranean", ingredients: "6 oz chicken breast, ½ cup quinoa, lemon, garlic, olive oil, fresh parsley, roasted cherry tomatoes", approxCalories: 460, type: "dinner" },
  { name: "Tuna Poke Bowl", cuisine: "Hawaiian", ingredients: "5 oz tuna, 1 cup sushi rice, edamame, avocado, cucumber, soy sauce, sesame oil, sesame seeds", approxCalories: 490, type: "dinner" },
  { name: "Ground Beef & Rice Stuffed Peppers", cuisine: "Classic", ingredients: "2 bell peppers, ½ lb ground beef, ½ cup rice, ½ cup tomato sauce, shredded cheese, garlic", approxCalories: 530, type: "dinner" },
];

export const snackMeals: MealIdea[] = [
  { name: "Apple with Peanut Butter", cuisine: "Classic", ingredients: "1 apple, 2 tbsp peanut butter", approxCalories: 200, type: "snack" },
  { name: "Cheese & Crackers", cuisine: "Classic", ingredients: "1 oz cheddar, 10 crackers", approxCalories: 180, type: "snack" },
  { name: "Greek Yogurt with Honey", cuisine: "Classic", ingredients: "1 cup Greek yogurt, 1 tsp honey, sprinkle of granola", approxCalories: 160, type: "snack" },
  { name: "Carrots & Hummus", cuisine: "Mediterranean", ingredients: "1 cup baby carrots, 3 tbsp hummus", approxCalories: 120, type: "snack" },
  { name: "Hard-Boiled Eggs & Hot Sauce", cuisine: "Classic", ingredients: "2 hard-boiled eggs, hot sauce, salt, pepper", approxCalories: 140, type: "snack" },
  { name: "Cottage Cheese with Pineapple", cuisine: "Classic", ingredients: "½ cup cottage cheese, ½ cup pineapple chunks, 1 tsp honey", approxCalories: 150, type: "snack" },
  { name: "Rice Cakes with Almond Butter", cuisine: "Classic", ingredients: "2 rice cakes, 2 tbsp almond butter, sprinkle of cinnamon", approxCalories: 200, type: "snack" },
  { name: "Protein Shake", cuisine: "Classic", ingredients: "1 scoop whey protein, 1 cup milk or water, ½ banana, handful of ice", approxCalories: 220, type: "snack" },
  { name: "Edamame with Sea Salt", cuisine: "Japanese", ingredients: "1 cup edamame in shell, sea salt", approxCalories: 150, type: "snack" },
  { name: "Beef Jerky & String Cheese", cuisine: "Classic", ingredients: "1 oz beef jerky, 1 string cheese", approxCalories: 160, type: "snack" },
  { name: "Banana with Peanut Butter", cuisine: "Classic", ingredients: "1 banana, 1 tbsp peanut butter", approxCalories: 190, type: "snack" },
  { name: "Trail Mix", cuisine: "Classic", ingredients: "¼ cup mixed nuts, 2 tbsp dried cranberries, 1 tbsp dark chocolate chips", approxCalories: 210, type: "snack" },
  { name: "Tuna on Crackers", cuisine: "Classic", ingredients: "1 can tuna, 10 crackers, mustard or mayo", approxCalories: 200, type: "snack" },
  { name: "Celery with Peanut Butter", cuisine: "Classic", ingredients: "3 stalks celery, 2 tbsp peanut butter", approxCalories: 150, type: "snack" },
  { name: "Mixed Nuts", cuisine: "Classic", ingredients: "¼ cup mixed almonds, cashews, and walnuts", approxCalories: 180, type: "snack" },
  { name: "Protein Bar", cuisine: "Classic", ingredients: "1 high-protein bar (e.g., Quest, RXBar, Kind Protein)", approxCalories: 200, type: "snack" },
  { name: "Cucumber with Tzatziki", cuisine: "Mediterranean", ingredients: "1 cup sliced cucumber, 4 tbsp tzatziki", approxCalories: 100, type: "snack" },
  { name: "Turkey Roll-Ups", cuisine: "Classic", ingredients: "4 slices deli turkey, 1 slice provolone, 1 tbsp mustard, roll each slice", approxCalories: 160, type: "snack" },
  { name: "Chocolate Milk", cuisine: "Classic", ingredients: "1 cup low-fat chocolate milk (fast post-workout option)", approxCalories: 180, type: "snack" },
  { name: "Oat Energy Balls", cuisine: "Classic", ingredients: "½ cup rolled oats, 2 tbsp peanut butter, 1 tbsp honey, 1 tbsp chocolate chips", approxCalories: 230, type: "snack" },
  { name: "Avocado Toast Bites", cuisine: "Classic", ingredients: "½ avocado, 4 rice cakes, salt, pepper, red pepper flakes", approxCalories: 210, type: "snack" },
  { name: "Smoothie with Spinach & Protein", cuisine: "Classic", ingredients: "1 scoop protein powder, 1 cup spinach, 1 banana, ½ cup almond milk, ice", approxCalories: 260, type: "snack" },
];

const CUISINE_THEMES = [
  { label: "Mexican-Inspired", cuisines: ["Mexican", "Mexican", "BBQ", "Classic"] },
  { label: "Asian-Fusion", cuisines: ["Japanese", "Chinese", "Korean", "Asian", "Thai"] },
  { label: "Mediterranean", cuisines: ["Mediterranean", "Greek", "Middle Eastern", "Italian"] },
  { label: "American BBQ & Comfort", cuisines: ["BBQ", "American", "Classic"] },
  { label: "Italian & European", cuisines: ["Italian", "Mediterranean", "Classic"] },
  { label: "High-Protein Classic", cuisines: ["Classic", "Classic", "Classic", "Deli"] },
  { label: "World Flavors", cuisines: ["Indian", "Thai", "Korean", "Hawaiian"] },
  { label: "Clean & Simple", cuisines: ["Classic", "Mediterranean", "Classic"] },
  { label: "Tropical & Fresh", cuisines: ["Hawaiian", "Brazilian", "Classic", "Asian"] },
  { label: "Bulk Season", cuisines: ["Classic", "American", "Italian", "BBQ"] },
];

export function getRandomTheme(): typeof CUISINE_THEMES[0] {
  return CUISINE_THEMES[Math.floor(Math.random() * CUISINE_THEMES.length)];
}

export function getRandomMealSample(
  type: "breakfast" | "lunch" | "dinner" | "snack",
  count: number,
  preferredCuisines?: string[]
): MealIdea[] {
  const pools: Record<string, MealIdea[]> = {
    breakfast: breakfastMeals,
    lunch: lunchMeals,
    dinner: dinnerMeals,
    snack: snackMeals,
  };
  const pool = pools[type] ?? breakfastMeals;

  let preferred: MealIdea[] = [];
  let others: MealIdea[] = [];

  if (preferredCuisines && preferredCuisines.length > 0) {
    preferred = pool.filter((m) => preferredCuisines.includes(m.cuisine));
    others = pool.filter((m) => !preferredCuisines.includes(m.cuisine));
  } else {
    others = pool;
  }

  const shuffledPref = [...preferred].sort(() => Math.random() - 0.5);
  const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
  const combined = [...shuffledPref, ...shuffledOthers];
  return combined.slice(0, Math.min(count, combined.length));
}

export function getRandomCuisines(count: number): string[] {
  const cuisines = ["Classic American", "Mexican", "Asian Fusion", "Mediterranean", "Italian", "BBQ", "Japanese", "Korean", "Indian", "Thai", "Greek", "Hawaiian"];
  return [...cuisines].sort(() => Math.random() - 0.5).slice(0, count);
}

export function getRandomIngredients(): [string, string, string] {
  const proteins = ["chicken breast", "ground beef", "salmon", "tuna", "shrimp", "ground turkey", "eggs", "pork tenderloin", "steak", "cottage cheese", "Greek yogurt", "tofu", "canned chickpeas", "turkey", "lamb"];
  const veggies = ["broccoli", "spinach", "bell peppers", "zucchini", "sweet potato", "asparagus", "bok choy", "green beans", "cauliflower", "kale", "edamame", "Brussels sprouts", "cherry tomatoes"];
  const grains = ["white rice", "brown rice", "pasta", "whole grain bread", "quinoa", "sweet potato", "potatoes", "oats", "couscous", "rice noodles", "soba noodles", "pita bread", "tortillas"];
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  return [pick(proteins), pick(veggies), pick(grains)];
}
