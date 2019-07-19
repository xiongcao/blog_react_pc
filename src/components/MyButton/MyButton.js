import React, { Component, Fragment } from 'react'
import { Tag } from 'antd';

class MyButton extends Component{
  constructor(props){
    super(props)
    this.state = {
    }
  }

  handleClick = () => {
    this.props.onClick()
  }

  render () {
    let { children, type, size, color } = this.props
    let style = {
      cursor: 'pointer'
    }
    if (!size || size === 'default') {
      style = {
        padding: '5px 15px',
        fontSize: '12px',
        verticalAlign: 'middle',
        height: '31px',
        lineHeight: '1.5',
        cursor: 'pointer'
      }
    } else if (size === 'large') {
      style = {
        padding: '8px 15px',
        fontSize: '16px',
        verticalAlign: 'middle',
        height: '40px',
        cursor: 'pointer'
      }
    }

    if (type === 'success') {
      color = '#19be6b'
    } else if (type === 'info') {
      color = '#2db7f5'
    } else if (type === 'primary') {
      color = '#108ee9'
    } else if (type === 'error') {
      color = '#f50'
    } else if (type === 'warning') {
      color = '#f90'
    }
    return (
      <Tag style={style} color={color} onClick={this.handleClick}>{children}</Tag>
    )
  }
}

export default MyButton