import React, { Component } from 'react'
import './index.less'
import { Icon, Empty, Calendar } from 'antd';
import { MyTag, EssayItem, DropdownLoading } from '@/components'
import * as Fetch from '@/libs/fetch';
import noResult from '@/assets/img/noResult.png'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navActiveIndex: 1,
      page: 0,
      size: 20,
      title: '',
      categoryId: '',
      tagId: '',
      properties: 'star',
      tagList: [],
      categoryList: [],
      essayList: [],
      loadingCompleted: false,  // 请求是否完成，显示后续没有更多数据
      isScroll: false, // 是否允许滚动, true: 允许 false：不允许，初始化为false是为了初始只让加载一次，等第一次加载完再置为true
      isEmpty: false, // 没有数据
      loading: false, // 数据加载中
      isScrollLoad: false, // 此次加载是切换加载还是滚动加载 true：滚动加载 false：切换加载
    };
  }

  componentWillMount () {
    this.getEssayList()
    this.getTagList()
    this.getCategoryList()
    window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
  }

  componentWillUnmount() { // 一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('scroll', this.handleScroll.bind(this)) 
  }

  getTagList () {
    Fetch.get(`tag/findTagNumbers`).then((res) => {
			if (res.code === 0) {
        this.setState({
          tagList: res.data
        })
      }
    })
  }

  getCategoryList () {
    Fetch.get(`category/findCategoryNumbers`).then((res) => {
			if (res.code === 0) {
        this.setState({
          categoryList: res.data
        })
      }
    })
  }

  getEssayList () {
    let { page, size, title, categoryId, tagId, properties, isScrollLoad } = this.state
    let data = { page, size, title, categoryId, tagId, properties, direction: 'DESC' }
    this.setState(() => ({
      loading: isScrollLoad,
      loadingCompleted: false
    }))
    Fetch.get(`essay/findAllAuthorList`, data).then((res) => {
			if (res.code === 0) {
        if (res.data.content.length != 0) {
          let _list = this.state.essayList.concat(res.data.content)
          this.setState(() => ({
            essayList: _list,
            page: page + 1,
            isScroll: true,
            loading: false,
            isEmpty: false
          }))
        } else {
          if (this.state.essayList.length != 0) { // 有数据，但是最后一次请求没有数据
            this.setState({
              loadingCompleted: true,
              loading: false
            })
          } else {  // 没有数据，显示空数据样式
            this.setState({
              isEmpty: true,
              loadingCompleted: false,
              loading: false,
            })
          }
        }
			}
		})
  }

  handleScroll = e => {
    let scrollTop = e.srcElement.scrollingElement.scrollTop // 为距离滚动条顶部高度
    let scrollHeight = e.srcElement.scrollingElement.scrollHeight // 为整个文档高度
    let clientHeight = document.documentElement.clientHeight // 文档可见区域高度
    if (scrollTop + clientHeight >= scrollHeight - 50 && this.state.isScroll) {
      this.setState({
        isScroll: false,
        isScrollLoad: true
      }, () => {
        this.getEssayList();
      })
    }
    
  }

  handleNavClick = (index, field) => {
    this.setState({
      navActiveIndex: index,
      properties: field,
      page: 0,
      essayList: [],
      isScrollLoad: false
    }, () => {
      this.getEssayList()
    })
  }

  keydownHandle = (e) => {
    e.persist()
    if (e.keyCode === 13) {
      this.search()
    }
  }

  search = () => {
    this.setState({
      page: 0,
      essayList: [],
      isScrollLoad: false
    }, () => {
      this.getEssayList()
    })
  }

  searchChange = (e) => {
    e.persist()
    this.setState({
      title: e.target.value
    })
  }

  changeCategory = (id) => {
    this.setState({
      categoryId: id || '',
      page: 0,
      essayList: [],
      isScrollLoad: false
    }, () => {
      this.getEssayList()
    })
  }

  changeTag = (id) => {
    this.setState({
      tagId: id || '',
      page: 0,
      essayList: [],
      isScrollLoad: false
    }, () => {
      this.getEssayList()
    })
  }

  render() {
    let { navActiveIndex, loadingCompleted, essayList, tagList, categoryList, title, loading, isEmpty, tagId, categoryId } = this.state

    return (
      <div className="frontend-home">
        <nav>
          <ul>
            <li onClick={this.handleNavClick.bind(this, 1, 'star')} className={ navActiveIndex === 1 ? 'active' : '' }>热门</li>
            <li onClick={this.handleNavClick.bind(this, 2, 'created_date')} className={ navActiveIndex === 2 ? 'active' : '' }>最新</li>
            <li className="search"><input placeholder="搜索" value={title} onChange={this.searchChange.bind(this)} onKeyDown={this.keydownHandle.bind(this)}/><Icon style={{fontSize: 18}} type="search" onClick={this.search.bind()}/></li>
          </ul>
        </nav>
        <article>
          <div className="essay-list">
            {
              essayList.length != 0 && essayList.map((item, i) => 
                <EssayItem item={item} key={i}/>
              )
            }
            {
              isEmpty && <Empty style={{padding: '50px 0', color: 'rgb(153, 153, 153)'}} image={noResult} description={'啊哦，还没相关文章哟，赶快去写一篇吧！'}/>
            }
            <DropdownLoading loadingCompleted={loadingCompleted} loading={loading}/>
          </div>
          <div className="advert">
            {/* <section className="detePicker">
              <Calendar fullscreen={false} />
            </section> */}
            <section className="tags categorys">
              <p>热门分类</p>
              <div>
                {
                  categoryList.map((item) => 
                    <MyTag 
                      key={item.id} 
                      id={item.id}
                      style={{marginRight: '8px', marginBottom: '8px'}} 
                      checked={item.id === categoryId}
                      onClick = {this.changeCategory.bind()}
                    >{item.name}</MyTag>
                  )
                }
              </div>
            </section>
            <section className="tags">
              <p>热门标签</p>
              <div>
                {
                  tagList.map((item) => 
                    <MyTag 
                    key={item.id} 
                    id={item.id}
                    checked={item.id === tagId}
                    style={{marginRight: '8px', marginBottom: '8px'}}
                    onClick = {this.changeTag.bind()}
                  >{item.name}</MyTag>
                  )
                }
              </div>
            </section>
            <section className="aboutUs">
              <p>关注我们</p>
              <div>
                <Icon style={{fontSize: '24px', cursor: 'pointer'}} type="github" />
                <Icon style={{fontSize: '24px', cursor: 'pointer'}} type="wechat" />
                <Icon style={{fontSize: '24px', cursor: 'pointer'}} type="weibo-circle" />
                <Icon style={{fontSize: '24px', cursor: 'pointer'}} type="html5" theme="filled" />
              </div>
            </section>
          </div>
        </article>
      </div>
    )
  }
}

export default Index