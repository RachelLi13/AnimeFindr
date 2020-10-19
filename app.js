const results = document.querySelector(".results");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
const up = document.querySelector(".up");
let searchValue;
let fetchLink;
let page = 0;
let currentSearch;

//event listener
searchInput.addEventListener("input", (e) => {
  searchValue = e.target.value;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  fetchAnimeCat(searchValue);
});

more.addEventListener("click", loadMore);

up.addEventListener("click", () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

//fetching and generating data
async function fetchApi(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

function generate(data) {
  data.data.forEach((anime) => {
    const animeSuggestion = document.createElement("div");
    animeSuggestion.classList.add("anime-suggestion");
    animeSuggestion.innerHTML = `
    <div>
    <img src=${anime.attributes.posterImage.small}</img>
    </div>
    <div>
    <h2>${anime.attributes.canonicalTitle}</br>
    Popularity Rank: ${anime.attributes.popularityRank}</h2>
    <p>${anime.attributes.synopsis}</p>
    </div>
    `;
    results.appendChild(animeSuggestion);
  });
}

async function fetchTrendingAnime() {
  fetchLink =
    "https://kitsu.io/api/edge/anime?page%5Blimit%5D=10&page%5Boffset%5D=0&sort=popularityRank";
  const data = await fetchApi(fetchLink);
  generate(data);
}

async function fetchAnimeCat(query) {
  clear();
  fetchLink = `https://kitsu.io/api/edge/anime?filter[categories]=${query}&sort=popularityRank`;
  const data = await fetchApi(fetchLink);
  generate(data);
}

function clear() {
  results.innerHTML = "";
  searchInput.value = "";
}

//loads more information
async function loadMore() {
  page += 10;
  if (currentSearch) {
    fetchLink = `https://kitsu.io/api/edge/anime?filter%5Bcategories%5D=${currentSearch}&page%5Blimit%5D=10&page%5Boffset%5D=${page}&sort=popularityRank`;
  } else {
    fetchLink = `https://kitsu.io/api/edge/anime?page%5Blimit%5D=10&page%5Boffset%5D=${page}&sort=popularityRank`;
  }
  const data = await fetchApi(fetchLink);
  generate(data);
}

fetchTrendingAnime();
