export const ADD_TO_FAVOURITE = "ADD_TO_FAVOURITE";
export const REMOVE_FROM_FAVOURITE = "REMOVE_FROM_FAVOURITE";

export const addToFavourite = (recipe) => ({
  type: ADD_TO_FAVOURITE,
  payload: recipe,
});

export const removeFromFavourite = (idMeal) => ({
  type: REMOVE_FROM_FAVOURITE,
  payload: idMeal,
});
