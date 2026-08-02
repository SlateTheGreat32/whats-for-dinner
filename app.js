const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STORAGE_KEY = "meal-planner-state-v2";

let activeMoods = new Set();
let favoritesOnly = false;
let currentPlan = []; // array of meal names, index = day
let favorites = new Set();
let ratings = {};   // name -> 1..5
let leftovers = []; // { id, name, servings, loggedAt }
let history = {};   // name -> times planned

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (Array.isArray(saved.moods)) activeMoods = new Set(saved.moods);
    if (Array.isArray(saved.plan) && saved.plan.length === 7) currentPlan = saved.plan;
    if (typeof saved.favoritesOnly === "boolean") favoritesOnly = saved.favoritesOnly;
    if (Array.isArray(saved.favorites)) favorites = new Set(saved.favorites);
    if (saved.ratings && typeof saved.ratings === "object") ratings = saved.ratings;
    if (Array.isArray(saved.leftovers)) leftovers = saved.leftovers;
    if (saved.history && typeof saved.history === "object") history = saved.history;
  } catch (e) { /* ignore corrupt state */ }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    moods: [...activeMoods],
    plan: currentPlan,
    favoritesOnly,
    favorites: [...favorites],
    ratings,
    leftovers,
    history,
  }));
}

function filteredMeals() {
  let pool = MEALS;
  if (activeMoods.size > 0) pool = pool.filter(m => m.moods.some(tag => activeMoods.has(tag)));
  if (favoritesOnly) pool = pool.filter(m => favorites.has(m.name));
  return pool;
}

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function recordHistory(name) {
  history[name] = (history[name] || 0) + 1;
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
    recordHistory(next.name);
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
  recordHistory(choice.name);
  saveState();
  renderPlan();
  renderStats();
}

function surpriseMe() {
  const pool = filteredMeals();
  if (pool.length === 0) return;
  const choice = pool[Math.floor(Math.random() * pool.length)];
  alert(`Tonight: ${choice.name}`);
}

function toggleFavorite(name) {
  if (favorites.has(name)) favorites.delete(name);
  else favorites.add(name);
  saveState();
  renderAllMeals();
  toggleEmptyState();
}

function setRating(name, stars) {
  ratings[name] = ratings[name] === stars ? 0 : stars;
  saveState();
  renderAllMeals();
}

function addLeftover(name, servings) {
  leftovers.push({ id: `${name}-${Math.random().toString(36).slice(2, 8)}`, name, servings, loggedAt: Date.now() });
  saveState();
  renderLeftovers();
}

function removeLeftover(id) {
  leftovers = leftovers.filter(l => l.id !== id);
  saveState();
  renderLeftovers();
}

