import React from 'react';
import './Css/App.css'

//pages
import Page from './Page';
import Menu from './Menu'
import Inbox from './Inbox'

//api send
async function saveData(preferences, content){
  await window.api.saveData(preferences, content);
}

//application interface
class App extends React.Component {
  constructor(){
    super();
    this.state = {
      menuOpen:false, // true or false of menu displaying
      inboxOpen:false, //true or false of inbox displaying
      characterCount: null, // handles character count when menu opened
      tempContent:null, // handles the content when opened menu (is temporary content)

      //default preferences
      preferences:
      {
        name:"Untitled", //title of file
        author:null, //author of file
        isFavorite:false, //is file favorited
        fontStyle:'Pt Sans', //font style of file (default is arial)
        spellCheck:true, //spell check of editor
        autoSave:false // autosaving of file (when saved, closed, exited, renamed)
      }
    }
    this.handleMenu = this.handleMenu.bind(this); // Page.jsx sends 'handleMenu' -> opening menu
    this.handleInbox = this.handleInbox.bind(this); // Page.jsx sends 'handleInbox' -> opening inbox
    this.handleSaveData = this.handleSaveData.bind(this); // Page.jsx sends 'handleSaveData' -> saving data to file
    this.setPreferences = this.setPreferences.bind(this); // Page.jsx sends 'setPreferences' when application is opened
    this.setAuthor = this.setAuthor.bind(this); // Page.jsx sends 'setAuthor' when author is submitted
    this.setName = this.setName.bind(this); // Page.jsx sends 'setName' when changing name is submitted
  }

  handleMenu(characterCount, tempContent){this.setState({ characterCount, tempContent:tempContent, menuOpen:true })} //opens menu -> updates characterCount and gives temporary sample of current content
  handleInbox(){this.setState({ inboxOpen:true })} //opens inbox
  handleSaveData(content){saveData(this.state.preferences, content)} //sends api to main-process, 'save-data' to save content and preferences to current file
  setPreferences(preferences){this.setState(preferences)} //on editor-ready (application loaded), Page.jsx sends 'setPreferences' -> changing this.state.preferences to load file
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
        {
        this.state.menuOpen ? // displaying menu determined by 'this.state.menuOpen'
          <Menu
          // sends api functions to App.jsx from Menu.jsx
          setDefault={()=>{this.setDefault()}} // sets font to default (arial)
          setMono={()=>{this.setMono()}} // sets font to mono
          setSerif={()=>{this.setSerif()}} // sets font to serif
          toggleSpellCheck={()=>{this.toggleSpellCheck()}} // toggles spell check
          toggleAutoSave={()=>{this.toggleAutoSave()}} // toggles auto save
          close={()=>{this.setState({menuOpen:false})}} // closes menu
          saveData={this.handleSaveData} // sends api functions to App.jsx from Menu.jsx to save data (preferences, content) -> to file

          // passes states to Menu.jsx from App.jsx
          name={this.state.preferences.name} // name preferences
          author={this.state.preferences.author} // author preferences
          tempContent={this.state.tempContent} // temporary content (is temporary sample of current content in editor)
          spellCheck={this.state.preferences.spellCheck} // spell check preferences
          autoSave={this.state.preferences.autoSave} // auto save preferences
          characterCount={this.state.characterCount} // character count
          />
         : null
        }

        {
        this.state.inboxOpen ? // displaying inbox determined by 'this.state.inboxOpen'
          <Inbox
          close={()=>{this.setState({inboxOpen:false})}} // closes inbox
          />
         : null
         }

        <div className='app-content'>
          <Page
          // sends api functions to App.jsx from Page.jsx
          setFavorite={()=>{this.setFavorite()}} // toggles favorite
          saveData={this.handleSaveData} // sends api functions to App.jsx from Page.jsx to save data (preferences, content) -> to file
          setAuthor={this.setAuthor} // sends api functions to App.jsx from Page.jsx to change author
          setRename={this.setName} // sends api functions to App.jsx from Page.jsx to change name
          setPreferences={this.setPreferences} // sends api functions to App.jsx from Page.jsx to change preferences (on editor ready or application loaded)
          inboxClick={this.handleInbox} // opens inbox
          menuClick={this.handleMenu} // opens menu
          
          //passes states to Page.jsx from App.jsx
          autoSave={this.state.preferences.autoSave} // auto save preferences
          author={this.state.preferences.author} // author preferences
          fontStyle={this.state.preferences.fontStyle} // font preferences
          name={this.state.preferences.name} // name preferences
          isFavorite={this.state.preferences.isFavorite} // favorite preferences
          spellCheck={this.state.preferences.spellCheck} // spell check preferences
          ></Page>
        </div>
      </div>
    )
  }
}

export default App;
