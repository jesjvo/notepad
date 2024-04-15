import React from 'react';

import './Css/App.css'
import Page from './Page';
import Menu from './Menu'

async function handleApplicationMessage(request, openingCode){
  const { api } = window
  
  if(request==='open-application'){
    const result = await api.openApplication(openingCode);
    return result
  }
}

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      menuOpen:false,
      characterCount: null,

      preferences: //loaded in through 'component did mount'
        {
          name:null,
          isFavorite:false,
          date:{
            updatedLast:null,
            createdDate:null,
          },
          fontStyle:'Pt Sans',
          spellCheck:true,
        },
    }
    this.handleCharacterCount = this.handleCharacterCount.bind(this);
  }

  componentDidMount(){
    //receive data from opening application

    //first get 'last opened file'
    //and pass it through the --> filePreferencesResult
    const filePreferencesResult = handleApplicationMessage('open-application', true)
    filePreferencesResult.then(function(result) {
    console.log(result)
      
      // result includes --> name, isFavorite, updatedLast, createdDate, fontStyle, spellCheck, content
      // then updating states using the information,
  });
  }

  handleCharacterCount(characterCount){
    this.setState({ characterCount });
  }

  handleMenu(){
    if(!this.state.menuOpen){
      this.setState({menuOpen:true})
    }else{
      this.setState({menuOpen:false})
    }
  }

  setSerif(){
    var setSerif=this.state.preferences; setSerif.fontStyle='Pt Serif'
    this.setState({setSerif})
    //send 'update preferences' via ipc
  }

  setDefault(){
    var setDefault=this.state.preferences; setDefault.fontStyle='Pt Sans'
    this.setState({setDefault})
    //send 'update preferences' via ipc
  }

  setFavorite(){
    if(!this.state.preferences.isFavorite){
      var isFav=this.state.preferences; isFav.isFavorite=true
      this.setState({isFav})
    }else{
      isFav=this.state.preferences; isFav.isFavorite=false
      this.setState({isFav})
    }
    //send 'update preferences' via ipc
  }

  render(){
    return(
      <div className='App'>
        {this.state.menuOpen ?
        <Menu
        setMono={()=>{this.setState({fontStyle:'Pt Mono'})}}
        close={()=>{this.setState({menuOpen:false})}} characterCount={this.state.characterCount}
        
        //configure file preferences
        setDefault={()=>{this.setDefault()}}
        setSerif={()=>{this.setSerif()}}

        //file preferences being passed to Menu.jsx
        lastUpdated={this.state.preferences.date.updatedLast}
        createdDate={this.state.preferences.date.createdDate}

        ></Menu>
         : null}

        <div className='Content'>
          <Page onCharacterCount={this.handleCharacterCount} menuClick={()=>{this.handleMenu()}}

          //configure file preferences
          setFavorite={()=>{this.setFavorite()}}
          
          //File preferences being passed to Page.jsx
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