// Your regular meal rotation. Edit this list any time — add, remove, or retag meals.
// moods: pick any that fit. Used by the mood filter on the home screen.
// difficulty: "easy" | "moderate" | "involved" — shown as a color dot.
// prepMinutes: rough total time, just for display.
// ingredients: feeds the grocery list — edit to match your actual recipe.
const MEALS = [
  {
    name: "Chicken Alfredo",
    moods: ["comfort", "cozy", "indulgent"],
    difficulty: "moderate",
    prepMinutes: 35,
    ingredients: ["Chicken breast", "Fettuccine", "Heavy cream", "Parmesan", "Butter", "Garlic"],
  },
  {
    name: "Chicken Parm",
    moods: ["comfort", "hearty", "indulgent"],
    difficulty: "involved",
    prepMinutes: 45,
    ingredients: ["Chicken breast", "Breadcrumbs", "Marinara sauce", "Mozzarella", "Parmesan", "Eggs", "Spaghetti"],
  },
  {
    name: "Chicken Fajitas",
    moods: ["fun", "spicy", "light"],
    difficulty: "easy",
    prepMinutes: 25,
    ingredients: ["Chicken breast", "Bell peppers", "Onion", "Fajita seasoning", "Tortillas", "Lime"],
  },
  {
    name: "Burgers",
    moods: ["quick", "casual", "indulgent"],
    difficulty: "easy",
    prepMinutes: 20,
    ingredients: ["Ground beef", "Hamburger buns", "Cheese", "Lettuce", "Tomato", "Onion"],
  },
  {
    name: "Chicken Sandwiches",
    moods: ["quick", "casual", "light"],
    difficulty: "easy",
    prepMinutes: 15,
    ingredients: ["Chicken breast", "Sandwich buns", "Lettuce", "Tomato", "Mayo", "Pickles"],
  },
  {
    name: "Marry Me Chicken Lasagna",
    moods: ["fancy", "comfort", "indulgent"],
    difficulty: "involved",
    prepMinutes: 60,
    ingredients: ["Chicken breast", "Lasagna noodles", "Sun-dried tomatoes", "Heavy cream", "Parmesan", "Garlic", "Spinach", "Ricotta"],
  },
  {
    name: "Smothered Chicken w/ Rice",
    moods: ["comfort", "hearty", "cozy"],
    difficulty: "moderate",
    prepMinutes: 40,
    ingredients: ["Chicken breast", "Rice", "Cream of chicken soup", "Onion", "Garlic", "Chicken broth"],
  },
  {
    name: "Chicken and Shrimp Bowls",
    moods: ["healthy", "light", "fresh"],
    difficulty: "easy",
    prepMinutes: 25,
    ingredients: ["Chicken breast", "Shrimp", "Rice", "Bell peppers", "Soy sauce", "Garlic", "Broccoli"],
  },
  {
    name: "Spaghetti",
    moods: ["comfort", "quick", "hearty"],
    difficulty: "easy",
    prepMinutes: 20,
    ingredients: ["Ground beef", "Spaghetti", "Marinara sauce", "Garlic", "Onion", "Parmesan"],
  },
  {
    name: "Baked Ziti",
    moods: ["comfort", "hearty", "indulgent"],
    difficulty: "moderate",
    prepMinutes: 45,
    ingredients: ["Ziti pasta", "Ground beef", "Marinara sauce", "Ricotta", "Mozzarella", "Parmesan"],
  },
  {
    name: "Grilled Salmon w/ Veggies",
    moods: ["healthy", "light", "fresh", "fancy"],
    difficulty: "easy",
    prepMinutes: 25,
    ingredients: ["Salmon fillets", "Broccoli", "Olive oil", "Lemon", "Garlic"],
  },
  {
    name: "Shrimp Scampi",
    moods: ["fancy", "light", "fresh"],
    difficulty: "easy",
    prepMinutes: 20,
    ingredients: ["Shrimp", "Linguine", "Butter", "Garlic", "White wine", "Lemon", "Parsley"],
  },
  {
    name: "Steak w/ Roasted Potatoes",
    moods: ["fancy", "hearty", "indulgent"],
    difficulty: "moderate",
    prepMinutes: 40,
    ingredients: ["Steak", "Potatoes", "Olive oil", "Rosemary", "Garlic"],
  },
  {
    name: "Chicken Caesar Salad",
    moods: ["healthy", "light", "fresh", "quick"],
    difficulty: "easy",
    prepMinutes: 15,
    ingredients: ["Chicken breast", "Romaine lettuce", "Caesar dressing", "Parmesan", "Croutons"],
  },
];

// Moods shown as filter chips, in display order.
const MOODS = [
  "comfort", "quick", "healthy", "fancy",
  "spicy", "hearty", "cozy", "light",
  "indulgent", "fresh", "casual", "fun",
];

// Difficulty display: color + label, keyed by MEALS[].difficulty.
const DIFFICULTY = {
  easy: { color: "#3fa34d", label: "Easy" },
  moderate: { color: "#e0a51e", label: "Moderate" },
  involved: { color: "#d64545", label: "Takes a while" },
};
