import { API_URL, RES_PER_PAGE, KEY } from './config';
import { getJSON, sendJSON } from './helper';

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
  bookmarks: [],
};

/**==========================================
 * ******** LOAD SINGLE RECIPE DATA *********
 ===========================================*/

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // conditionally add properties to an object
    ...(recipe.key && { key: recipe.key }),
  };
};
// Bring recipe data by ajax call (HTTP LIBRARY)
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    state.recipes = createRecipeObject(data);

    // for bookmark
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipes.bookmarked = true;
    } else {
      state.recipes.bookmarked = false;
    }
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

    // for after load recipe should be the page 1
    state.search.currentPage = 1;
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

/**==========================================
 * *************** BOOKMARKS ****************
 ===========================================*/
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  // Add Bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipes.id) state.recipes.bookmarked = true;

  persistBookmarks();
};

export const deleteBookMark = function (id) {
  // delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark NOT current recipe as bookmark
  if (id === state.recipes.id) state.recipes.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// for development purpose
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

/**==========================================
 * ************* UPLOAD RECIPE **************
 ===========================================*/
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct ingredient format'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

    state.recipes = createRecipeObject(data);

    addBookMark(state.recipes);

    console.log(data);
  } catch (error) {
    throw error;
  }
};
