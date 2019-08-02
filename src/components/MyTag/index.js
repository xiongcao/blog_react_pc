import React, { Component } from 'react';
import './index.less';

class MyTag extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='my-tag' style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

export default MyTag;