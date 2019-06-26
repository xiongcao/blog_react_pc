import React, { Component, Fragment } from 'react'
class Test2 extends Component {
  constructor(props){
    super(props)
    console.log(props, 12312321)
  }

  render() {
    return (
      <Fragment>
        <h2>#Test2</h2>
      </Fragment>
    )
  }
}

export default Test2