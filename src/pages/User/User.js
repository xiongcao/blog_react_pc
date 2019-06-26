import React, { Component, Fragment } from 'react'
class User extends Component {
  constructor(props){
    super(props)
    // console.log(props.match.params)
  }

  toTestPage = () => {
    this.props.history.push({pathname: `/admin/home/test2/11111`, state: {data: 13213}})
  }

  render() {
    return (
      <Fragment>
        <h2 onClick = {this.toTestPage}>#User</h2>
      </Fragment>
    )
  }
}

export default User