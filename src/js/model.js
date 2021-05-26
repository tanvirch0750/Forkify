import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helper';

/**==========================================
 * *********** APPLICATION STATE ************
 ===========================================*/
export const state = {
  recipes: {},
  search: {
    query: '',
    results: [],
    currentPage: 1,
    resultsPerPage: RES_PER_PAGE,
  },
};

/**==========================================
 * ******** LOAD SINGLE RECIPE DATA *********
 ===========================================*/
// Bring recipe data by ajax call (HTTP LIBRARY)
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;

    state.recipes = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (error) {
    throw error;
  }
};

/**==========================================
 * ********** LOAD ALL RECIPIES ***********
 ===========================================*/
// Bring search data by ajax call (HTTP LIBRARY)
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (error) {
    console.log(`${error}`);
    throw error;
  }
};

/**==========================================
 * ********** PAGINATION ***********
 ===========================================*/
export const getSearchResultsPage = function (page = state.search.currentPage) {
  state.search.currentPage = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 10

  return state.search.results.slice(start, end);
};

/**==========================================
 * ********** UPDATE SERVINGS ***********
 ===========================================*/
export const updateServings = function (newServings) {
  state.recipes.ingredients.forEach(ing => {
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
    ing.quantity = (ing.quantity * newServings) / state.recipes.servings;
  });

  state.recipes.servings = newServings;
};
