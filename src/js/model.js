import { API_URL } from './config';
import { getJSON } from './helper';

// Application state (STATE)
export const state = {
  recipes: {},
};

// Bring recipe data by ajax call (HTTP LIBRARY)
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

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

    console.log(state.recipes);
  } catch (error) {
    // temp error handling
    console.log(`${error}`);
    throw error;
  }
};
