import React, { Component } from 'react';
import * as Fetch from '@/libs/fetch';
import { Card, Spin } from 'antd'
import { oss } from '@/libs/publicPath.js'
const { Meta } = Card;

import './index.less'

class Project extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      spinLoading: true
    }
  }

  UNSAFE_componentWillMount () {
    document.title = '熊博园-我的项目'
    this.getProjectList()
  }

  getProjectList = () => {
    Fetch.get(`project/findAll`).then((res) => {
			if (res.code === 0) {
        this.setState({
          list: res.data,
          spinLoading: false
        })
      }
    })
  }

  toPage = (url) => {
    window.open(url, '_target')
  }

  render() {
    let { list, spinLoading } = this.state
    return (
      <Spin spinning={spinLoading} size="large">
        {
          spinLoading && <div style={{width: '100%', minHeight: 400}}></div>
        }
        <div className="frontend-project">
          <article>
            {
              list.map((item, i) => (
                <Card
                  key={i}
                  hoverable={true}
                  style={ (i+1)%2===0 ? {width: 300, marginBottom: 30, marginLeft: 30, marginRight: 30} : { width: 300, marginBottom: 30 }}
                  cover={
                    <img height="250" src={oss + item.cover}/>
                  }
                  onClick={this.toPage.bind(this, item.url)}
                >
                  <Meta title={item.name} description={item.introduction}/>
                </Card>
              ))
            }
          </article>
        </div>
      </Spin>
    );
  }
}

export default Project;