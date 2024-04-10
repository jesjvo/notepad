import React from 'react';

import './Css/App.css'
import Page from './Page';
import Menu from './Menu'

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      menuOpen:false,
      fontStyle:'Pt Sans',
      characterCount: null,
      isFavorite:false,
      activeFile:null,
    }
    this.handleCharacterCount = this.handleCharacterCount.bind(this);
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

  setFavorite(){
    if(!this.state.isFavorite){
      this.setState({isFavorite:true})
    }else{
      this.setState({isFavorite:false})
    }
  }

  render(){
    return(
      <div className='App'>
        {this.state.menuOpen ?
        <Menu setDefault={()=>{this.setState({fontStyle:'Pt Sans'})}}
        setSerif={()=>{this.setState({fontStyle:'Pt Serif'})}}
        setMono={()=>{this.setState({fontStyle:'Pt Mono'})}} close={()=>{this.setState({menuOpen:false})}}
        characterCount={this.state.characterCount}>
        </Menu>
         : null}

        <div className='Content'>
          <Page onCharacterCount={this.handleCharacterCount} fontStyle={this.state.fontStyle} menuClick={()=>{this.handleMenu()}}
          setFavorite={()=>{this.setFavorite()}} isFavorite={this.state.isFavorite} activeFile={this.state.activeFile}></Page>
        </div>
      </div>
    )
  }
}

export default App;