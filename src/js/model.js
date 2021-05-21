import { API_URL } from './config';
import { getJSON } from './helper';

// Application state (STATE)
export const state = {
  recipes: {},
  search: {
    query: '',
    results: [],
  },
};

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

    console.log(state.recipes);
  } catch (error) {
    // temp error handling
    console.log(`${error}`);
    throw error;
  }
};

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

loadSearchResults('pizza');
