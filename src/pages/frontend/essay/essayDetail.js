import React, { Component, Fragment } from 'react'
import { Icon, Modal } from 'antd';
import { MyTag } from '@/components'
import * as Fetch from '@/libs/fetch';
import { oss } from '@/libs/publicPath'

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'

import marked from 'marked';
import { MKTitles } from '@/components/index'
import getMKTitles from '@/utils/mkTitles'

import '@/assets/styles/markdown.less'
import './index.less'

class EssayDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      essayData: { },
      navList: [],
      renderer: {},
      mkTitlesLen: 0,
      highlightIndex: 0,
      markdownHtml: '',
      visible: false,
      modalImg: ''
    };
  }

  componentWillMount () {
    this.getEssayDetail()
    window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
  }

  componentWillUnmount() { // 一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('scroll', this.handleScroll.bind(this)) 
  }

  handleClickEvent = () => {
    let imgDomList = document.getElementsByClassName("markdown-img")
    console.log(imgDomList, 'imgDomList')
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
      visible: false
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
    let { essayData, navList, highlightIndex, markdownHtml, visible, modalImg } = this.state
    return (
      <div className="frontend-essayDetail">
        <div className="content">
          <h1>{essayData.title}</h1>
          <div className="annotation">
            <span><Icon type="calendar"/> 发表于 {essayData.createdDate}</span> |
            <span><Icon type="folder"/> 分类于 {essayData.categorys && essayData.categorys[0].name}</span> |
            <span><Icon type="message"/> 评论 {essayData.comments && essayData.comments.length}</span> |
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
        <Modal
          width="80vw"
          visible={visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img src={modalImg} style={{width: '100%'}}/>
        </Modal>
      </div>
    )
  }
}

export default EssayDetail