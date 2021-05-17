import * as model from './model';
import recipeView from './views/recipeView';

// polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipes);
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

// for publisher-subscriber pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};
init();
