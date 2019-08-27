import React, { Component } from 'react';
import { Menu, Avatar, Icon, Modal } from 'antd'
import * as Fetch from '@/libs/fetch';
import { oss } from '@/libs/publicPath.js'
import moment from 'moment'
import User from './edit'
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
      collectList: [],
      followList: [],
      essayList: [],
      typeList: [], // 标签和类型的数据集合
      typeName: '', // 标签或者类型的名称， 用于在自页面头部显示
    }
  }

  componentWillMount () {
    this.initData()
  }

  initData () {
    switch(this.state.current) {
      case "personal" :
        this.getUserInfo()
        break
      case "collect" :
        this.getConllectListData()
      break
      case "follow" :
        this.getFollowtListData(1)
      break
      case "fans" :
        this.getFollowtListData(2)
      break
      case "category" :
        this.getCategoryListData()
      break
      case "tag" :
        this.getTagListData()
      break
    }
  }

  getUserInfo () {
    Fetch.get(`user/findAdmin`).then((res) => {
      if (res.code === 0) {
        this.setState(() => ({
          userInfo: res.data
        }))
      }
    })
  }

  getConllectListData () {
    Fetch.get(`collect/findAll`).then((res) => {
      if (res.code === 0) {
        this.setState(() => ({
          collectList: res.data
        }))
      }
    })
  }

  getFollowtListData (status) {
    Fetch.get(`follow/followList/${status}`).then((res) => {
      if (res.code === 0) {
        this.setState(() => ({
          followList: res.data.content
        }))
      }
    })
  }

  getCategoryListData () {
    Fetch.get(`category/findCategoryEssayNumber`).then((res) => {
      if (res.code === 0) {
        this.setState(() => ({
          typeList: res.data
        }))
      }
    })
  }

  getTagListData () {
    Fetch.get(`tag/findTagEssayNumber`).then((res) => {
      if (res.code === 0) {
        this.setState(() => ({
          typeList: res.data
        }))
      }
    })
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
    }, () => {
      this.initData()
    });
  }

  goToArchive = (type, id, name) => {
    if (type === 'tag') {
      this.setState({
        type,
        typeName: name,
        tagId: id
      }, () => {
        this.getArchiveList()
      })
    } else {
      this.setState({
        type,
        typeName: name,
        categoryId: id
      }, () => {
        this.getArchiveList()
      })
    }
  }

  goToEssayDetail = (id) => {
    this.props.history.push('/frontend/essayDetail/' + id)
  }

  cancelCollect = (id) => {
    Fetch.post(`collect/updateStatus/${id}/0`).then((res) => {
      if (res.code === 0) {
        this.getConllectListData()
      }
    })
  }

  handleFansFollow = (userId) => {
    Fetch.post(`follow/save`, {
      followUserId: userId
    }).then((res) => {
      if (res.code === 0) {
        this.getFollowtListData(2)
      }
    })
  }

  handleCancelFollow = (id, type) => {
    Modal.confirm({
      title: '提示',
      content: '不再关注此人？',
      okText: '不再关注',
      centered: true,
      onOk: () => {
        Fetch.post(`follow/unFollow/${id}`).then((res) => {
          if (res.code === 0) {
            this.getFollowtListData(type)
          }
        })
      }
    })
  }

  backList = (type) => {
    this.setState({
      type: ''
    })
  }

  renderContentHtml = () => {
    let { collectList, followList, typeList, userInfo } = this.state
    let nodeHtml
    let current = this.state.current
    switch (current) {
      case "personal":
        console.log(userInfo, 'userinfo')
        nodeHtml = (<User userInfo={userInfo}/>)
        break;
      case "collect":
        nodeHtml = (
          <div className="collect">
            <div className="header">
              <span className="title">我的收藏</span>
              <span className="number">共{collectList.length}个收藏</span>
            </div>
            {
              collectList.length !== 0 ? collectList.map((o) => {
                return (
                  <div className="collect-item" key={o.id}>
                    <div className="left">
                      <div className="title" onClick={this.goToEssayDetail.bind(this, o.essayId)}>{o.title}</div>
                      <div className="left-btm">
                        <span className="author">作者：{o.name}</span>
                        <span className="date">收藏日期：{moment(o.createdDate).format("YYYY-MM-DD")}</span>
                      </div>
                    </div>
                    <div className="btn">
                      <span className="cancel" onClick={this.cancelCollect.bind(this, o.id)}>取消收藏</span>
                    </div>
                  </div>
                )
              }) : (
                (<div className="empty"><img src={require('@/assets/img/noResult.png')}/></div>)
              )
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
              <span className="number">共{followList.length}人</span>
            </div>
            {
              followList.length !== 0 ? followList.map((o) => {
                return (
                  <div className="follow-item" key={o.id}>
                    <div className="avatar">
                      <Avatar size={50} src={oss + o.avatar}/>
                    </div>
                    <div className="nickname">{o.name}</div>
                    <div className="btn">
                      {
                        current === 'fans' ? (
                          <>{
                            o.mutualWatch ? (<span className="follow-fans-btn" onClick={this.handleCancelFollow.bind(this, o.id, 2)}>相互关注</span>) : (<span className="follow-btn" onClick={this.handleFansFollow.bind(this, o.followUserId)}>回粉</span>)
                          }</>
                        ) : (
                          <>{
                            o.mutualWatch ? (<span className="follow-fans-btn" onClick={this.handleCancelFollow.bind(this, o.id, 1)}>相互关注</span>) : (<span className="cancel" onClick={this.handleCancelFollow.bind(this, o.id, 1)}>取消关注</span>)
                          }</>
                        )
                      }
                    </div>
                  </div>
                )
              }) : (<div className="empty"><img src={require('@/assets/img/noResult.png')}/></div>)
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
                typeList.length !== 0 ? typeList.map((o) => {
                  return (
                    <div className="category-item" key={o.id} onClick={this.goToArchive.bind(this, current, o.id, o.name)}>
                      <div className="name">{o.name}</div>
                      <div className="count">共{o.num}篇文章</div>
                      <Icon type="right"/>
                    </div>
                  )
                }) : (<div className="empty"><img src={require('@/assets/img/noResult.png')}/></div>)
              }
          </div>
        )
        break
    }
    return nodeHtml
  }

  

  render() {
    let { current, type, essayList, typeName } = this.state
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
              <Menu.Item key="collect">
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
                    <span className="number"><span>{typeName} 标签，</span>共{essayList.length}篇文章</span>
                  </div>
                  {
                    essayList.map((item) => {
                      return (
                        <div className="essay-card" key={item.id}>
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
                    <span className="number">{typeName} 分类，共{essayList.length}篇文章</span>
                  </div>
                  {
                    essayList.map((item) => {
                      return (
                        <div className="essay-card" key={item.id} onClick={this.goToEssayDetail.bind(this, item.id)}>
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