// Tools data (static, no admin editing)
const toolsData = [
  { id: 1, name: "Jenkins", logoIcon: "fab fa-jenkins", category: "CI/CD", shortDesc: "Open-source automation server for CI/CD pipelines.", fullDesc: "Jenkins is the leading open-source automation server that provides hundreds of plugins to support building, deploying, and automating any project.", websiteUrl: "https://jenkins.io" },
  { id: 2, name: "Docker", logoIcon: "fab fa-docker", category: "Containerization", shortDesc: "Platform for developing, shipping, and running containers.", fullDesc: "Docker revolutionizes software delivery by packaging applications into containers, ensuring consistency across environments.", websiteUrl: "https://docker.com" },
  { id: 3, name: "Kubernetes", logoIcon: "fas fa-cubes", category: "Containerization", shortDesc: "Container orchestration for automated deployment & scaling.", fullDesc: "Kubernetes automates containerized application deployment, scaling, and management.", websiteUrl: "https://kubernetes.io" },
  { id: 4, name: "GitHub", logoIcon: "fab fa-github", category: "Version Control", shortDesc: "Code hosting platform with version control & collaboration.", fullDesc: "GitHub is the world's leading AI-powered developer platform for building software with Git.", websiteUrl: "https://github.com" },
  { id: 5, name: "GitLab", logoIcon: "fab fa-gitlab", category: "Version Control", shortDesc: "DevOps platform with built-in CI/CD and version control.", fullDesc: "GitLab provides a single application for the entire DevOps lifecycle, from planning to monitoring.", websiteUrl: "https://gitlab.com" },
  { id: 6, name: "Jira", logoIcon: "fab fa-jira", category: "Agile Tools", shortDesc: "Agile project management for software teams.", fullDesc: "Jira by Atlassian is the #1 agile tool for planning, tracking, and releasing great software.", websiteUrl: "https://atlassian.com/software/jira" },
  { id: 7, name: "AWS", logoIcon: "fab fa-aws", category: "Cloud", shortDesc: "Comprehensive cloud computing platform.", fullDesc: "Amazon Web Services offers reliable, scalable, and cost-effective cloud infrastructure services.", websiteUrl: "https://aws.amazon.com" },
  { id: 8, name: "Prometheus", logoIcon: "fas fa-chart-line", category: "Monitoring", shortDesc: "Open-source monitoring & alerting toolkit.", fullDesc: "Prometheus is a powerful time-series database and monitoring system for observability.", websiteUrl: "https://prometheus.io" },
  { id: 9, name: "Terraform", logoIcon: "fas fa-cloud-upload-alt", category: "Cloud", shortDesc: "Infrastructure as Code (IaC) tool.", fullDesc: "Terraform by HashiCorp lets you define and provision cloud infrastructure declaratively.", websiteUrl: "https://terraform.io" },
  { id: 10, name: "Ansible", logoIcon: "fas fa-cogs", category: "CI/CD", shortDesc: "IT automation and configuration management.", fullDesc: "Ansible is a simple but powerful automation engine for configuration management and deployment.", websiteUrl: "https://ansible.com" },
  { id: 11, name: "Trello", logoIcon: "fab fa-trello", category: "Agile Tools", shortDesc: "Visual collaboration and task management.", fullDesc: "Trello uses boards, lists, and cards to help teams organize projects in an agile-friendly way.", websiteUrl: "https://trello.com" },
  { id: 12, name: "CircleCI", logoIcon: "fas fa-sync-alt", category: "CI/CD", shortDesc: "Continuous integration & delivery platform.", fullDesc: "CircleCI automates builds, tests, and deployments with high performance.", websiteUrl: "https://circleci.com" }
];

// Global state
let currentCategory = "All";
let searchQuery = "";
let showFavoritesOnly = false;
let favorites = new Set();
let lastFilterState = { category: "All", search: "", favoritesOnly: false };
let currentDetailId = null;

