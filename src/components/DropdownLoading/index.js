import React, { Component } from 'react';
import './index.less'

class DropdownLoading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingCompleted: props.loadingCompleted,
      loading: props.loading,
      loadStyle: props.loadStyle,
      completedStyle: props.completedStyle
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({
      loadingCompleted: nextProps.loadingCompleted,
      loading: nextProps.loading
    })
  }

  render() {
    let { loadingCompleted, loading, loadStyle, completedStyle } = this.state
    return (
      <div className="dropdown-loading">
        {
          loadingCompleted && (
            <div className="loading-completed" style={loadStyle}>-------------------- 别拉啦，下面没有了哟！ -------------------</div>
          )
        }
        {
          loading && (
            <div className="sk-circle loading" style={completedStyle}>
              <div className="sk-circle1 sk-child"></div>
              <div className="sk-circle2 sk-child"></div>
              <div className="sk-circle3 sk-child"></div>
              <div className="sk-circle4 sk-child"></div>
              <div className="sk-circle5 sk-child"></div>
              <div className="sk-circle6 sk-child"></div>
              <div className="sk-circle7 sk-child"></div>
              <div className="sk-circle8 sk-child"></div>
              <div className="sk-circle9 sk-child"></div>
              <div className="sk-circle10 sk-child"></div>
              <div className="sk-circle11 sk-child"></div>
              <div className="sk-circle12 sk-child"></div>
            </div>
          )
        }
      </div>
    );
  }
}

export default DropdownLoading;
