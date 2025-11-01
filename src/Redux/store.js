// src/Redux/store.js
import { createStore } from "redux";
import recipeReducer from "./RecipeReducer";

const store = createStore(recipeReducer);

export default store;
