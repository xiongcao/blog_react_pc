import React, { Component } from 'react';
import './index.less';

class PageTitle extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='page-title'>
        <p>{this.props.children}</p>
      </div>
    );
  }
}

export default PageTitle;