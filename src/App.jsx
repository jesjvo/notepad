import React from 'react';
import './Css/App.css'
import Page from './Page';
import Menu from './Menu'

//api send
async function saveData(preferences, content){
  await window.api.saveData(preferences, content);
}

//application interface (main)
class App extends React.Component {
  constructor(){
    super();
    this.state = {
      menuOpen:false, // true or false of menu displaying
      characterCount: null, // handles character count when menu opened
      tempContent:null, // handles the content when opened menu

      //default
      preferences:
      {
        name:"Untitled", //name of file
        author:null, //author of file
        isFavorite:false, //is file favorited
        fontStyle:'Pt Sans', //font style of file
        spellCheck:true, //spell check of editor
        autoSave:false // autosaving of file
      }
    }
    this.handleMenu = this.handleMenu.bind(this);
    this.handleSaveData = this.handleSaveData.bind(this);
    this.setPreferences = this.setPreferences.bind(this);
    this.setAuthor = this.setAuthor.bind(this);
  }

  handleMenu(characterCount, content){this.setState({ characterCount, tempContent:content, menuOpen:true })} //opens menu & updates characterCount
  handleSaveData(content){saveData(this.state.preferences, content)} //sends api to main-process, 'save-data'
  setPreferences(preferences){this.setState(preferences)} //on editor-ready, Page.jsx sends 'setPreferences' -> changing this.state.preferences
  setAuthor(author){var preferences=this.state.preferences; preferences.author=author; this.setState({preferences})} //in Page.jsx, when changed author -> sends 'setAuthor' -> changing author preferences

  setSerif(){
    var preferences=this.state.preferences; preferences.fontStyle='Pt Serif'; this.setState({preferences})
  }

  setMono(){
    var preferences=this.state.preferences; preferences.fontStyle='Pt Mono'; this.setState({preferences})
  }

  setDefault(){
    var preferences=this.state.preferences; preferences.fontStyle='Pt Sans'; this.setState({preferences})
  }

  toggleSpellCheck(){
    var preferences=this.state.preferences; preferences.spellCheck=!preferences.spellCheck; this.setState({preferences})
    console.log(this.state.preferences.spellCheck)
  }

  toggleAutoSave(){
    var preferences=this.state.preferences; preferences.autoSave=!preferences.autoSave; this.setState({preferences})
    console.log(this.state.preferences.autoSave)
  }

  setFavorite(){
    var preferences=this.state.preferences; preferences.isFavorite=!preferences.isFavorite; this.setState({preferences})
    console.log(this.state.preferences.isFavorite)
  }

  render(){
    return(
      <div className='App'>
        {this.state.menuOpen ?
        <Menu
        //configure file preferences
        setDefault={()=>{this.setDefault()}}
        setMono={()=>{this.setMono()}}
        setSerif={()=>{this.setSerif()}}
        toggleSpellCheck={()=>{this.toggleSpellCheck()}} //toggle spell check using PrevState
        toggleAutoSave={()=>{this.toggleAutoSave()}}
        close={()=>{this.setState({menuOpen:false})}}
        saveData={this.handleSaveData}

        //file preferences being passed to Menu.jsx
        tempContent={this.state.tempContent}
        spellCheck={this.state.preferences.spellCheck}
        autoSave={this.state.preferences.autoSave}
        characterCount={this.state.characterCount}
        ></Menu>
         : null}

        <div className='Content'>
          <Page
          //configure file preferences/content/functions
          setFavorite={()=>{this.setFavorite()}}
          saveData={this.handleSaveData}
          setAuthor={this.setAuthor}
          setPreferences={this.setPreferences}
          menuClick={this.handleMenu}
          
          //file preferences being passed to Page.jsx
          author={this.state.preferences.author}
          fontStyle={this.state.preferences.fontStyle}
          fileName={this.state.preferences.name}
          isFavorite={this.state.preferences.isFavorite}
          spellCheck={this.state.preferences.spellCheck}
          ></Page>
        </div>
      </div>
    )
  }
}

export default App;
