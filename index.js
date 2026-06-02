const SEARCH_API = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
const RANDOM_API = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const randomButton = document.getElementById('randomButton');
const cocktailList = document.getElementById('cocktailList');
const cocktailDetails = document.getElementById('cocktailDetails');
const statusEl = document.getElementById('status');
const toggleButton = document.getElementById('toggle');

/* ---------- Theme (persisted) ---------- */
const savedTheme = localStorage.getItem('ce-theme') || 'light';
applyTheme(savedTheme);

toggleButton.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('ce-theme', next);
});

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  toggleButton.textContent = theme === 'dark' ? '☀' : '☾';
}

/* ---------- Likes (persisted per drink) ---------- */
function getLikes(id) {
  return JSON.parse(localStorage.getItem('ce-likes') || '{}')[id] || 0;
}
function setLikes(id, value) {
  const all = JSON.parse(localStorage.getItem('ce-likes') || '{}');
  all[id] = value;
  localStorage.setItem('ce-likes', JSON.stringify(all));
}

/* ---------- Status helpers ---------- */
function showStatus(html) { statusEl.innerHTML = html; }
function clearStatus() { statusEl.innerHTML = ''; }

/* ---------- Fetching ---------- */
async function searchCocktails(term) {
  if (!term.trim()) { showStatus('Type a cocktail name to begin.'); return; }
  cocktailList.innerHTML = '';
  cocktailDetails.innerHTML = '';
  showStatus('<div class="spinner"></div>');
  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(term));
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    displayCocktails(data.drinks);
  } catch (err) {
    showStatus('Something went wrong. Check your connection and try again.');
  }
}

async function fetchRandom() {
  cocktailList.innerHTML = '';
  showStatus('<div class="spinner"></div>');
  try {
    const res = await fetch(RANDOM_API);
    const data = await res.json();
    displayCocktails(data.drinks);
    if (data.drinks) displayCocktailDetails(data.drinks[0]);
  } catch {
    showStatus('Could not fetch a random cocktail.');
  }
}

searchButton.addEventListener('click', () => searchCocktails(searchInput.value));
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchCocktails(searchInput.value); });
randomButton.addEventListener('click', fetchRandom);

/* ---------- Render list ---------- */
function displayCocktails(cocktails) {
  cocktailList.innerHTML = '';
  if (!cocktails) {
    showStatus('No cocktails found. Try another search.');
    return;
  }
  clearStatus();
  cocktails.forEach((cocktail, i) => {
    const item = document.createElement('div');
    item.className = 'cocktail-item';
    item.style.animationDelay = `${i * 50}ms`;
    item.innerHTML = `
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" loading="lazy">
      <span class="label">${cocktail.strDrink}</span>`;
    item.addEventListener('click', () => {
      document.querySelectorAll('.cocktail-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      displayCocktailDetails(cocktail);
    });
    cocktailList.appendChild(item);
  });
}

/* ---------- Render detail panel ---------- */
function displayCocktailDetails(cocktail) {
  const id = cocktail.idDrink;
  const isAlcoholic = (cocktail.strAlcoholic || '').toLowerCase() === 'alcoholic';

  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const name = cocktail['strIngredient' + i];
    if (!name) break;
    ingredients.push({ name, measure: (cocktail['strMeasure' + i] || '').trim() });
  }

  cocktailDetails.innerHTML = `
    <div class="detail-head">
      <div>
        <h2>${cocktail.strDrink}</h2>
        <div class="tags">
          ${cocktail.strCategory ? `<span class="tag">${cocktail.strCategory}</span>` : ''}
          ${cocktail.strAlcoholic ? `<span class="tag ${isAlcoholic ? 'alcoholic' : ''}">${cocktail.strAlcoholic}</span>` : ''}
          ${cocktail.strGlass ? `<span class="tag">${cocktail.strGlass}</span>` : ''}
        </div>
      </div>
      <button class="like-btn" id="likeBtn">♥ <span id="likeCount">${getLikes(id)}</span></button>
    </div>
    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
    <div class="section-title">Instructions</div>
    <p>${cocktail.strInstructions || 'No instructions available.'}</p>
    <div class="section-title">Ingredients</div>
    <ul>
      ${ingredients.map(ing => `
        <li><span>${ing.name}</span><span class="measure">${ing.measure || '—'}</span></li>`).join('')}
    </ul>`;

  const likeBtn = document.getElementById('likeBtn');
  const likeCount = document.getElementById('likeCount');
  if (getLikes(id) > 0) likeBtn.classList.add('liked');
  likeBtn.addEventListener('click', () => {
    const newCount = getLikes(id) + 1;
    setLikes(id, newCount);
    likeCount.textContent = newCount;
    likeBtn.classList.add('liked');
  });

  cocktailDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}