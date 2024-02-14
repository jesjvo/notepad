import React from 'react';

import './App.css'
import Page from './Page';

//icons

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      mode : "Light",
      openPage : false,
      activeContainer : true
    }
  }

  handleMode(){
    if(this.state.mode==='Light'){
      this.setState({mode:"Dark"})}
  else{this.setState({mode:"Light"})}
  }

  handleContainer(){
    if(this.state.activeContainer===true){
      this.setState({activeContainer:false})}
  else{this.setState({activeContainer:true})}
  }

  render(){
    return(
      <div className='App' id={this.state.mode}>
        <div className='Content'>    
          <Page></Page>
        </div>
      </div>
    )
  }
}

export default App;