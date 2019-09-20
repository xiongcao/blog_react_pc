import React, { Component } from 'react';
import * as Fetch from '@/libs/fetch';
import { Card } from 'antd'
const { Meta } = Card;

import './index.less'

class Project extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [
        // {
        //   id: 1,
        //   name: 'react-blog-pc',
        //   cover: 'https://lc-gold-cdn.xitu.io/7b5c3eb591b671749fee.png',
        //   introduction: '使用webpack4结合react16.x、react-router、react-redux并配合ant-design编写的个人主题博客PC端网站项目',
        //   url: 'https://github.com/xiongcao/blog_react_pc'
        // },
        // {
        //   id: 2,
        //   name: 'springboot_blog',
        //   cover: 'https://lc-gold-cdn.xitu.io/f77e4a02edb8b963a2c5.png',
        //   introduction: '使用springboot和mysql数据库编写的个人主题博客网站后端项目',
        //   url: 'https://github.com/xiongcao/springboot_xiongchao_blog'
        // },
        // {
        //   id: 3,
        //   name: 'durui_xcx',
        //   cover: 'https://lc-gold-cdn.xitu.io/f77e4a02edb8b963a2c5.png',
        //   introduction: '微信小程序高仿都睿纯前端项目',
        //   url: 'https://github.com/xiongcao/xcx_durui'
        // }
      ]
    }
  }

  UNSAFE_componentWillMount () {
    this.getProjectList()
  }

  getProjectList = () => {
    Fetch.get(`project/findAll`).then((res) => {
			if (res.code === 0) {
        this.setState({
          list: res.data
        })
      }
    })
  }

  toPage = (url) => {
    window.open(url, '_target')
  }

  render() {
    let { list } = this.state
    return (
      <div className="frontend-project">
        <article>
          {
            list.map((item, i) => (
              <Card
                key={i}
                hoverable={true}
                style={ (i+1)%2===0 ? {width: 300, marginBottom: 30, marginLeft: 30, marginRight: 30} : { width: 300, marginBottom: 30 }}
                cover={
                  <img height="250" src={item.cover}/>
                }
                onClick={this.toPage.bind(this, item.url)}
              >
                <Meta title={item.name} description={item.introduction}/>
              </Card>
            ))
          }
        </article>
      </div>
    );
  }
}

export default Project;