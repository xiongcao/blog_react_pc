import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom'
import { Comment, Avatar, Icon, Tooltip, Button, Input, message } from 'antd'
import moment from 'moment'
import * as Fetch from '@/libs/fetch';
import { oss } from '@/libs/publicPath'
import store from '@/libs/store'
import './index.less'

const { TextArea } = Input

class ExampleComment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: props.item,
      user: store.getState().user,
      show: false, // 是否显示评论
      commentTxt: '',
      essayData: props.essayData
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      item: props.item
    })
  }

  handleLike = (id) => {
    let { user } = this.state
    if (!user.id) {
      this.props.showLoginModal()
      return
    }
    Fetch.post(`comment/addLikes`, {params: {id}}).then((res) => {
			if (res.code === 0) {
        this.props.onSuccess()
      }
    })
  }

  handleDislike = (id) => {
    let { user } = this.state
    if (!user.id) {
      this.props.showLoginModal()
      return
    }
    Fetch.post(`comment/addDislikes`, {params: {id}}).then((res) => {
			if (res.code === 0) {
        this.props.onSuccess()
      }
    })
  }

  changeCommentTxt = (e) => {
    e.persist()
    this.setState({
      commentTxt: e.target.value
    })
  }

  sendComment = (pid) => {
    let { commentTxt, essayData, user } = this.state
    if (!user.id) {
      this.props.showLoginModal()
      return
    }
    let data = {
      pid,
      essayId: essayData.id,
      toUserId: essayData.userId,
      content: commentTxt
    }
    this.saveComment(data)
  }

  saveComment = (data) => {
    Fetch.post(`comment/save`, data).then((res) => {
			if (res.code === 0) {
        message.success('评论成功')
        this.setState({
          commentTxt: '',
          show: false
        }, () => {
          this.props.onSuccess()
        });
      }
    })
  }

  deleteComment = (id) => {
    Fetch.post(`comment/updateStatus/${id}/0`).then((res) => {
			if (res.code === 0) {
        message.success('删除成功')
        this.props.onSuccess()
      }
    })
  }

  toggleComment = () => {
    let { user } = this.state
    if (!user.id) {
      this.props.showLoginModal()
      return
    }
    this.setState(state => {
      return {
        show: !state.show
      }
    })
  }

  render() {
    let { item, user, show, commentTxt } = this.state
    let { children } = this.props
    return (
      <Comment
        actions={[
          <span key="comment-basic-like">
            <Tooltip title="点赞">
              <Icon
                type="like"
                theme={(item.commentLikeStatus === 1 && user.id) ? 'filled' : 'outlined'}
                onClick={this.handleLike.bind(this, item.id)}
              />
            </Tooltip>
            <span style={{ paddingLeft: 8, cursor: 'auto' }}>{item.likes}</span>
          </span>,
          <span key=' key="comment-basic-dislike"'>
            <Tooltip title="踩踩">
              <Icon
                type="dislike"
                theme={(item.commentLikeStatus === 0 && user.id) ? 'filled' : 'outlined'}
                onClick={this.handleDislike.bind(this, item.id)}
              />
            </Tooltip>
            <span style={{ paddingLeft: 8, cursor: 'auto' }}>{item.dislikes}</span>
          </span>,
          <span key="comment-basic-reply-to" onClick={this.toggleComment.bind()}>{show ? '取消回复' : '回复'}</span>,
          <span className="delete" onClick={this.deleteComment.bind(this, item.id)}>{user && user.id === item.user.id ? '删除' : ''}</span>,
          <div className="comment-input">
            {
              show && (
                <Fragment>
                  <TextArea value={commentTxt} onChange={this.changeCommentTxt.bind(this)} placeholder={'回复' + (item.user.nickname || item.user.name) + '：'} autosize={{ minRows: 1, maxRows: 3 }} />
                  <Button type="primary" onClick={this.sendComment.bind(this, item.pid === 0 ? item.id : item.pid)}>发布</Button>
                </Fragment>
              )
            }
          </div>
        ]}
        datetime={
          <Tooltip title={moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(item.createdDate).fromNow()}</span>
          </Tooltip>
        }
        author={item.pid === 0 ? 
          (<a className="username">{item.user.nickname || item.user.name}</a>) : 
          (<><a className="username">{item.user.nickname || item.user.name}</a><span>&nbsp;&nbsp;回复&nbsp;&nbsp;</span><a className="username">{item.toUser.nickname || item.toUser.name}</a></>)}
        avatar={<Avatar src={oss + item.user.avatar} alt="作者" />}
        content={ item.content }
      >
        {children}
      </Comment>
    );
  }
}

export default withRouter(ExampleComment);