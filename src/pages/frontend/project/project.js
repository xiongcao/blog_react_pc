import React, { Component, Fragment } from 'react';
import * as Fetch from '@/libs/fetch';
import { Card, Spin, Empty } from 'antd'
import { oss } from '@/libs/publicPath.js'
import store from '@/libs/store'
import noResult from '@/assets/img/noResult.png'
const { Meta } = Card;

import './index.less'

class Project extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      spinLoading: true,
      userInfo: store.getState().user,
      isEmpty: false // 没有数据
    }
  }

  UNSAFE_componentWillMount () {
    document.title = '熊博园-我的项目'
    this.getProjectList()
  }

  getProjectList = () => {
    let id = 2
    if (this.state.userInfo.id) {
      id = this.state.userInfo.id
    }
    Fetch.get(`project/findAll?id=${id}`).then((res) => {
			if (res.code === 0) {
        let isEmpty = false
        if (res.data.length === 0) {
          isEmpty = true
        }
        this.setState({
          list: res.data,
          isEmpty,
          spinLoading: false
        })
      }
    })
  }

  toPage = (url) => {
    window.open(url, '_target')
  }

  render() {
    let { list, spinLoading, isEmpty } = this.state
    return (
      <Spin spinning={spinLoading} size="large">
        {
          spinLoading && <div style={{width: '100%', minHeight: 400}}></div>
        }
        <div className="frontend-project">
          {
            list.length !== 0 ? (
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
            ) : (<Fragment>
              {
                isEmpty && <Empty style={{padding: '100px 0', color: 'rgb(153, 153, 153)'}} image={noResult} description={'啊哦，您还没有项目哟！'}/>
              }
            </Fragment>)
          }
          
        </div>
      </Spin>
    );
  }
}

export default Project;