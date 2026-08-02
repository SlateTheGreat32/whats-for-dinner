// Your regular meal rotation. Edit this list any time — add, remove, or retag meals.
// moods: pick any that fit. Used by the mood filter on the home screen.
// difficulty: "easy" | "moderate" | "involved" — shown as a color dot.
// prepMinutes: rough total time, just for display.
const MEALS = [
  {
    name: "Chicken Alfredo",
    moods: ["comfort", "cozy", "indulgent"],
    difficulty: "moderate",
    prepMinutes: 35,
  },
  {
    name: "Chicken Parm",
    moods: ["comfort", "hearty", "indulgent"],
    difficulty: "involved",
    prepMinutes: 45,
  },
  {
    name: "Chicken Fajitas",
    moods: ["fun", "spicy", "light"],
    difficulty: "easy",
    prepMinutes: 25,
  },
  {
    name: "Burgers",
    moods: ["quick", "casual", "indulgent"],
    difficulty: "easy",
    prepMinutes: 20,
  },
  {
    name: "Chicken Sandwiches",
    moods: ["quick", "casual", "light"],
    difficulty: "easy",
    prepMinutes: 15,
  },
  {
    name: "Marry Me Chicken Lasagna",
    moods: ["fancy", "comfort", "indulgent"],
    difficulty: "involved",
    prepMinutes: 60,
  },
  {
    name: "Smothered Chicken w/ Rice",
    moods: ["comfort", "hearty", "cozy"],
    difficulty: "moderate",
    prepMinutes: 40,
  },
  {
    name: "Chicken and Shrimp Bowls",
    moods: ["healthy", "light", "fresh"],
    difficulty: "easy",
    prepMinutes: 25,
  },
  {
    name: "Spaghetti",
    moods: ["comfort", "quick", "hearty"],
    difficulty: "easy",
    prepMinutes: 20,
  },
  {
    name: "Baked Ziti",
    moods: ["comfort", "hearty", "indulgent"],
    difficulty: "moderate",
    prepMinutes: 45,
  },
  {
    name: "Grilled Salmon w/ Veggies",
    moods: ["healthy", "light", "fresh", "fancy"],
    difficulty: "easy",
    prepMinutes: 25,
  },
  {
    name: "Shrimp Scampi",
    moods: ["fancy", "light", "fresh"],
    difficulty: "easy",
    prepMinutes: 20,
  },
  {
    name: "Steak w/ Roasted Potatoes",
    moods: ["fancy", "hearty", "indulgent"],
    difficulty: "moderate",
    prepMinutes: 40,
  },
  {
    name: "Chicken Caesar Salad",
    moods: ["healthy", "light", "fresh", "quick"],
    difficulty: "easy",
    prepMinutes: 15,
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
