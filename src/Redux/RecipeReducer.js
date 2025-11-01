// src/Redux/RecipeReducer.js
import { ADD_TO_FAVOURITE, REMOVE_FROM_FAVOURITE } from "./RecipeActions";

const initialState = {
  favouriteRecipe: [],
};

const recipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_FAVOURITE:
      if (state.favouriteRecipe.some((r) => r.idMeal === action.payload.idMeal)) {
        return state; // prevent duplicates
      }
      return {
        ...state,
        favouriteRecipe: [...state.favouriteRecipe, action.payload],
      };

    case REMOVE_FROM_FAVOURITE:
      return {
        ...state,
        favouriteRecipe: state.favouriteRecipe.filter(
          (r) => r.idMeal !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default recipeReducer;
