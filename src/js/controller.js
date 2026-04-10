import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';



// import icons from 'url:../img/icons.svg'; //Parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

// if (model.hot) {
//   model.hot.accept();
// };

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultPage());

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};



const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()
    //1 Get Search Query
    const query = SearchView.getQuery();
    if (!query) return;

    //2 Loading search
    await model.loadSearchResults(query);

    // 3 Render result
    resultsView.render(model.getSearchResultPage());

    // 4 Render initial pagination buttons
    paginationView.render(model.state.search);

  } catch (err) {
    console.log(err);
  }

};

const controlPagination = function (goToPage) {
  // model.state.search.page = goToPage;

  resultsView.render(model.getSearchResultPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  //Update the recipe serving (in state)
  model.updateServings(newServing);

  //updating the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {

  // 1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //2. Update recipe view
  recipeView.update(model.state.recipe);

  //3.Render bookmarks
  bookmarksView.render(model.state.bookmarks)
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};


const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
