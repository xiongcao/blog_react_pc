import React, { Component } from 'react'
import { Icon, Empty, Avatar, Spin } from 'antd';
import { MyTag, EssayItem, DropdownLoading } from '@/components'
import * as Fetch from '@/libs/fetch';
import noResult from '@/assets/img/noResult.png'
import { oss } from '@/libs/publicPath'
import store from '@/libs/store'
import './index.less'
import '../index/index.less'

class EssayList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      size: 20,
      categoryId: '',
      tagId: '',
      properties: 'star_count, created_date',
      userInfo: store.getState().user,
      tagList: [],
      categoryList: [],
      essayList: [],
      loadingCompleted: false,  // 请求是否完成，显示后续没有更多数据
      isScroll: false, // 是否允许滚动, true: 允许 false：不允许，初始化为false是为了初始只让加载一次，等第一次加载完再置为true
      isEmpty: false, // 没有数据
      loading: false, // 数据加载中
      isScrollLoad: false, // 此次加载是切换加载还是滚动加载 true：滚动加载 false：切换加载
      spinLoading: true
    };
  }
  componentWillUnmount () {
    this.setState = () => {
      return
    }
  }

  UNSAFE_componentWillMount () {
    document.title = '熊博园-文章'
    this.getEssayList()
    this.getTagList()
    this.getCategoryList()
    if (this.state.userInfo.id) {
      this.getUserInfo()
    }
    window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
  }

  componentWillUnmount() { // 一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('scroll', this.handleScroll.bind(this)) 
  }

  getUserInfo () {
    Fetch.get(`user/findById?id=${this.state.userInfo.id}`).then((res) => {
			if (res.code === 0) {
				this.setState({
					userInfo: res.data
				})
			}
		})
  }

  getTagList () {
    let id = 2
    if (this.state.userInfo.id) {
      id = this.state.userInfo.id
    }
    Fetch.get(`tag/findTagNumbers?userId=${id}`).then((res) => {
			if (res.code === 0) {
        this.setState({
          tagList: res.data,
          spinLoading: false
        })
      }
    })
  }

  getCategoryList () {
    let id = 2
    if (this.state.userInfo.id) {
      id = this.state.userInfo.id
    }
    Fetch.get(`category/findCategoryNumbers?userId=${id}`).then((res) => {
			if (res.code === 0) {
        this.setState({
          categoryList: res.data
        })
      }
    })
  }

  getEssayList () {
    let { page, size, categoryId, tagId, properties, isScrollLoad } = this.state
    let data = { page, size, categoryId, tagId, properties, direction: 'DESC' }
    if (this.state.userInfo.id) {
      data.id = this.state.userInfo.id
    }
    this.setState(() => ({
      loading: isScrollLoad,
      loadingCompleted: false
    }))
    Fetch.get(`essay/findAll`, data).then((res) => {
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
    let { loadingCompleted, essayList, tagList, categoryList, loading, isEmpty, tagId, categoryId, userInfo, spinLoading } = this.state

    return (
      <Spin spinning={spinLoading} size="large">
        <div className="frontend-essay">
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
              <section className="userInfo">
                <div className="avatar">
                {
                userInfo.avatar ? (
                <Avatar size={100} src={oss + userInfo.avatar}/>
                ) : (
                <Avatar size={100} icon="user"/>
                )
                }
                </div>
                <div className="username">{ userInfo.nickname ? userInfo.nickname : userInfo.name }</div>
                <div className="motto">{ userInfo.motto }</div>
              </section>
              <section className="tags categorys">
                <p>分 类</p>
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
                <p>标 签</p>
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
      </Spin>
    )
  }
}

export default EssayList