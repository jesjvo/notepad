import React from 'react';
import './Css/App.css'
import Page from './Page';
import Menu from './Menu'
import Inbox from './Inbox'

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
      inboxOpen:false, //true or false of inbox displaying
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
    this.handleInbox = this.handleInbox.bind(this);
    this.handleSaveData = this.handleSaveData.bind(this);
    this.setPreferences = this.setPreferences.bind(this);
    this.setAuthor = this.setAuthor.bind(this);
    this.setName = this.setName.bind(this);
  }

  handleMenu(characterCount, content){this.setState({ characterCount, tempContent:content, menuOpen:true })} //opens menu -> updates characterCount and gives temporary sample of current content
  handleInbox(){this.setState({ inboxOpen:true })} //opens inbox
  handleSaveData(content){saveData(this.state.preferences, content)} //sends api to main-process, 'save-data' to save content and preferences
  setPreferences(preferences){this.setState(preferences)} //on editor-ready, Page.jsx sends 'setPreferences' -> changing this.state.preferences to load file
  setAuthor(author){var preferences=this.state.preferences; preferences.author=author; this.setState({preferences})} //in Page.jsx, when changed author -> sends 'setAuthor' -> changing author preferences
  setName(rename){var preferences=this.state.preferences; preferences.name=rename; this.setState({preferences})} //in Page.jsx, when changed rename -> sends 'setRename' -> changing name preferences
  setSerif(){var preferences=this.state.preferences; preferences.fontStyle='Pt Serif'; this.setState({preferences})} //in Menu.jsx, when changed serif -> sends 'setSerif' -> changing font preferences
  setMono(){var preferences=this.state.preferences; preferences.fontStyle='Pt Mono'; this.setState({preferences})} //in Menu.jsx, when changed mono -> sends 'setMono' -> changing font preferences
  setDefault(){var preferences=this.state.preferences; preferences.fontStyle='Pt Sans'; this.setState({preferences})} //in Menu.jsx, when changed default -> sends 'setDefault' -> changing font preferences
  toggleSpellCheck(){var preferences=this.state.preferences; preferences.spellCheck=!preferences.spellCheck; this.setState({preferences})} //in Menu.jsx, when spell check is toggled -> sends 'toggleSpellCheck' -> changing spell check preferences
  toggleAutoSave(){var preferences=this.state.preferences; preferences.autoSave=!preferences.autoSave; this.setState({preferences})} //in Menu.jsx, when auto save is toggled -> sends 'toggleAutoSave' -> changing auto save preferences
  setFavorite(){var preferences=this.state.preferences; preferences.isFavorite=!preferences.isFavorite; this.setState({preferences})} //in Page.jsx, when favorite is toggled -> sends 'setFavorite' -> changing favorite preferences

  render(){
    return(
      <div className='app'>
        {this.state.menuOpen ?
        <Menu
        //configure file preferences
        setDefault={()=>{this.setDefault()}}
        setMono={()=>{this.setMono()}}
        setSerif={()=>{this.setSerif()}}
        toggleSpellCheck={()=>{this.toggleSpellCheck()}}
        toggleAutoSave={()=>{this.toggleAutoSave()}}
        close={()=>{this.setState({menuOpen:false})}}
        saveData={this.handleSaveData}

        //file preferences being passed to Menu.jsx
        name={this.state.preferences.name}
        author={this.state.preferences.author}
        tempContent={this.state.tempContent}
        spellCheck={this.state.preferences.spellCheck}
        autoSave={this.state.preferences.autoSave}
        characterCount={this.state.characterCount}
        ></Menu>
         : null}

        {this.state.inboxOpen ? 
        <Inbox
        close={()=>{this.setState({inboxOpen:false})}}
        
        ></Inbox>
         : null}

        <div className='app-content'>
          <Page
          //configure file preferences/content/functions
          setFavorite={()=>{this.setFavorite()}}
          saveData={this.handleSaveData}
          setAuthor={this.setAuthor}
          setRename={this.setName}
          setPreferences={this.setPreferences}
          inboxClick={this.handleInbox}
          menuClick={this.handleMenu}
          
          //file preferences being passed to Page.jsx
          author={this.state.preferences.author}
          fontStyle={this.state.preferences.fontStyle}
          name={this.state.preferences.name}
          isFavorite={this.state.preferences.isFavorite}
          spellCheck={this.state.preferences.spellCheck}
          ></Page>
        </div>
      </div>
    )
  }
}

export default App;
