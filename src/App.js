import React, { Component, Fragment } from 'react';
// import {Router,Route,IndexRoute,Link} from 'react-router-dom'
import { BrowserRouter, Link } from 'react-router-dom'

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      theme:'light'
    }
  }
  

  changeTheme(theme){
    this.setState({
      theme
    });
  }

  render() {
    return (
      <Fragment>
        <BrowserRouter>
          <div><Link to="/user">123123132</Link></div>
          <div className="App" onClick={this.changeTheme.bind(this,"sss")}>{this.state.theme}</div>
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default App;
