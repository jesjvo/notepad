import React from 'react';

import './Css/App.css'
import Page from './Page';
import Menu from './Menu'

//icons

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      menuOpen:false,
      fontStyle:'Pt Sans',
    }
  }
  handleMenu(){
    if(!this.state.menuOpen){
      this.setState({menuOpen:true})
    }else{
      this.setState({menuOpen:false})
    }
  }

  render(){
    return(
      <div className='App'>

        {this.state.menuOpen ?
        <Menu setDefault={()=>{this.setState({fontStyle:'Pt Sans'})}}
        setSerif={()=>{this.setState({fontStyle:'Pt Serif'})}}
        setMono={()=>{this.setState({fontStyle:'Pt Mono'})}} close={()=>{this.setState({menuOpen:false})}}>
        </Menu>
         : null}

        <div className='Content'>
          <Page fontStyle={this.state.fontStyle} menuClick={()=>{this.handleMenu()}}></Page>
        </div>
      </div>
    )
  }
}

export default App;