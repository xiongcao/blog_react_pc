import React, { Component, Fragment } from 'react'
class Test3 extends Component {
  constructor(props){
    super(props)
    console.log(props, 12312321)
  }

  render() {
    return (
      <Fragment>
        <h2>#Test3</h2>
      </Fragment>
    )
  }
}

export default Test3