// DOM elements
const listView = document.getElementById('listView');
const detailView = document.getElementById('detailView');
const toolsGrid = document.getElementById('toolsGrid');
const categoryContainer = document.getElementById('categoryFiltersContainer');
const searchInput = document.getElementById('searchInput');
const resultCountSpan = document.getElementById('resultCount');
const noResultsDiv = document.getElementById('noResultsMsg');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const homeNavBtn = document.getElementById('homeNavBtn');
const favoritesNavBtn = document.getElementById('favoritesNavBtn');
const backToListBtn = document.getElementById('backToListBtn');
const darkToggle = document.getElementById('darkModeToggle');

// Favorites storage
function loadFavorites() {
  const stored = localStorage.getItem('devops_favorites');
  if (stored) { try { favorites = new Set(JSON.parse(stored)); } catch(e) {} }
}
function saveFavorites() { localStorage.setItem('devops_favorites', JSON.stringify(Array.from(favorites))); }

function toggleFavorite(toolId, event) {
  if (event) event.stopPropagation();
  favorites.has(toolId) ? favorites.delete(toolId) : favorites.add(toolId);
  saveFavorites();
  if (detailView.classList.contains('hidden')) renderToolsList();
  else if (currentDetailId) renderDetailView(currentDetailId);
}

function getFilteredTools() {
  let filtered = [...toolsData];
  if (currentCategory !== "All") filtered = filtered.filter(t => t.category === currentCategory);
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(t => t.name.toLowerCase().includes(q));
  }
  if (showFavoritesOnly) filtered = filtered.filter(t => favorites.has(t.id));
  return filtered;
}

function updateCountAndEmptyState(filtered) {
  resultCountSpan.innerText = filtered.length;
  if (filtered.length === 0) { noResultsDiv.classList.remove('hidden'); toolsGrid.classList.add('hidden'); }
  else { noResultsDiv.classList.add('hidden'); toolsGrid.classList.remove('hidden'); }
}

