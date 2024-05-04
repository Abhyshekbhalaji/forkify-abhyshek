import view from "./view.js"
import icons from "url:../img/icons.svg"
import previewView from './previewView.js'
class bookmarkView extends view{
    _parentElement =document.querySelector('.bookmarks__list');
    _message="";  
     _errorMessage=`No Bookmarks yet.Find a nice recipe and bookmark it :)`;
    
    addHandlerRender(handler){
        window.addEventListener('load',handler);
    }
    _generateMarkup(){
        return this._data.map(result => previewView.render(result,false)).join('')

    }
    }
    export default new bookmarkView()