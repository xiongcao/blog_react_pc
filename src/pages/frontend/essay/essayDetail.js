import React, { Component, Fragment } from 'react'
import { Icon, Avatar } from 'antd';
import { MyTag } from '@/components'
import * as Fetch from '@/libs/fetch';
import { oss } from '@/libs/publicPath'

import hljs from 'highlight.js'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'
import 'highlight.js/styles/atom-one-light.css'

import marked from 'marked';
import { MKTitles } from '@/components/index'
import getMKTitles from '@/utils/mkTitles'

import '@/assets/styles/markdown.less'
import './index.less'

class EssayDetail extends Component {
  mdParser = null
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      essayData: {},
      navList: [],
      renderer: {},
      mkTitlesLen: 0,
      highlightIndex: 0
    };

    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (__) {}
        }    
        return ''
      }
    })
  }

  componentWillMount () {
    this.getEssayDetail()
    window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
  }

  componentWillUnmount() { // 一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('scroll', this.handleScroll.bind(this)) 
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
    this.setState({
      navList,
      essayData: res.data,
      renderer
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
    for (let i = 0; i < this.state.mkTitlesLen; i++) {
      let dom = document.getElementById(`${idPrefix}${i}`)
      let domTitle = document.querySelector(`a[href="#titleAnchor${i}"]`)
      list.push({
        y: dom.getBoundingClientRect().top + 10, // 利用dom.getBoundingClientRect().top可以拿到元素相对于显示器的动态y轴坐标
        index: i,
        domTitle
      })
    }
    let readingVO = {}
    readingVO = list.filter(item => item.y > distance).sort((a, b) => {
      return a.y - b.y
    })[0] // 对所有的y值为正标的题，按y值升序排序。第一个标题就是当前处于阅读中的段落的标题。也即要高亮的标题
    let domTitle = document.querySelector(`a[href="#titleAnchor${readingVO.index || 0}"]`)
    let titles = document.getElementsByClassName("nav-list-a")
    for (let i = 0; i < titles.length; i++) {
      titles[i].classList.remove("active")
    }
    domTitle.classList.add("active")
    // this.setState({
    //   highlightIndex: readingVO.index
    // })
  }

  render () {
    let { essayData, navList, renderer, highlightIndex } = this.state
    this.setRenderer(renderer)
    return (
      <div className="frontend-essayDetail">
        <div className="content">
          <h1>{essayData.title}</h1>
          <div className="annotation">
            <span><Icon type="calendar"/> 发表于 {essayData.createdDate}</span> |
            <span><Icon type="folder"/> 分类于 前端</span> |
            <span><Icon type="message"/> 评论 {essayData.comments && essayData.comments.length}</span> |
            <span><Icon type="eye"/> 阅读次数 {essayData.browseNumber}</span> |
            <span><Icon type="file-word"/> 字数统计 {essayData.content && essayData.content.length}字</span> |
            <span><Icon type="clock-circle"/> 阅读时长 {essayData.content && parseInt(essayData.content.length/500)}分钟</span>
          </div>
          <section>
            <img src="https://upload-images.jianshu.io/upload_images/12890819-9f08a1abed2d7caf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"/>
            <div className="desc">
              <div className="username">xiongchao</div>
              <div className="position">全栈攻城狮</div>
            </div>
            <div className="tags">
              <Icon type="tags" style={{fontSize: 16, verticalAlign: 'middle'}} />
              {
                ['js', 'css', 'html'].map((tag, i) => (
                  <Fragment key={i}>
                    <span className="tagName">{tag}</span><span className="split">|</span>
                  </Fragment>
                ))
              }
            </div>
          </section>
          <div className="cover">
            <img src="https://upload-images.jianshu.io/upload_images/12890819-9f08a1abed2d7caf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"/>
          </div>
          {/* <MdEditor
            ref={node => this.mdEditor = node}
            value={essayData.content + ''}
            config={{
              view: {
                menu: false,
                md: false,
                html: true
              }
            }}
            renderHTML={(text) => this.mdParser.render(text)}
            onImageUpload={this.handleImageUpload}
          /> */}
          <div className="markdown" dangerouslySetInnerHTML={{__html: marked(essayData.content || ' ', { renderer: renderer })}}></div>
        </div>
        <div className="right-nav">
          <MKTitles list={navList.nav} highlightIndex={highlightIndex}/>
        </div>
      </div>
    )
  }
}

export default EssayDetail