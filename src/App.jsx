import React from 'react';

import './Css/App.css'
import Page from './Page';
import Menu from './Menu'

async function handleApplicationMessage(request, openingCode, promise, preferences){
  const { api } = window

  if(request==='upload-file'){
    const uploadFile = await api.uploadFile(openingCode, promise, preferences);
  }

  if(request==='change-font'){
    await api.changeFont(openingCode, promise);
  }

  if(request==='change-favorite'){
    await api.changeFavorite(openingCode, promise);
  }
  
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

      preferences:
      {
        isNewFile:true,
        name:'Untitled',
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
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount(){
    const filePreferencesResult = handleApplicationMessage('open-application', true)

    filePreferencesResult.then(function(preferences) {
      return preferences

    }).then((preferences) => {
      this.setState(preferences)
    })
  }

  handleCharacterCount(characterCount){
    this.setState({ characterCount });
  }

  handleUpdate(fileContent){
    if(this.state.preferences.isNewFile){
      //if it is a new file, then it will send preferences made (for a new saved file)
      var preferences=this.state.preferences; preferences.isNewFile=false
      this.setState({preferences})
      handleApplicationMessage('upload-file', true, fileContent, this.state.preferences)
    }else{
      //if not a new file, it only needs to upload file content
      handleApplicationMessage('upload-file', true, fileContent)
    }
  }

  handleMenu(){
    if(!this.state.menuOpen){
      this.setState({menuOpen:true})
    }else{
      this.setState({menuOpen:false})
    }
  }

  setSerif(){
    var preferences=this.state.preferences; preferences.fontStyle='Pt Serif'
    this.setState({preferences})
    handleApplicationMessage('change-font', true, 'Pt Serif')
  }

  setDefault(){
    var preferences=this.state.preferences; preferences.fontStyle='Pt Sans'
    this.setState({preferences})
    handleApplicationMessage('change-font', true, 'Pt Sans')
  }

  setFavorite(){
    if(!this.state.preferences.isFavorite){
      var preferences=this.state.preferences; preferences.isFavorite=true
      this.setState({preferences})
      handleApplicationMessage('change-favorite', true, true)
    }else{
      preferences=this.state.preferences; preferences.isFavorite=false
      this.setState({preferences})
      handleApplicationMessage('change-favorite', true, false)
    }
  }

  render(){
    return(
      <div className='App'>
        {this.state.menuOpen ?
        <Menu
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
                onHandleUpdate={this.handleUpdate}

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