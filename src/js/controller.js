import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
// polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

// parcel- reloading
// if (module.hot) {
//   module.hot.accept();
// }

/**==========================================
 * ********** RECIPES CONTROLLER ***********
 ===========================================*/
const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipes);
  } catch (error) {
    recipeView.renderError();
  }
};

/**==========================================
 * ********** SEARCH CONTROLLER ***********
 ===========================================*/
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // get search query
    const query = searchView.getQuery();
    if (!query) return;

    // load search results
    await model.loadSearchResults(query);

    // render search results
    resultsView.render(model.getSearchResultsPage(1));

    // render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {}
};

/**==========================================
 * ********** PAGINATION CONTROLLER ********
 ===========================================*/
const controlPagination = function (goToPage) {
  // render NEW search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render NEW pagination buttons
  paginationView.render(model.state.search);
};

/**==========================================
 * ********** SERVINGS CONTROLLER ***********
 ===========================================*/
const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  // recipeView.render(model.state.recipes);
  recipeView.update(model.state.recipes);
};

/**==========================================
 * ********* INITIAL FUNCTIONALITY *********
 ===========================================*/
// for publisher-subscriber pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
