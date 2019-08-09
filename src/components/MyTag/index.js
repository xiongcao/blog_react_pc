import React, { Component } from 'react';
import './index.less';

class MyTag extends Component {
  constructor(props){
    super(props)
    this.state = {
      checked: false
    }
  }

  handleClick = () => {
    let checked = this.props.checked
    if (checked) {
      this.props.onClick()
    } else {
      this.props.onClick(this.props.id)
    }
  }

  render () {
    let { checked } = this.props
    return (
      <div className={'my-tag' + (checked ? ' tag-checked' : '')} style={this.props.style} onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }
}

export default MyTag;