import React, { Component, Fragment } from 'react';
import { Timeline, Icon, Spin, Empty } from 'antd'
import * as Fetch from '@/libs/fetch';
import moment from 'moment'
import store from '@/libs/store'
import { DropdownLoading } from '@/components'
import noResult from '@/assets/img/noResult.png'
import './index.less'

class Archive extends Component {

  constructor(props) {
    super(props)
    this.state = {
      archiveList: [],
      page: 0,
      size: 20,
      oadingCompleted: false,  // 请求是否完成，显示后续没有更多数据
      isScroll: false, // 是否允许滚动, true: 允许 false：不允许，初始化为false是为了初始只让加载一次，等第一次加载完再置为true
      isEmpty: false, // 没有数据
      loading: false, // 数据加载中
      isScrollLoad: false, // 此次加载是切换加载还是滚动加载 true：滚动加载 false：切换加载
      spinLoading: true,
      userInfo: store.getState().user
    }
  }

  UNSAFE_componentWillMount () {
    document.title = '熊博园-归档'
    this.getArchiveListData()
    window.addEventListener('scroll', this.handleScroll.bind(this)) //监听滚动
  }

  componentWillUnmount() { // 一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('scroll', this.handleScroll.bind(this)) 
  }

  handleScroll = e => {
    let scrollTop = e.srcElement.scrollingElement.scrollTop // 为距离滚动条顶部高度
    let scrollHeight = e.srcElement.scrollingElement.scrollHeight // 为整个文档高度
    let clientHeight = document.documentElement.clientHeight // 文档可见区域高度
    if (scrollTop + clientHeight >= scrollHeight - 50 && this.state.isScroll) {
      this.setState({
        isScroll: false
      }, () => {
        this.getArchiveListData();
      })
    }
  }

  getArchiveListData () {
    let { page, size, isScrollLoad } = this.state
    let data = { page, size }
    if (this.state.userInfo.id) {
      data.id = this.state.userInfo.id
    }
    this.setState(() => ({
      loading: isScrollLoad,
      loadingCompleted: false
    }))
    Fetch.get(`essay/findAll`, data).then((res) => {
      if (res.code === 0) {
        if (res.data.content.length !== 0) {
          res.data.content.forEach((data) => {
            data.date = moment(data.createdDate).get("year")
          })
          let _list = this.state.archiveList.concat(res.data.content)
          let temp = _list[0].date;
          _list[0].year = _list[0].date
          _list.forEach((obj) => {
            if (obj.date !== temp) {
              obj.year = obj.date
              temp = obj.date
            }
          })
          console.log(_list, '_list')
          this.setState(() => ({
            archiveList: _list,
            page: page + 1,
            isScroll: true,
            loading: false,
            isEmpty: false,
            spinLoading: false
          }))
        } else {
          if (this.state.archiveList.length != 0) { // 有数据，但是最后一次请求没有数据
            this.setState({
              loadingCompleted: true,
              loading: false,
              spinLoading: false
            })
          } else {  // 没有数据，显示空数据样式
            this.setState({
              isEmpty: true,
              loadingCompleted: false,
              loading: false,
              spinLoading: false
            })
          }
        }
			}
		})
  }

  goToEssayDetail = (id) => {
    this.props.history.push('/frontend/essayDetail/' + id)
  }

  render() {
    let { archiveList, loadingCompleted, loading, spinLoading, isEmpty } = this.state
    return (
      <Spin spinning={spinLoading} size="large">
        {
          spinLoading && <div style={{width: '100%', minHeight: 400}}></div>
        }
        <div className="frontend-archive" style={isEmpty ? {background: 'transparent'} : {}}>
          {
            archiveList.length !== 0 ? (
              <Timeline>
              {
                archiveList.map((archive, i) => {
                  return (
                    archive.year ? (
                      <>
                        <Timeline.Item color="#bbb" key={i}
                          dot={<Icon type="clock-circle-o" style={{ fontSize: '20px' }} />}>
                          <p className="year">{archive.year}</p>
                        </Timeline.Item>
                        <Timeline.Item color="#bbb" key={archive.id}>
                          <p className="title" onClick={this.goToEssayDetail.bind(this, archive.id)}>{archive.title}</p>
                          <p className="tiem-node">{archive.createdDate}</p>
                        </Timeline.Item>
                      </>
                    ) : (
                      <Timeline.Item color="#bbb" key={archive.id}>
                        <p className="title" onClick={this.goToEssayDetail.bind(this, archive.id)}>{archive.title}</p>
                        <p className="tiem-node">{archive.createdDate}</p>
                      </Timeline.Item>
                    )
                  )
                })
              }
              </Timeline>
            ) : (<Fragment>
              {
                isEmpty && <Empty style={{padding: '100px 0', color: 'rgb(153, 153, 153)'}} image={noResult} description={'啊哦，还没相关文章哟，赶快去写一篇吧！'}/>
              }
            </Fragment>)
          }
          
          <DropdownLoading loadingCompleted={loadingCompleted} loading={loading}/>
        </div>
      </Spin>
    );
  }
}

export default Archive;