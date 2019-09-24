import React, { Component } from 'react';
import './index.less'

class MKTitles extends Component {

  constructor(props) {
    super(props)
    this.state = { }
  }

  handleAnchorPoint = (i) => {
    let titleDom = document.getElementById("titleAnchor" + i)
    document.scrollingElement.scrollTop = titleDom.offsetTop
  }

  render() {
    let { list } = this.props
    return (
      <div>
        <ul className="nav-list">
          {
            list && list.map((nav, i) => {
              return (
                <li key={i}>
                  <span name={'titleAnchor'+ nav.index} dangerouslySetInnerHTML={{__html: nav.title}} className="nav-list-a" onClick={this.handleAnchorPoint.bind(this, nav.index)}></span>
                  <MKTitles list={nav.children}/>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

export default MKTitles;