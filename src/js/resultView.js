import view from "./view.js";
import previewView from "./previewView.js"
import icons from "url:../img/icons.svg";

class resultView extends view{
_parentElement =document.querySelector(".results");
_message="";  
 _errorMessage=`No recipe found for your Query! Try again later`;

 _generateMarkup(){
  return this._data.map(result => previewView.render(result,false)).join('')
 
}
}
export default new resultView()