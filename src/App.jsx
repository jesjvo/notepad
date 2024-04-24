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
      menuOpen:false,
      characterCount: null,

      //default
      preferences:
      {
        name:"Untitled",
        author:null,
        isFavorite:false,
        date:{
          updatedLast:null,
          createdDate:null,
        },
        fontStyle:'Pt Sans',
        spellCheck:true,  
      },
    }
    this.handleMenu = this.handleMenu.bind(this);
    this.handleSaveData = this.handleSaveData.bind(this);
    this.setPreferences = this.setPreferences.bind(this);
  }

  handleMenu(characterCount){this.setState({ characterCount, menuOpen:true })} //opens menu & updates characterCount
  handleSaveData(content){saveData(this.state.preferences, content)} //sends api to main-process, 'save-data'
  setPreferences(preferences){this.setState(preferences)} //on editor-ready, Page.jsx sends 'setPreferences' -> changing this.state.preferences


  setSerif(){
    var preferences=this.state.preferences; preferences.fontStyle='Pt Serif'; this.setState({preferences})
  }

  setDefault(){
    var preferences=this.state.preferences; preferences.fontStyle='Pt Sans'; this.setState({preferences})
  }

  toggleSpellCheck(){
    var preferences=this.state.preferences; preferences.spellCheck=!preferences.spellCheck; this.setState({preferences})
    console.log(this.state.preferences.spellCheck)
  }

  setFavorite(){
    if(!this.state.preferences.isFavorite){
    var preferences=this.state.preferences; preferences.isFavorite=true; this.setState({preferences})}
    else{preferences=this.state.preferences; preferences.isFavorite=false; this.setState({preferences})}
  }

  render(){
    return(
      <div className='App'>
        {this.state.menuOpen ?
        <Menu
        //configure file preferences
        setDefault={()=>{this.setDefault()}}
        setSerif={()=>{this.setSerif()}}
        toggleSpellCheck={()=>{this.toggleSpellCheck()}} //toggle spell check using PrevState
        close={()=>{this.setState({menuOpen:false})}}

        //file preferences being passed to Menu.jsx
        lastUpdated={this.state.preferences.date.updatedLast}
        spellCheck={this.state.preferences.spellCheck}
        createdDate={this.state.preferences.date.createdDate}
        characterCount={this.state.characterCount}
        ></Menu>
         : null}

        <div className='Content'>
          <Page
          //configure file preferences/content/functions
          setFavorite={()=>{this.setFavorite()}}
          saveData={this.handleSaveData}
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