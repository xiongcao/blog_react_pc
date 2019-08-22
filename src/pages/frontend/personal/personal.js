import React, { Component } from 'react';
import { Menu, Upload, Avatar } from 'antd'

import './index.less'

class Personal extends Component {
  constructor(props){
    super(props)
    this.state = {
      current: 'follow'
    }
  }

  handleNavClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  renderContentHtml = () => {
    let nodeHtml
    switch (this.state.current) {
      case "personal":
        nodeHtml = (
          <div className="personal">
            <p className="title">个人资料</p>
            <div className="userInfo">
              <div className="avatar">
                <Upload>
                  <Avatar size={100}/>
                  <p className="modify">修改头像</p>
                </Upload>
              </div>
              <div className="right-info">
                <div className="top">
                  <span className="ID">ID: qq_3432523</span>
                  <span className="edit">修改资料</span>
                </div>
                <div className="number">
                  <span>关注：7</span>
                  <span>粉丝：7</span>
                </div>
                <div className="nickname">昵称：小熊</div>
                <div>座右铭：乘风破浪会有时，直挂云帆济沧海</div>
                <div>性别：男</div>
                <div>生日：1995-08-25</div>
                <div>地区：湖北省 武汉市</div>
                <div>行业：互联网</div>
                <div>职位：web开发</div>
                <div>简介：。。。。</div>
              </div>
            </div>
          </div>
        )
        break;
      case "conllect":
        nodeHtml = (
          <div className="conllect">conllect</div>
        )
        break
        case "follow":
        nodeHtml = (
          <div className="follow">
            <div className="header">
              <span className="title">我的关注</span>
              <span className="number">共7人</span>
            </div>
            {
              [1,2,3,4,5,6,7,8,9].map((o) => {
                return (
                  <div className="follow-itme">
                    <div className="avatar">
                      <Avatar size={50}/>
                    </div>
                    <div className="nickname">东方不败</div>
                    <div className="btn">
                      <span className="follow-btn">关注</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        )
        break
        case "fans":
          nodeHtml = (
            <div className="follow">
              <div className="header">
                <span className="title">我的关注</span>
                <span className="number">共7人</span>
              </div>
              {
                [1,2,3,4,5,6,7,8,9].map((o) => {
                  return (
                    <div className="follow-itme">
                      <div className="avatar">
                        <Avatar size={50}/>
                      </div>
                      <div className="nickname">东方不败</div>
                      <div className="btn">
                        <span className="cancel">取消关注</span>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          )
        break
        case "category":
        nodeHtml = (
          <div className="category">category</div>
        )
        break
        case "tag":
        nodeHtml = (
          <div className="tag">tag</div>
        )
        break
    }
    return nodeHtml
  }

  render() {
    let { current } = this.state
    return (
      <div className="frntend-personal">
        <section>
          <div className="sidebar">
            <Menu className="frontend-user-menu" 
              onClick={this.handleNavClick} 
              defaultSelectedKeys={[current]}>
              <Menu.Item key="personal">
                <span>个人资料</span>
              </Menu.Item>
              <Menu.Item key="conllect">
                <span>我的收藏</span>
              </Menu.Item>
              <Menu.Item key="follow">
                <span>我的关注</span>
              </Menu.Item>
              <Menu.Item key="fans">
                <span>我的粉丝</span>
              </Menu.Item>
              <Menu.Item key="category">
                <span>我的分类</span>
              </Menu.Item>
              <Menu.Item key="tag">
                <span>我的标签</span>
              </Menu.Item>
            </Menu>
          </div>
          <div className="content">
            {this.renderContentHtml()}
          </div>
        </section>
      </div>
    );
  }
}

export default Personal;