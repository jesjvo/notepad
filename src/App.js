import React from 'react';

import './App.css'
import Page from './Page';

//icons

class App extends React.Component {
  constructor(){
    super();
    this.state = {
    }
  }
  handlePage(){
    return true
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