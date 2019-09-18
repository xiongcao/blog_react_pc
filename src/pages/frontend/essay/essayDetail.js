import React, { Component, Fragment } from 'react'
import { Icon, Modal, Badge } from 'antd';
import { LoginModal } from '@/components'
import * as Fetch from '@/libs/fetch';
import { oss } from '@/libs/publicPath'

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'

import marked from 'marked';
import { MKTitles } from '@/components/index'
import getMKTitles from '@/utils/mkTitles'

import store from '@/libs/store'

import '@/assets/styles/markdown.less'
import './index.less'

class EssayDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      user: store.getState().user,
      essayData: { },
      navList: [],
      renderer: {},
      mkTitlesLen: 0,
      highlightIndex: 0,
      markdownHtml: '',
      visible: false,
      modalImg: '',
      loginVisible: false,
      star: {},
      collect: {}
    };
  }

  UNSAFE_componentWillMount () {
    if (this.props.location.pathname.indexOf('about') !== -1) {
      this.setState({
        id: 0
      }, () => {
        this.getEssayDetail()
      })
    } else {
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

  handleComment = () => {
    
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

  getEssayDetail () {
    Fetch.get(`essay/detail/${this.state.id}`).then((res) => {
			if (res.code === 0) {
        this.setMarkdwonTitle(res)
      }
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
    this.setState({
      navList,
      essayData: res.data,
      star: res.data.star || {},
      collect: res.data.collect || {},
      markdownHtml,
      renderer
    }, () => {
      this.handleClickEvent()
    })
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
    const idPrefix = 'titleAnchor'
    const distance = 20
    let list = []
    for (let i = 0; i <= this.state.mkTitlesLen; i++) {
      let dom = document.getElementById(`${idPrefix}${i}`)
      let domTitle = document.querySelector(`a[href="#titleAnchor${i}"]`)
      list.push({
        y: dom && dom.getBoundingClientRect().top + 10, // 利用dom.getBoundingClientRect().top可以拿到元素相对于显示器的动态y轴坐标
        index: i,
        domTitle
      })
    }
    let readingVO = {}
    readingVO = list.filter(item => item.y > distance).sort((a, b) => {
      return a.y - b.y
    })[0] // 对所有的y值为正标的题，按y值升序排序。第一个标题就是当前处于阅读中的段落的标题。也即要高亮的标题
    if (readingVO) {
      let domTitle = document.querySelector(`a[href="#titleAnchor${readingVO.index || 0}"]`)
      let titles = document.getElementsByClassName("nav-list-a")
      for (let i = 0; i < titles.length; i++) {
        titles[i].classList.remove("active")
      }
      domTitle.classList.add("active")
    }
  }

  render () {
    let { essayData, navList, highlightIndex, markdownHtml, visible, modalImg, loginVisible, star, collect } = this.state
    return (
      <div className="frontend-essayDetail">
        <article>
          <div className="left">
            <div className="item" onClick={this.handleLike.bind()}>
              <Icon type="like" theme="filled" className={ star.status === 1 ? 'like-active' : ''}/>
              <Badge count={essayData.starCount} style={ star.status === 1 ? { backgroundColor: '#74ca46' } : { backgroundColor: '#b2bac2' }} overflowCount={999}/>
            </div>
            <div className="item" onClick={this.handleComment.bind()}>
              <Icon type="message" theme="filled" />
              <Badge count={essayData.comments && essayData.comments.length} style={{ backgroundColor: '#b2bac2' }} overflowCount={999}/>
            </div>
            <div className="item" onClick={this.handleStar.bind()}>
              <Icon type="star" theme="filled" className={ collect.status === 1 ? 'like-active' : ''}/>
              <Badge count={essayData.collectCount} style={collect.status === 1 ? { backgroundColor: '#74ca46' } : { backgroundColor: '#b2bac2' }} overflowCount={999}/>
            </div>
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
                essayData.cover ? (
                  <img src={oss + essayData.cover}/>
                ) : (
                  essayData.categorys && essayData.categorys[0].cover ? (
                    <img src={oss + essayData.categorys[0].cover}/>
                  ) : (
                    <img src="@/assets/img/defaultComm.png"/>
                  )
                )
              }
              <div className="desc">
                <div className="username">xiongchao</div>
                <div className="position">全栈攻城狮</div>
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
                    <img src="@/assets/img/defaultComm.png"/>
                  )
                )
              }
            </div>
            <div className="markdown" dangerouslySetInnerHTML={{__html: markdownHtml}}></div>
            {/* {this.commentHtml()} */}
            {/* 评论系统参考百度贴吧 */}
          </div>
          <div className="right-nav">
            <MKTitles list={navList.nav} highlightIndex={highlightIndex}/>
          </div>
          <LoginModal visible={loginVisible} onOk={this.handleOk} onCancel={this.handleCancel}/>
          <Modal
            width="80vw"
            visible={visible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img src={modalImg} style={{width: '100%'}}/>
          </Modal>
        </article>
      </div>
    )
  }
}

export default EssayDetail