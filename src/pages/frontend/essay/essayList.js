import React, { Component } from 'react'
import { Icon, Avatar } from 'antd';
import { MyTag, EssayItem, DropdownLoading } from '@/components'
import * as Fetch from '@/libs/fetch';
import { oss } from '@/libs/publicPath'
import '../index/index.less'
import './index.less'

class EssayList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navActiveIndex: 1,
      page: 0,
      size: 5,
      title: '',
      categoryId: '',
      tagId: '',
      properties: 'star',
      essayList: [],
      userInfo: {},
      loadingCompleted: false,  // 请求是否完成，显示后续没有更多数据
      isScroll: false, // 是否允许滚动, true: 允许 false：不允许，初始化为false是为了初始只让加载一次，等第一次加载完再置为true
      isEmpty: false, // 没有数据
      loading: false, // 数据加载中
    };
  }

  componentWillMount () {
    this.getEssayList()
    this.getUserInfo()
    window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
  }

  componentWillUnmount() { // 一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('scroll', this.handleScroll.bind(this)) 
  }

  getEssayList () {
    let { page, size, title, categoryId, tagId, properties } = this.state
    let data = { page, size, title, categoryId, tagId, properties, direction: 'DESC' }
    this.setState(() => ({
      loading: true
    }))
    Fetch.get(`essay/findAll`, data).then((res) => {
			if (res.code === 0) {
        if (res.data.content.length != 0) {
          let _list = this.state.essayList.concat(res.data.content)
          this.setState(() => ({
            essayList: _list,
            page: page + 1,
            isScroll: true,
            loading: false
          }))
        } else {
          if (this.state.essayList.length != 0) { // 有数据，但是最后一次请求没有数据
            this.setState({
              loadingCompleted: true,
              loading: false
            })
          } else {  // 没有数据，显示空数据样式
            this.setState({
              isEmpty: true
            })
          }
        }
			}
		})
  }

  getUserInfo () {
    Fetch.get(`user/findById?id=2`).then((res) => {
			if (res.code === 0) {
				this.setState({
					userInfo: res.data
				})
			}
		})
  }

  handleScroll = e => {
    let scrollTop = e.srcElement.scrollingElement.scrollTop // 为距离滚动条顶部高度
    let scrollHeight = e.srcElement.scrollingElement.scrollHeight // 为整个文档高度
    let clientHeight = document.documentElement.clientHeight // 文档可见区域高度
    if (scrollTop + clientHeight >= scrollHeight - 50 && this.state.isScroll) {
      this.setState({
        isScroll: false
      }, () => {
        this.getEssayList();
      })
    }
    
  }

  handleNavClick = (index, field) => {
    this.setState({
      navActiveIndex: index,
      properties: field
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
      page: 0
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

  render() {
    let { navActiveIndex, loadingCompleted, essayList, userInfo, title, loading } = this.state

    return (
      <div className="frontend-essay">
        <article>
          <div className="essay-list">
            {
              essayList.map((item, i) => 
                <EssayItem item={item} key={i}/>
              )
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
            <section className="tags">
              <p>热门标签</p>
              <div>
                {
                  ['数据结构与算法', '前端', '后端', 'JS', 'H5',  'CSS3', '微信小程序'].map((item) => 
                    <MyTag key={item} style={{marginRight: '8px', marginBottom: '8px'}}>{item}</MyTag>
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


export default EssayList