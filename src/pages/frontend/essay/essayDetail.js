import React, { Component, Fragment } from 'react'
import { Icon, Modal, Badge, Spin, Input, Button, message, Tooltip } from 'antd';
import { LoginModal, ExampleComment } from '@/components'
import * as Fetch from '@/libs/fetch';
import  fetchJsonp  from  'fetch-jsonp'
import { oss } from '@/libs/publicPath'

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'

import marked from 'marked';
import { MKTitles } from '@/components/index'
import getMKTitles from '@/utils/mkTitles'

import store from '@/libs/store'

import '@/assets/styles/markdown.less'
import './index.less'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1548735_d1rrjzq1qc.js'
})

class EssayDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      user: store.getState().user,
      essayData: {
        user: {}
      },
      navList: [],
      renderer: {},
      mkTitlesLen: 0,
      highlightIndex: 0,
      markdownHtml: '',
      visible: false,
      modalImg: '',
      loginVisible: false,
      star: {},
      collect: {},
      spinLoading: true,
      commentTxt: '', // 输入框的值
      commentCount: 0, // 评论总数
      shortUrl: '' // 短链接
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.match.params.id && props.match.params.id !== this.state.id) {
      this.setState({
        id: props.match.params.id
      }, () => {
        this.getEssayDetail()
      })
    }
  }

  UNSAFE_componentWillMount () {
    if (this.props.location.pathname.indexOf('about') !== -1) {
      this.setState({
        id: 0
      }, () => {
        this.getEssayDetail()
      })
    } else {
      document.getElementsByTagName("html")[0].style.overflowY = 'inherit'
      this.getEssayDetail()
    }
    window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
  }

  componentWillUnmount() { // 一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('scroll', this.handleScroll.bind(this)) 
  }

  handleClickEvent = () => {
    let imgDomList = document.getElementsByClassName("markdown-img")
    for (let i = 0;i < imgDomList.length; i++) {
      let img = imgDomList[i]
      img.onclick = () => {
        this.setState({
          visible: true,
          modalImg: img.src
        })
      }
    }
  }

  handleCancel = e => {
    let htmlDom = document.getElementsByTagName("html")[0]
    this.setState({
      visible: false,
      loginVisible: false
    })
  }

  handleOk = e => {
    this.setState({
      loginVisible: e,
    });
  };


  handleLike = () => {
    if (!this.state.user.id) {
      this.setState({
        loginVisible: true,
      });
      return
    }
    this.saveLike()
  }

  onClickComment = () => {
    let titleDom = document.getElementById("comments")
    document.scrollingElement.scrollTop = titleDom.offsetTop - 100
  }

  handleStar = () => {
    if (!this.state.user.id) {
      this.setState({
        loginVisible: true,
      });
      return
    }
    this.saveCollect()
  }

  handleForward = () => {
    if (!this.state.user.id) {
      this.setState({
        loginVisible: true,
      });
      return
    } else if (this.state.user.id === this.state.essayData.userId) {
      message.error('无法转发自己的文章')
      return
    } else if (this.state.essayData.forward) {
      message.error('你已转发过此文章')
      return
    }
    this.forwardEssay()
  }

  forwardEssay = () => {
    Fetch.post(`essay/forward/${this.state.essayData.id}`).then((res) => {
			if (res.code === 0) {
       message.success('转发成功')
       let essayData = Object.assign({}, this.state.essayData, { forward: true })
       this.setState({
         essayData
       })
      }
    })
  }

  handleShare = (type) => {
    let { essayData } = this.state
    let content = essayData.title
    let title = document.title
    let url = document.location.href
    let picurl = essayData.cover ? (oss + essayData.cover) : (oss + essayData.categorys[0].cover)
    if (type == 'qqzone') {
      let shareqqzonestring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary='+content+'&title='+title+'&url='+url+'&pics='+picurl;
      window.open(shareqqzonestring,'newwindow','height=400,width=400,top=100,left=100'); 
    } else if (type === 'sina') {
      let sharesinastring = 'http://v.t.sina.com.cn/share/share.php?title='+content+'&url='+url+'&content=utf-8&sourceUrl='+url+'&pic='+picurl;
      window.open(sharesinastring,'newwindow','height=400,width=400,top=100,left=100'); 
    } else if (type === 'qq') {
      let sharesinastring = 'https://connect.qq.com/widget/shareqq/iframe_index.html?url='+url+'&title='+title+'&pics='+picurl+'&summary='+content
      window.open(sharesinastring,'newwindow','height=560,width=720,top=100,left=100'); 
    }
  }

  saveCollect () {
    let data = { essayId: this.state.essayData.id }
    let collectCount = this.state.essayData.collectCount
    if (this.state.collect.id) {
      if (this.state.collect.status === 1) {  // 取消点赞
        data.status = 0
        collectCount -= 1
      } else {
        data.status = 1
        collectCount += 1
      }
      data = Object.assign({}, this.state.collect, data)
    } else {
      data.status = 1
      collectCount += 1
    }
    Fetch.post(`collect/save`, data).then((res) => {
			if (res.code === 0) {
        let collect = Object.assign({}, this.state.collect, res.data)
        let essayData = Object.assign({}, this.state.essayData, { collectCount })
        this.setState({
          essayData, collect
        })
      }
    })
  }

  saveLike () {
    let data = { essayId: this.state.essayData.id }
    let starCount = this.state.essayData.starCount
    if (this.state.star.id) {
      if (this.state.star.status === 1) {  // 取消点赞
        data.status = 0
        starCount -= 1
      } else {
        data.status = 1
        starCount += 1
      }
      data = Object.assign({}, this.state.star, data)
    } else {
      data.status = 1
      starCount += 1
    }
    Fetch.post(`star/save`, data).then((res) => {
			if (res.code === 0) {
        let star = Object.assign({}, this.state.star, res.data)
        let essayData = Object.assign({}, this.state.essayData, { starCount })
        this.setState({
          essayData, star
        })
      }
    })
  }

  showLoginModal = () => {
    this.setState({
      loginVisible: true,
    });
  }

  commentSuccess = () => {
    // 查询评论即可
    this.getCommentList()
  }

  getCommentList = () => {
    let id = this.state.id
    Fetch.get(`comment/findAllByEssayId/${id}`).then((res) => {
			if (res.code === 0) {
        let comments = this.handleComments(res.data)
        this.setState({
          comments,
          commentCount: res.data.length
        });
      }
    })
  }

  changeCommentTxt = (e) => {
    e.persist()
    this.setState({
      commentTxt: e.target.value
    })
  }

  sendComment = () => {
    let { commentTxt, id, essayData, user } = this.state
    if (!user.id) {
      this.setState({
        loginVisible: true,
      });
      return
    }
    let data = {
      pid: 0,
      essayId: id,
      toUserId: essayData.userId,
      content: commentTxt
    }
    Fetch.post(`comment/save`, data).then((res) => {
			if (res.code === 0) {
        message.success('评论成功')
        this.setState({
          commentTxt: ''
        }, () => {
          this.getEssayDetail()
        });
      }
    })
  }

  getEssayDetail () {
    this.getShortUrl()
    let data = {}
    if (this.state.id) {
      data.id = this.state.id
    } else {
      data.status = 4
    }
    Fetch.get(`essay/detail`, data).then((res) => {
			if (res.code === 0) {
        document.title = '熊博园-' + res.data.title
        this.setMarkdwonTitle(res)
      } else {
        this.setState({
          spinLoading: false
        })
      }
    })
  }

  getShortUrl = () => {
    // let url = "http://api.t.sina.com.cn/short_url/shorten.json"
    // let app_key = "5890e1a4d609373c0b1387d2fa75ab05" // app_key无效可能会导致无反应；
    // let cmd = url + "?source=" + app_key + "&url_long=" + location.href
    let url = 'http://mrw.so/api.htm?url=urlencode("'+location.href+'")&key=5de9d26a9f9594418772bee9@e82544a854104fd694346ae8bf0cfd27&format=json'
    console.log(url, 'url')
    fetch(url, {
      method: 'GET'
    }).then(res => {
      console.log(res.json(), 'res')
      return res;
    }).then(res => {
      console.log(res, 'request')
    }).catch(err => {
      console.log(err)
    })
  }

  setMarkdwonTitle = (res) => {
    const renderer = new marked.Renderer()
    marked.setOptions({
      highlight: function (code, lang) {
        return hljs.highlightAuto(code).value
      }
    })
    let navList = getMKTitles(res.data.content)
    this.setRenderer(renderer)
    let markdownHtml = marked(res.data.content || ' ', { renderer: renderer })
    markdownHtml = markdownHtml.replace(/<img/g, '<img class="markdown-img"')
    let comments = this.handleComments(res.data.commentDTOS)
    this.setState({
      navList,
      essayData: res.data,
      comments,
      commentCount: res.data.commentDTOS.length,
      spinLoading: false,
      star: res.data.star || {},
      collect: res.data.collect || {},
      markdownHtml,
      renderer
    }, () => {
      this.handleClickEvent()
    })
  }

  handleComments (comments) {
    let pIdList = comments.filter(o => {
      return o.pid === 0
    })
    let otherList = comments.filter(o => {
      return o.pid !== 0
    })
    pIdList.forEach(obj => {
      otherList.forEach(o => {
        if (o.pid === obj.id) {
          if (!obj.children) {
            obj.children = []
          }
          obj.children.push(o)
        }
      })
    })
    return pIdList
  }

  setRenderer = (renderer) => {
    let index = -1
    renderer.heading = (text, level) => {
      index ++ 
      this.state.mkTitlesLen = index
      return `<h${level} id="titleAnchor${index}">${text}</h${level}>`
    }
  }

  handleScroll = () => {
    document.getElementsByTagName("html")[0].style.overflowY = 'inherit'
    const idPrefix = 'titleAnchor'
    let list = []
    for (let i = 0; i <= this.state.mkTitlesLen; i++) {
      let dom = document.getElementById(`${idPrefix}${i}`)
      let domTitle = document.querySelector(`span[name="titleAnchor${i}"]`)
      list.push({
        y: dom && dom.getBoundingClientRect().top, // 利用dom.getBoundingClientRect().top可以拿到元素相对于显示器的动态y轴坐标
        index: i,
        domTitle
      })
    }
    let readingVO = []
    readingVO = list.filter(item => item.y < 100).sort((a, b) => {
      return a.y - b.y
    })
    let readingObj = {}
    if (readingVO.length === 0) {
      readingObj = list[0]
    } else {
      readingObj = readingVO[readingVO.length - 1]
    }
    if (readingObj) {
      let domTitle = document.querySelector(`span[name="titleAnchor${readingObj.index || 0}"]`)
      let titles = document.getElementsByClassName("nav-list-a")
      for (let i = 0; i < titles.length; i++) {
        titles[i].classList.remove("active")
      }
      domTitle.classList.add("active")
    }
  }

  goToEssayDetail = (id) => {
    this.props.history.push({pathname: '/frontend/essayDetail/' + id})
  }

  render () {
    let { essayData, navList, highlightIndex, markdownHtml, visible, modalImg, loginVisible, star, collect, spinLoading, comments, commentTxt, commentCount, user } = this.state
    return (
      <Spin spinning={spinLoading} size="large">
        <div className="frontend-essayDetail">
          <article>
            <div className="left">
              <Tooltip placement="topLeft" title="点赞">
                <div className="item" onClick={this.handleLike.bind()}>
                  <Icon type="like" theme="filled" className={ (star.status === 1 && user.id) ? 'like-active' : ''}/>
                  <Badge count={essayData.starCount} style={ (star.status === 1 && user.id) ? { backgroundColor: '#74ca46' } : { backgroundColor: '#b2bac2' }} overflowCount={999}/>
                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title="评论">
                <div className="item" onClick={this.onClickComment.bind()}>
                  <Icon type="message" theme="filled" />
                  <Badge count={commentCount} style={{ backgroundColor: '#b2bac2' }} overflowCount={999}/>
                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title="收藏">
                <div className="item" onClick={this.handleStar.bind()}>
                  <Icon type="star" theme="filled" className={(collect.status === 1 && user.id) ? 'like-active' : ''}/>
                  <Badge count={essayData.collectCount} style={(collect.status === 1 && user.id) ? { backgroundColor: '#74ca46' } : { backgroundColor: '#b2bac2' }} overflowCount={999}/>
                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title="转发">
                <div className="item" onClick={this.handleForward.bind()}>
                  {/* <Icon type="share-alt" className={(essayData.forward && user.id) ? 'like-active' : ''}/> */}
                  <IconFont type="icon-fenxiang"/>
                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title="QQ">
                <div className="item" onClick={this.handleShare.bind(this, 'qq')}>
                  <Icon type="qq" style={{fontSize: '18px'}}/>
                </div>
              </Tooltip>
              <Tooltip placement="topLeft" title="QQ Zone">
              <div className="item" onClick={this.handleShare.bind(this, 'qqzone')}>
                <IconFont type="icon-qq-zone" style={{fontSize: '18px'}}/>
              </div>
              </Tooltip>
              <Tooltip placement="topLeft" title="weibo">
                <div className="item" onClick={this.handleShare.bind(this, 'sina')}>
                  <Icon type="weibo-circle" style={{fontSize: '18px'}}/>
                </div>
              </Tooltip>
            </div>
            <div className="content">
              <h1>{essayData.title}</h1>
              <div className="annotation">
                <span><Icon type="calendar"/> 发表于 {essayData.createdDate}</span> |
                <span><Icon type="folder"/> 分类于 {essayData.categorys && essayData.categorys[0].name}</span> |
                <span><Icon type="eye"/> 阅读次数 {essayData.browseNumber}</span> |
                <span><Icon type="file-word"/> 字数统计 {essayData.content && essayData.content.length}字</span> |
                <span><Icon type="clock-circle"/> 阅读时长 {essayData.content && parseInt(essayData.content.length/500)}分钟</span>
              </div>
              <section>
                {
                  essayData.user.avatar ? (
                    <img src={oss + essayData.user.avatar}/>
                  ) : (
                    <img src={require('@/assets/img/defaultComm.png')}/>
                  )
                }
                <div className="desc">
                  <div className="username">{ essayData.user.nickname ? essayData.user.nickname : essayData.user.name }</div>
                  <div className="position">{essayData.user.position}</div>
                </div>
                <div className="tags">
                  <Icon type="tags" style={{fontSize: 16, verticalAlign: 'middle'}} />
                  {
                    essayData.tags && essayData.tags.map((tag, i) => (
                      <Fragment key={i}>
                        <span className="tagName">{tag.name}</span><span className="split">|</span>
                      </Fragment>
                    ))
                  }
                </div>
              </section>
              <div className="cover">
                {
                  essayData.cover ? (
                    <img src={oss + essayData.cover}/>
                  ) : (
                    essayData.categorys && essayData.categorys[0].cover ? (
                      <img src={oss + essayData.categorys[0].cover}/>
                    ) : (
                      <></>
                    )
                  )
                }
              </div>
              <div className="markdown" dangerouslySetInnerHTML={{__html: markdownHtml}}></div>
              <div className="post-nav">
                <div className="post-nav-pre">
                  {
                    essayData.preEssay && essayData.preEssay.id !== 0 ? (
                      <>
                        <Icon type="left" onClick={this.goToEssayDetail.bind(this, essayData.preEssay.id)}/>
                        <span className="pre" onClick={this.goToEssayDetail.bind(this, essayData.preEssay.id)}>{essayData.preEssay.title}</span>
                      </>
                    ) : (<></>)
                  }
                </div>
                <div className="post-nav-next">
                  {
                    essayData.nextEssay ? (
                      <>
                        <span className="next" onClick={this.goToEssayDetail.bind(this, essayData.nextEssay.id)}>{essayData.nextEssay.title}</span>
                        <Icon type="right" onClick={this.goToEssayDetail.bind(this, essayData.nextEssay.id)}/>
                      </>
                    ) : (<></>)
                  }
                </div>
              </div>
              <div className="comments" id="comments">
                <div className="comments-author">
                <Input.TextArea
                  placeholder="写下你的评论..."
                  autosize={{ minRows: 2, maxRows: 4 }}
                  value={commentTxt}
                  onChange={this.changeCommentTxt.bind(this)}
                />
                <Button type="primary" onClick={this.sendComment.bind()}>发布</Button>
                </div>
              {
                comments && comments.map((list, i) =>
                  <ExampleComment key={i} item={list} essayData={essayData} showLoginModal={this.showLoginModal.bind()} onSuccess={this.commentSuccess.bind()}>
                    {
                      list.children && list.children.map((o, j) => 
                        <ExampleComment key={j} item={o} essayData={essayData} showLoginModal={this.showLoginModal.bind()} onSuccess={this.commentSuccess.bind()}/>
                      )
                    }
                  </ExampleComment>
                )
              }
              </div>
            </div>
            <div className="right-nav">
              <MKTitles list={navList.nav} highlightIndex={highlightIndex}/>
            </div>
            <LoginModal visible={loginVisible} onOk={this.handleOk} onCancel={this.handleCancel}/>
            <Modal
              width="max-content"
              visible={visible}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img src={modalImg} style={{width: '100%'}}/>
            </Modal>
          </article>
        </div>
      </Spin>
    )
  }
}

export default EssayDetail