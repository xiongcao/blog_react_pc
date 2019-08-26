import React, { Component } from 'react';
import { Menu, Upload, Avatar, Icon, Modal, Form, Input, Button, DatePicker, Radio } from 'antd'
import * as Fetch from '@/libs/fetch';
import store from '@/libs/store'
import { oss } from '@/libs/publicPath.js'
import moment from 'moment'
import UploadImage from '@/components/UploadImage'
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
      visible: false
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

  handleOk = e => {
    this.setState({
      visible: false
    })
  };

  handleCancel = e => {
    this.setState({
      visible: false
    })
  };


  backList = (type) => {
    this.setState({
      type: ''
    })
  }

  renderContentHtml = () => {
    let { userInfo, collectList, followList, typeList } = this.state
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
                  <Avatar size={100} src={oss + userInfo.avatar}/>
                  <p className="modify">修改头像</p>
                </Upload>
              </div>
              <div className="right-info">
                <div className="top">
                  <span className="ID">ID: {userInfo.id}</span>
                  <span className="edit" onClick={() => {this.setState({visible: true})}}>修改资料</span>
                </div>
                <div className="number">
                  <span>关注：{userInfo.follow_number}</span>
                  <span>粉丝：{userInfo.fans_number}</span>
                </div>
                <div className="nickname">昵称：{userInfo.nickname}</div>
                <div>座右铭：{userInfo.motto}</div>
                <div>性别：{userInfo.gender === 0 ? '男' : (userInfo === 1 ? '女' : '未知')}</div>
                <div>生日：{userInfo.birthday}</div>
                <div>地区：湖北省 武汉市</div>
                <div>行业：互联网</div>
                <div>职位：web开发</div>
                <div>简介：{userInfo.introduce || '-'}</div>
              </div>
            </div>
          </div>
        )
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

  handleSubmit = (e) => {
		e.preventDefault()
		this.props.form.validateFieldsAndScroll((err, values) => {
			values.birthday = values.birthday && values.birthday.format('YYYY-MM-DD')
			values = Object.assign({}, this.state.userInfo, values)
      if (!err) {
				// Fetch.post(`user/save`, values).then((res) => {
				// 	if (res.code === 0) {
				// 		message.success('保存成功')
				// 		this.props.dispatch(heandlLogin(values))
				// 	}
				// });
      }
    });
  }
  
  uploadSuccess = (avatar) => {
		let user = Object.assign({}, this.state.userInfo, {avatar})
		this.setState({user})
		this.props.form.setFieldsValue({
			avatar
		})
	}

  renderUserModal = () => {
    let { userInfo, visible } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 20 }
      }
		};
		const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 2,
          offset: 4
        }
      }
		};
		const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title='修改个人信息'
        className="user-modal"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="头像">
            {
              getFieldDecorator('avatar')(
                <>
                  <Input hidden/>
                  <UploadImage imagePath={userInfo.avatar} folder="avatar" uploadSuccess={this.uploadSuccess.bind()} />
                </>
              )
            }
          </Form.Item>
          <Form.Item label="用户名">
            {
              getFieldDecorator('name', {initialValue: userInfo.name})(<Input/>)
            }
          </Form.Item>
          <Form.Item label="昵称">
          {
            getFieldDecorator('nickname')(<Input/>)
          }
          </Form.Item>
          <Form.Item label="座右铭">
          {
            getFieldDecorator('motto')(<Input/>)
          }
          </Form.Item>
          <Form.Item label="行业">
          {
            getFieldDecorator('industry')(<Input/>)
          }
          </Form.Item>
          <Form.Item label="职位">
          {
            getFieldDecorator('position')(<Input/>)
          }
          </Form.Item>
          <Form.Item label="生日">
            {
              getFieldDecorator('birthday', {initialValue: moment(userInfo.birthday)})(
                <DatePicker/>
              )
            }
          </Form.Item>
          <Form.Item label="性别">
            {
              getFieldDecorator('gender', {initialValue: userInfo.gender})(
                <Radio.Group>
                  <Radio value={0}>男</Radio>
                  <Radio value={1}>女</Radio>
                  <Radio value={2}>未知</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
          <Form.Item label="个人简介">
            {
              getFieldDecorator('introduce')(<Input.TextArea rows={2}/>)
            }
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    )
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
          {this.renderUserModal()}
        </section>
      </div>
    );
  }
}

export default Form.create({ name: 'userInfo' })(Personal);