function renderToolsList() {
  const filtered = getFilteredTools();
  updateCountAndEmptyState(filtered);
  if (filtered.length === 0) { toolsGrid.innerHTML = ''; return; }
  toolsGrid.innerHTML = filtered.map(tool => `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden card-hover">
      <div class="p-5">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3"><i class="${tool.logoIcon} text-3xl text-blue-600 dark:text-blue-400"></i><h3 class="text-xl font-bold">${tool.name}</h3></div>
          <button class="favorite-btn text-2xl focus:outline-none" data-id="${tool.id}"><i class="${favorites.has(tool.id) ? 'fas fa-heart heart-active' : 'far fa-heart heart-inactive'}"></i></button>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-sm mt-3">${tool.shortDesc}</p>
        <div class="mt-4 flex flex-wrap gap-2 justify-between items-center">
          <span class="text-xs font-medium bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">${tool.category}</span>
          <div class="flex gap-2">
            <button class="details-btn text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition" data-id="${tool.id}"><i class="fas fa-info-circle mr-1"></i>Details</button>
            <a href="${tool.websiteUrl}" target="_blank" rel="noopener" class="text-sm bg-gray-800 dark:bg-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 transition inline-flex items-center gap-1"><i class="fas fa-external-link-alt"></i> Open</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  document.querySelectorAll('.favorite-btn').forEach(btn => btn.addEventListener('click', (e) => toggleFavorite(parseInt(btn.dataset.id), e)));
  document.querySelectorAll('.details-btn').forEach(btn => btn.addEventListener('click', (e) => {
    const id = parseInt(btn.dataset.id);
    lastFilterState = { category: currentCategory, search: searchQuery, favoritesOnly: showFavoritesOnly };
    renderDetailView(id);
  }));
}

function renderDetailView(toolId) {
  const tool = toolsData.find(t => t.id === toolId);
  if (!tool) return;
  currentDetailId = toolId;
  listView.classList.add('hidden');
  detailView.classList.remove('hidden');
  const detailContainer = document.getElementById('detailContent');
  detailContainer.innerHTML = `
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-shrink-0 flex justify-center"><div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center"><i class="${tool.logoIcon} text-6xl text-blue-600 dark:text-blue-400"></i></div></div>
      <div class="flex-1">
        <div class="flex justify-between items-start"><h2 class="text-3xl font-extrabold">${tool.name}</h2><button id="detailFavBtn" class="text-3xl focus:outline-none"><i class="${favorites.has(tool.id) ? 'fas fa-heart heart-active' : 'far fa-heart heart-inactive'}"></i></button></div>
        <span class="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full inline-block mt-2">${tool.category}</span>
        <p class="mt-5 text-gray-700 dark:text-gray-200 leading-relaxed text-lg">${tool.fullDesc}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="${tool.websiteUrl}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md"><i class="fas fa-external-link-alt"></i> Open Official Website</a>
          <button id="detailBackToHome" class="border border-gray-300 dark:border-gray-600 px-6 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"><i class="fas fa-arrow-left"></i> Back to List</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('detailFavBtn')?.addEventListener('click', (e) => toggleFavorite(tool.id, e));
  document.getElementById('detailBackToHome')?.addEventListener('click', () => goBackToList());
}

function goBackToList() {
  currentCategory = lastFilterState.category;
  searchQuery = lastFilterState.search;
  showFavoritesOnly = lastFilterState.favoritesOnly;
  searchInput.value = searchQuery;
  listView.classList.remove('hidden');
  detailView.classList.add('hidden');
  rebuildCategoryFilters();
  renderToolsList();
}

function rebuildCategoryFilters() {
  const categoriesSet = new Set(toolsData.map(t => t.category));
  const categories = ['All', ...Array.from(categoriesSet).sort()];
  categoryContainer.innerHTML = '';
  categories.forEach(cat => {
    const button = document.createElement('button');
    button.innerText = cat;
    button.dataset.cat = cat;
    button.className = `filter-chip px-4 py-2 rounded-full text-sm font-medium transition-all ${cat === currentCategory ? 'filter-chip-active' : 'filter-chip-inactive'}`;
    button.addEventListener('click', () => {
      currentCategory = cat;
      showFavoritesOnly = false;
      searchQuery = searchInput.value.trim();
      rebuildCategoryFilters();
      renderToolsList();
    });
    categoryContainer.appendChild(button);
  });
}

function resetFilters() {
  currentCategory = "All";
  searchQuery = "";
  showFavoritesOnly = false;
  searchInput.value = "";
  rebuildCategoryFilters();
  renderToolsList();
}

// Dark mode
function initDarkMode() {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) { document.documentElement.classList.add('dark'); document.getElementById('darkIcon')?.classList.replace('fa-moon','fa-sun'); }
  else { document.documentElement.classList.remove('dark'); document.getElementById('darkIcon')?.classList.replace('fa-sun','fa-moon'); }
  darkToggle.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', dark);
    const icon = document.getElementById('darkIcon');
    if (dark) icon.classList.replace('fa-moon','fa-sun');
    else icon.classList.replace('fa-sun','fa-moon');
  });
}

function initEventListeners() {
  searchInput.addEventListener('input', (e) => { searchQuery = e.target.value; renderToolsList(); });
  clearFiltersBtn.addEventListener('click', resetFilters);
  homeNavBtn.addEventListener('click', () => { resetFilters(); if (!listView.classList.contains('hidden')) renderToolsList(); else goBackToList(); });
  favoritesNavBtn.addEventListener('click', () => { currentCategory = "All"; searchQuery = ""; showFavoritesOnly = true; searchInput.value = ""; rebuildCategoryFilters(); renderToolsList(); });
  backToListBtn.addEventListener('click', goBackToList);
}

function init() {
  loadFavorites();
  initEventListeners();
  initDarkMode();
  rebuildCategoryFilters();
  renderToolsList();
}

init();