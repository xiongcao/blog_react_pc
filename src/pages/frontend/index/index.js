import React, { Component } from 'react'
import './index.less'
import { Icon, Avatar } from 'antd';
import { MyTag } from '@/components'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navActiveIndex: 1,
      loadingCompleted: true
    };
  }

  componentWillMount () {

  }

  handleNavClick = (e) => {
    this.setState({
      navActiveIndex: e 
    })
  }

  render() {
    let { navActiveIndex, loadingCompleted } = this.state

    return (
      <div className="frontend-home">
        <nav>
          <ul>
            <li onClick={this.handleNavClick.bind(this, 1)} className={ navActiveIndex === 1 ? 'active' : '' }>热门</li>
            <li onClick={this.handleNavClick.bind(this, 2)} className={ navActiveIndex === 2 ? 'active' : '' }>最新</li>
            <li onClick={this.handleNavClick.bind(this, 3)} className={ navActiveIndex === 3 ? 'active' : '' }>关注</li>
            <li onClick={this.handleNavClick.bind(this, 4)} className={ navActiveIndex === 4 ? 'active' : '' }>前端</li>
            <li onClick={this.handleNavClick.bind(this, 5)} className={ navActiveIndex === 5 ? 'active' : '' }>后端</li>
            <li onClick={this.handleNavClick.bind(this, 6)} className={ navActiveIndex === 6 ? 'active' : '' }>小程序</li>
            <li onClick={this.handleNavClick.bind(this, 7)} className={ navActiveIndex === 7 ? 'active' : '' }>开发工具</li>
            <li onClick={this.handleNavClick.bind(this, 8)} className={ navActiveIndex === 8 ? 'active' : '' }>代码人生</li>
          </ul>
        </nav>
        <article>
          <div className="essay-list">
            {
              [1,2,3,4,5,6,7,8,10].map((item) => 
                <section className="essay-item" key={item}>
                  <div className="content">
                    <h3>JavaScript 数据结构与算法之美 - 桶排序、计数排序、基数排序</h3>
                    <p>之所以把计数排序、桶排序、基数排序 放在一起比较，是因为它们的平均时间复杂度都为 O(n)。之所以把计数排序、桶排序、基数排序 放在一起比较，是因为它们的平均时间复杂度都为 O(n)。</p>
                    <div className="meta">
                      <section className="browse_number"><Icon type="eye"/> 26</section>
                      <section className="comment_number"><Icon type="message"/> 20</section>
                      <section className="follow_number"><Icon type="heart"/> 100</section>
                      <section className="created_time">2019-07-30 22:54:16</section>
                    </div>
                  </div>
                  <div className="cover">
                    <img src={require('@/assets/img/defaultComm.png')} />
                  </div>
                </section>
              )
            }
            {
              loadingCompleted && (
                <div className="loading-completed">-------------------- 我也是有底线的！ -------------------</div>
              )
            }
          </div>
          <div className="advert">
            <section className="userInfo">
              <div className="avatar"><Avatar size={100} icon="user"/></div>
              <div className="username">XiongChao</div>
              <div className="motto">海纳百川，有容乃大</div>
              {/* <div>个人简介：嘻嘻嘻嘻嘻嘻嘻</div> */}
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

export default Index