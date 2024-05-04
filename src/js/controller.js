import * as model from "./model"
import recipeView from "./recipeView";
import resultView from "./resultView.js";
import bookmarkView from "./bookmarkView.js";
import searchView from "./searchView.js";
import paginationView from "./paginationView.js";
import previewView  from "./previewView.js";
import addRecipeView from "./addRecipeView.js"
import { MODAL_CLOSE_SEC } from "./config.js";


import 'core-js/stable';
import 'regenerator-runtime/runtime';


// if(module.hot){
//   module.hot.accept()
// }
const recipeContainer = document.querySelector('.recipe');

console.log("test");


// https://forkify-api.herokuapp.com/v2
//6f947d40-beb2-4718-a64d-fe70fca07575
///////////////////////////////////////




const controlRecipes=async function(){
try{
  const id=window.location.hash.slice(1);
  if(!id)return;

recipeView.renderSpinner();

//1) Loading recipe

await model.loadRecipe(id);

resultView.update(model.getSearchResultsPage());
//2)  Rendering the recipe

bookmarkView.update(model.state.bookmarks)
recipeView.render(model.state.recipe);

}
catch (error){
 recipeView.renderError();
}
}
const controlSearchResults =async function(){
  try{
   
    // 1) Get search query
    const query =await searchView.getQuery();
    if(!query)return;

    //2) Load search results
   resultView.renderSpinner(); 
     await model.loadSearchResults(query);

    //3) Render the results
resultView.render(model.getSearchResultsPage())

  //4) Render inital pagination buttons
  paginationView.render(model.state.search);

  //Updates once the recipe is rendered
   
  }
  catch(error){
   console.log(error)
  }
}
controlSearchResults();


//Update the results view to mark selected


const controlPagination=function(goToPage){
//Render new results
  resultView.render(model.getSearchResultsPage(goToPage))
recipeView.update(model.state.recipe);
  //4) Render inital pagination buttons
  paginationView.render(model.state.search);
}
const controlServings = function(newServings){
  //Update the recipe servings (in state)
  model.updateServings(newServings)

  //update the recipe view 
  recipeView.update(model.state.recipe);
}

const controlAddBookmark=function(){
  //Add or remove bookmark
  if(!model.state.recipe.bookmarked){ 
    model.addBookMark(model.state.recipe)

  }
  else{
      model.deleteBookMark(model.state.recipe.id)
    }
    //2) Updating the recipe
   recipeView.update(model.state.recipe);

   //3) Rendering bookamrk
   bookmarkView.render(model.state.bookmarks);

   //4) Render cuatom recipe inside the bookmark
   recipeView.render(model.state.recipe)


  }

  const controlBookmarks=function(){
    bookmarkView.render(model.state.bookmarks)
  }


  const controlAddRecipe= async function(newRecipe){
    try{
//UPLOAD NEW RECIPE DATA
addRecipeView.renderSpinner()
await model.uploadRecipe(newRecipe)
console.log(model.state.recipe);

recipeView.render(model.state.recipe)
//success message

addRecipeView.renderMessage();

//rendering bookmark
bookmarkView.render(model.state.bookmarks);

//change ID In URL
//window.history.pushState(state,title,URL with #id)
window.history.pushState(null,'',`#${model.state.recipe.id}`)

   //5) Close the form Window
   setTimeout(function(){
    addRecipeView.toggleWindow()
   },MODAL_CLOSE_SEC*1000)
    }
    catch(error){
      console.log(error);
addRecipeView.renderError(error)
    }





  }

const init=function(){
  bookmarkView.addHandlerRender(controlBookmarks)
recipeView.renderHandler(controlRecipes)
recipeView.addHandlerUpdateServings(controlServings)
searchView.addHandlerSearch(controlSearchResults);
recipeView.addHandlerAddBookmark(controlAddBookmark)
paginationView.addHandlerClick(controlPagination);
addRecipeView.addHandlerUpload(controlAddRecipe)
}
init();


