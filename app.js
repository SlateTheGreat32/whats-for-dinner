const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STORAGE_KEY = "meal-planner-state-v1";

let activeMoods = new Set();
let currentPlan = []; // array of meal names, index = day

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (Array.isArray(saved.moods)) activeMoods = new Set(saved.moods);
    if (Array.isArray(saved.plan) && saved.plan.length === 7) currentPlan = saved.plan;
  } catch (e) { /* ignore corrupt state */ }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    moods: [...activeMoods],
    plan: currentPlan,
  }));
}

function filteredMeals() {
  if (activeMoods.size === 0) return MEALS;
  return MEALS.filter(m => m.moods.some(tag => activeMoods.has(tag)));
}

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWeek() {
  const pool = filteredMeals();
  if (pool.length === 0) { currentPlan = []; return; }
  const plan = [];
  let bag = shuffled(pool);
  for (let day = 0; day < 7; day++) {
    if (bag.length === 0) bag = shuffled(pool);
    let next = bag.pop();
    // avoid repeating the previous day's meal when alternatives exist
    if (plan.length && next.name === plan[plan.length - 1] && bag.length) {
      const swap = bag.pop();
      bag.push(next);
      next = swap;
    }
    plan.push(next.name);
  }
  currentPlan = plan;
}

function rerollDay(index) {
  const pool = filteredMeals();
  if (pool.length === 0) return;
  const current = currentPlan[index];
  const options = pool.filter(m => m.name !== current);
  const choice = (options.length ? options : pool)[Math.floor(Math.random() * (options.length ? options.length : pool.length))];
  currentPlan[index] = choice.name;
  saveState();
  renderPlan();
}

function surpriseMe() {
  const pool = filteredMeals();
  if (pool.length === 0) return;
  const choice = pool[Math.floor(Math.random() * pool.length)];
  alert(`Tonight: ${choice.name}`);
}

function renderMoodChips() {
  const container = document.getElementById("mood-chips");
  container.innerHTML = "";
  MOODS.forEach(mood => {
    const chip = document.createElement("button");
    chip.className = "chip" + (activeMoods.has(mood) ? " active" : "");
    chip.textContent = mood;
    chip.onclick = () => {
      if (activeMoods.has(mood)) activeMoods.delete(mood);
      else activeMoods.add(mood);
      saveState();
      renderMoodChips();
      renderAllMeals();
      toggleEmptyState();
    };
    container.appendChild(chip);
  });
}

function renderPlan() {
  const list = document.getElementById("plan-list");
  list.innerHTML = "";
  currentPlan.forEach((name, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="day-label">${DAYS[i]}</span>
      <span class="meal-name">${name}</span>
      <button class="reroll" title="Swap this meal">🔄</button>
    `;
    li.querySelector(".reroll").onclick = () => rerollDay(i);
    list.appendChild(li);
  });
}

function renderAllMeals() {
  const list = document.getElementById("all-meals");
  list.innerHTML = "";
  const pool = new Set(filteredMeals().map(m => m.name));
  MEALS.forEach(meal => {
    const li = document.createElement("li");
    if (activeMoods.size > 0 && !pool.has(meal.name)) li.className = "dimmed";
    li.innerHTML = `
      <span class="meal-name">${meal.name}</span>
      <span class="tags">${meal.moods.join(" · ")}</span>
    `;
    list.appendChild(li);
  });
}

function toggleEmptyState() {
  const empty = document.getElementById("empty-state");
  empty.style.display = filteredMeals().length === 0 ? "block" : "none";
}

document.getElementById("plan-btn").onclick = () => {
  pickWeek();
  saveState();
  renderPlan();
};
document.getElementById("surprise-btn").onclick = surpriseMe;

loadState();
if (currentPlan.length !== 7) pickWeek();
renderMoodChips();
renderPlan();
renderAllMeals();
toggleEmptyState();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
