import React, { Component } from 'react';
import './index.less'

class MKTitles extends Component {

  constructor(props) {
    super(props)
    this.state = { }
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
                  {/* <a href={'#titleAnchor'+ nav.index} dangerouslySetInnerHTML={{__html: nav.title}} className={highlightIndex === nav.index ? 'active' : ''} className="nav-list-a"></a> */}
                  <a href={'#titleAnchor'+ nav.index} dangerouslySetInnerHTML={{__html: nav.title}} className="nav-list-a"></a>
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