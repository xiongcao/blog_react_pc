import React, { Component, Fragment } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import Header from '@components/Header/Header'
import LeftMenu from '@components/LeftMenu/LeftMenu'
import RightContent from '@components/RightContent/RightContent'
import Footer from '@components/Footer/Footer'

import './BasicLayout.less'

class BasicLayout extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
        <div><Link to="/footer">123123132</Link></div>
        <div><Link to="/header">1111111</Link></div>
        <Route path="/header/" component={Header} />
        <Route path="/footer/" component={Footer} />
        <Header/>
        <LeftMenu/>
        <RightContent/>
        <Footer/>
      </div>
    )
  }
}

export default BasicLayout