import {async} from 'url:regenerator-runtime';
import {API_URL,API_KEY}from './config.js'
import {getJSON,sendJSON} from "./helper.js"
import { RES_PER_PG } from './config.js';

export const state={
    recipe:{},
    search:{
        query:"",
        results:[],
        resultsPerPage: RES_PER_PG,
        page:1
    },
    bookmarks:[],

}


const createRecipeObject= function(data){
   const recipe=data.data.recipe
 
    return {
      id:recipe.id,
      title:recipe.title,
      publisher:recipe.publisher,
      sourceUrl: recipe.source_url,
      image:recipe.image_url,
      servings:recipe.servings,
      cookingTime:recipe.cooking_time,
      ingredients:recipe.ingredients,
      bookmarked:false,
      ...(recipe.key && {key:recipe.key})
    }
}




export const loadRecipe= async function(id){
 try{
    const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);
   state.recipe=createRecipeObject(data);

    if(state.bookmarks.some(bk => bk.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
} catch(error){
    console.error(`${error} 💥💥`);
}
}


export const loadSearchResults = async function(query){
    try{
    const data=await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`)
    state.search.query=query;
    state.search.results=data.data.recipes.map(rec =>{
        return {
            id:rec.id,
            title:rec.title,
            publisher:rec.publisher,
            image:rec.image_url,
            ...(rec.key && {key:rec.key})
        }

    } )
    state.search.page=1;
    }
    catch(error){
        throw error
    }
}

const persistBookmark =function(){

    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const getSearchResultsPage=function(page=state.search.page){
state.search.page=page;
    let start=(page-1)*state.search.resultsPerPage;//0
let end=page*state.search.resultsPerPage;//9
  
    return state.search.results.slice(start,end)

}

export const updateServings=function(newServings){
  
  state.recipe.ingredients.forEach( (ing)=> {
       ing.quantity=(ing.quantity * newServings) / state.recipe.servings; 
        //newQt=oldQt *newServings /oldServings 
        //2 * 8 / 4 =4
     
    })

     state.recipe.servings= newServings;
}

export const addBookMark= function(recipe){
    //Add bookmark

    state.bookmarks.push(recipe);

// Mark Current recipe as bookmark
if(recipe.id ===state.recipe.id) state.recipe.bookmarked= true;
persistBookmark()
}

export const deleteBookMark=function(id){
    const index=state.bookmarks.findIndex(el => el.id===id)
    state.bookmarks.splice(index,1);

   // Mark Current recipe Not as a bookmark
if(id === state.recipe.id) state.recipe.bookmarked=false;
persistBookmark()
}

const init=function(){
const storage= localStorage.getItem('bookmarks');
if(storage) state.bookmarks=JSON.parse(storage);
}
init();

const clearBookMarks=function(){
    localStorage.clear("bookmarks")
}
// clearBookMarks();

export const uploadRecipe= async function(newRecipe){
try{
  const ingredients=Object.entries(newRecipe).filter(entry => 
   entry[0].startsWith('ingredient') && entry[1] !==""  
  ).map(ingi => {
    const ingiArr=ingi[1].split(',').map( el => el.trim());
    if(ingiArr.length !==3){
        throw new Error(
            `Wrong ingredient format! Please use the correct format:)`
        )
    }
   const[quantity,unit,description] = ingiArr;
   
   return {quantity:quantity? +quantity:null,unit,description};
  })

  const recipe={
    title:newRecipe.title,
    source_url:newRecipe.sourceUrl,
    image_url:newRecipe.image,
    publisher:newRecipe.publisher,
    cooking_time:+newRecipe.cookingTime,
    servings:+newRecipe.servings,
    ingredients,
}

  const data= await sendJSON(`${API_URL}?key=${API_KEY}`,recipe)
  state.recipe=createRecipeObject(data)
  addBookMark(state.recipe);
}
catch(error){
    throw error;
}

}