function renderMoodChips() {
  const container = document.getElementById("mood-chips");
  container.innerHTML = "";

  const favChip = document.createElement("button");
  favChip.className = "chip fav-toggle" + (favoritesOnly ? " active" : "");
  favChip.innerHTML = `<span>❤ Favorites only</span>`;
  favChip.onclick = () => {
    favoritesOnly = !favoritesOnly;
    saveState();
    renderMoodChips();
    renderAllMeals();
    toggleEmptyState();
  };
  container.appendChild(favChip);

  MOODS.forEach(mood => {
    const chip = document.createElement("button");
    chip.className = "chip" + (activeMoods.has(mood) ? " active" : "");
    chip.innerHTML = `<span class="check">✓</span><span>${mood}</span>`;
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

function mealByName(name) {
  return MEALS.find(m => m.name === name);
}

function diffDot(meal) {
  const d = DIFFICULTY[meal.difficulty];
  if (!d) return "";
  return `<span class="diff-dot plan-dot" style="background:${d.color}" title="${d.label} · ${meal.prepMinutes} min"></span>`;
}

function renderPlan() {
  const list = document.getElementById("plan-list");
  list.innerHTML = "";
  currentPlan.forEach((name, i) => {
    const meal = mealByName(name);
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="day-badge">${DAYS[i]}</span>
      <span class="meal-name">${name}</span>
      ${meal ? diffDot(meal) : ""}
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
    if ((activeMoods.size > 0 || favoritesOnly) && !pool.has(meal.name)) li.className = "dimmed";
    const tags = meal.moods.map(m => `<span class="tag">${m}</span>`).join("");
    const d = DIFFICULTY[meal.difficulty];
    const rating = ratings[meal.name] || 0;
    const stars = [1, 2, 3, 4, 5].map(n =>
      `<button class="star${n <= rating ? " filled" : ""}" data-n="${n}">★</button>`
    ).join("");
    const isFav = favorites.has(meal.name);

    li.innerHTML = `
      <div class="meal-row-top">
        <span class="meal-name">${meal.name}</span>
        <button class="heart-btn" title="Favorite">${isFav ? "❤️" : "🤍"}</button>
      </div>
      <div class="meta-row">
        <span class="diff-dot" style="background:${d.color}"></span>
        <span>${d.label} · ${meal.prepMinutes} min</span>
      </div>
      <div class="tags">${tags}</div>
      <div class="stars" style="margin-top:8px;">${stars}</div>
    `;
    li.querySelector(".heart-btn").onclick = () => toggleFavorite(meal.name);
    li.querySelectorAll(".star").forEach(btn => {
      btn.onclick = () => setRating(meal.name, parseInt(btn.dataset.n, 10));
    });
    list.appendChild(li);
  });
}

function renderLeftoverSelect() {
  const select = document.getElementById("leftover-meal");
  select.innerHTML = MEALS.map(m => `<option value="${m.name}">${m.name}</option>`).join("");
}

function renderLeftovers() {
  const list = document.getElementById("leftovers-list");
  const empty = document.getElementById("no-leftovers");
  list.innerHTML = "";
  empty.style.display = leftovers.length === 0 ? "block" : "none";
  leftovers.forEach(l => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${l.name}</strong> — ${l.servings} serving${l.servings === 1 ? "" : "s"}</span>
      <button class="clear-btn">Eaten</button>
    `;
    li.querySelector(".clear-btn").onclick = () => removeLeftover(l.id);
    list.appendChild(li);
  });
}

function renderStats() {
  const container = document.getElementById("stats");
  const untriedContainer = document.getElementById("untried-chips");
  const entries = Object.entries(history).sort((a, b) => b[1] - a[1]);
  const max = entries.length ? entries[0][1] : 0;

  container.innerHTML = entries.length
    ? entries.map(([name, count]) => `
        <div class="stat-row">
          <div class="stat-label"><span>${name}</span><span class="stat-count">${count}×</span></div>
          <div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${max ? (count / max) * 100 : 0}%"></div></div>
        </div>
      `).join("")
    : `<p style="color:var(--muted); font-size:0.88rem; font-weight:600; margin:0;">Plan a few weeks to see stats here.</p>`;

  const untried = MEALS.filter(m => !history[m.name]);
  document.getElementById("untried").style.display = untried.length ? "block" : "none";
  untriedContainer.innerHTML = untried.map(m => `<span class="tag">${m.name}</span>`).join("");
}

function toggleEmptyState() {
  const empty = document.getElementById("empty-state");
  empty.style.display = filteredMeals().length === 0 ? "block" : "none";
}

document.getElementById("plan-btn").onclick = () => {
  pickWeek();
  saveState();
  renderPlan();
  renderStats();
};
document.getElementById("surprise-btn").onclick = surpriseMe;

document.getElementById("add-leftover-btn").onclick = () => {
  document.getElementById("leftover-form").classList.toggle("open");
};
document.getElementById("save-leftover-btn").onclick = () => {
  const name = document.getElementById("leftover-meal").value;
  const servings = Math.max(1, parseInt(document.getElementById("leftover-servings").value, 10) || 1);
  addLeftover(name, servings);
  document.getElementById("leftover-form").classList.remove("open");
};

loadState();
if (currentPlan.length !== 7) pickWeek();
renderMoodChips();
renderPlan();
renderLeftoverSelect();
renderLeftovers();
renderAllMeals();
renderStats();
toggleEmptyState();
saveState();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
