import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Icon, Tag } from 'antd'
import { oss } from '@/libs/publicPath'
import './index.less'

class EssayItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: props.item,
      active: false
    }
  }

  geToEssayDetail = (id, i) => {
    this.setState({
      active: true
    })
    window.open('/frontend/essayDetail/' + id, '_blank')
  }

  render() {
    let { item, active } = this.state
    return (
      <>
        <section className="essay-item">
          <div className="content">
            <h3 onClick={this.geToEssayDetail.bind(this, item.id)} className={active ? 'active' : ''}>{item.title}</h3>
            {/* <p dangerouslySetInnerHTML={{__html:item.des}} onClick={this.geToEssayDetail.bind(this, item.id)}></p> */}
            <div className="meta">
              <section className="browse_number"><Icon type="eye"/> {item.browseNumber || 0}</section>
              <section className="comment_number"><Icon type="message"/> {item.commentNumber || 0}</section>
              <section className="follow_number"><Icon type="heart"/> {item.starCount || 0}</section>
              {
                item.type === 0 ? (
                  <section className="type"><Tag color="blue">原创</Tag></section>
                  ) : (
                    <section className="type"><Tag color="geekblue">转发</Tag></section>
                  )
              }
            </div>
            <div className="meta">
              <section className="created_time">发表于：{item.createdDate}&nbsp;&nbsp;{item.categorys.length != 0 && item.categorys[0].name} · 
              &nbsp;{item.tags.length != 0 && item.tags[0].name}</section>
            </div>
          </div>
          <div className="cover" onClick={this.geToEssayDetail.bind(this, item.id)}>
            {
              item.cover ? (
                <img src={oss + item.cover}/>
              ) : ((item.categorys.length != 0 && item.categorys[0].cover) ? (
                <img src={oss + item.categorys[0].cover}/>
              ) : '')
            }
          </div>
        </section>
      </>
    );
  }
}

export default withRouter(EssayItem);