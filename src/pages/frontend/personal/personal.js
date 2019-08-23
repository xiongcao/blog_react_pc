import React, { Component } from 'react';
import { Menu, Upload, Avatar, Icon, Timeline } from 'antd'
import * as Fetch from '@/libs/fetch';

import './index.less'

class Personal extends Component {
  constructor(props){
    super(props)
    this.state = {
      current: this.props.match.params.id,  // 当前路由参数，决定左侧导航条高亮
      tagId: '',
      categoryId: '',
      type: '', // 当前页是标签子页面
      userInfo: {},
      conllectList: [],
      followList: [],
      essayList: []
    }
    this.getArchiveList()
  }

  componentWillMount () {
    switch(this.state.current) {
      case "conllect" :
        this.getConllectListData()
      break
      case "follow" :
        this.getFollowtListData()
      break
      case "fans" :
        this.getConllectListData()
      break
      case "category" :
        this.getCategoryListData()
      break
      case "tag" :
        this.getTagListData()
      break
    }
  }

  getConllectListData () {

  }

  getFollowtListData () {

  }

  getCategoryListData () {

  }

  getTagListData () {

  }


  getArchiveList = () => {
    let { tagId, categoryId, type} = this.state
    let data = {}
    if (type === 'tag') {
      data.tagId = tagId
    } else {
      data.categoryId = categoryId
    }
    Fetch.get(`essay/findAll`, data).then((res) => {
      if (res.code === 0) {
        this.setState(() => ({
          essayList: res.data.content
        }))
      }
    })
  }

  handleNavClick = (e) => {
    this.props.history.push("/frontend/personal/" + e.key)
    this.setState({
      current: e.key,
      type: ''
    });
  }

  goToArchive = (type) => {
    this.setState({
      type
    })
  }

  goToEssayDetail = (id) => {
    this.props.history.push('/frontend/essayDetail/' + id)
  }

  backList = (type) => {
    this.setState({
      type: ''
    })
  }

  renderContentHtml = () => {
    let nodeHtml
    let current = this.state.current
    switch (current) {
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
          <div className="conllect">
            <div className="header">
              <span className="title">我的收藏</span>
              <span className="number">共7个收藏</span>
            </div>
            {
              [1,2,3,4,5,6,7,8,9].map((o) => {
                return (
                  <div className="conllect-item">
                    <div className="left">
                      <div className="title">1111111</div>
                      <div className="left-btm">
                        <span className="author">作者：小熊</span>
                        <span className="date">收藏日期：2019-08-25</span>
                      </div>
                    </div>
                    <div className="btn">
                      <span className="cancel">取消收藏</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        )
        break
        case "fans":
        case "follow":
        nodeHtml = (
          <div className="follow">
            <div className="header">
              <span className="title">我的{current === 'fans' ? '粉丝' : '关注'}</span>
              <span className="number">共7人</span>
            </div>
            {
              [1,2,3,4,5,6,7,8,9].map((o) => {
                return (
                  <div className="follow-item">
                    <div className="avatar">
                      <Avatar size={50}/>
                    </div>
                    <div className="nickname">东方不败</div>
                    <div className="btn">
                      {
                        current === 'fans' ? (
                          <span className="follow-btn">关注</span>
                        ) : (
                          <span className="cancel">取消关注</span>
                        )
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
        )
        break
        case "tag":
        case "category":
        nodeHtml = (
          <div className="category">
            <div className="header">
              <span className="title">{ current === 'tag' ? '标签' : '分类'}统计</span>
              <span className="number">共7个分类</span>
            </div>
            {
                [1,2,3,4,5,6,7,8,9].map((o) => {
                  return (
                    <div className="category-item" onClick={this.goToArchive.bind(this, current)}>
                      <div className="name">前端</div>
                      <div className="count">共3篇文章</div>
                      <Icon type="right"/>
                    </div>
                  )
                })
              }
          </div>
        )
        break
    }
    return nodeHtml
  }

  render() {
    let { current, type, essayList } = this.state
    return (
      <div className="frntend-personal">
        <section>
          <div className="sidebar">
            <Menu className="frontend-user-menu" 
              onClick={this.handleNavClick.bind(this)} 
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
            {type === '' && this.renderContentHtml()}
            {
              type === 'category' && (
                <div className="archive-category">
                  <div className="header">
                    <span className="title" onClick={this.backList.bind(this, 1)}><Icon type="left" size="small"/>返回分类列表</span>
                    <span className="number"><span>Array 标签，</span>共7篇文章</span>
                  </div>
                  {
                    essayList.map((item) => {
                      return (
                        <div className="essay-card">
                          <div className="title">{item.title}</div>
                          <div className="meta">
                            <section className="browse_number"><Icon type="eye"/> {item.browseNumber || 0}</section>
                            <section className="comment_number"><Icon type="message"/> {item.commentNumber || 0}</section>
                            <section className="follow_number"><Icon type="heart"/> {item.star || 0}</section>
                            <section className="created_time">{item.createdDate}</section>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
            {
              type === 'tag' && (
                <div className="archive-category">
                  <div className="header">
                    <span className="title" onClick={this.backList.bind(this, 1)}><Icon type="left" size="small"/>返回标签列表</span>
                    <span className="number">Array 分类，共7篇文章</span>
                  </div>
                  {
                    essayList.map((item) => {
                      return (
                        <div className="essay-card">
                          <div className="title">{item.title}</div>
                          <div className="meta">
                            <section className="browse_number"><Icon type="eye"/> {item.browseNumber || 0}</section>
                            <section className="comment_number"><Icon type="message"/> {item.commentNumber || 0}</section>
                            <section className="follow_number"><Icon type="heart"/> {item.star || 0}</section>
                            <section className="created_time">{item.createdDate}</section>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
          </div>
        </section>
      </div>
    );
  }
}

export default Personal;