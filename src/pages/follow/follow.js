import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Table, message, Tag } from 'antd';
import * as Fetch from '@/libs/fetch';
import { MyButton, TableEdit } from '@/components'
import { api, oss } from '@/libs/publicPath.js'
import './follow.less'

class Follow extends Component {
  constructor(props){
    super(props)
    this.state = {
      tableHeight: 0,
      followList: [],
      size: 50,
      page: 0,
      field: '',
      value: '',
      total: 0,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          align: 'center',
          width: 80
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          align: 'center',
          width: 100,
          render: (avatar) => {
            let img = avatar ? (oss + avatar) : (require('@/assets/img/defaultComm.png'))
            return (
              <img src={img} style={{height: 80}}/>
            )
          }
        },
        {
          title: '用户名',
          dataIndex: 'name',
          align: 'center',
          width: 120
        },
        {
          title: '备注',
          dataIndex: 'nickname',
          align: 'center',
          width: 160,
          render: (nickname, record) => {
            return (
              <TableEdit field={nickname} id={record.id} confirm={this.editConfirm}/>
            )
          }
        },
        {
          title: '状态',
          dataIndex: 'mutualWatch',
          align: 'center',
          width: 100,
          render: (mutualWatch) => {
            return (
              <>
              {
                mutualWatch ? (
                  <Tag color="#2db7f5">互相关注</Tag>
                ) : (
                  <Tag>关注</Tag>
                )
              }
              </>
						)
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          // fixed: 'right',
          width: 100,
          render: (id, record) => {
            return (
              <MyButton size="small" color="#f50" onClick={this.updateStatus.bind(this, record.id)}>取消关注</MyButton>
						)
          }
        },
      ]
    }
  }

  componentDidMount () {
		this.getFollowList()
		this.resizeTable()
		window.onresize = this.resizeTable
	}

	componentWillUnmount () {
		window.onresize = null
	}

	resizeTable = () => {
		let tableHeight = document.documentElement.clientHeight - 245
		this.setState({
			tableHeight
		})
  }

  editConfirm = (preValue, value, id) => {
    Fetch.post(`follow/updateNickName`, {
      params: {
        id: id,
        nickname: value
      }
    }).then((res) => {
			if (res.code === 0) {
        message.success("成功")
				this.getFollowList()
			}
		})
  }
  
  getFollowList () {
    let { page, size, field, value } = this.state
    let data = { page, size, field, value }
    Fetch.get(`follow/followList/1`, data).then((res) => {
			if (res.code === 0) {
				this.setState({
          followList: res.data.content,
          total: res.data.totalElements
				})
			}
		})
  }

  updateStatus = (id) => {
    Fetch.post(`follow/unFollow/${id}`).then((res) => {
			if (res.code === 0) {
        message.success("成功")
				this.getFollowList()
			}
		})
  }

  handleTableChange = (e) => {
		this.setState({
			page: e.current - 1,
		}, () => {
			this.getFollowList()
		})
	}

  render() {
    let { columns, followList, tableLoading, tableHeight, total, size, page } = this.state
    return (
      <div className="follow-manage">
        <div className="table">
          <Table bordered rowKey="id" size="middle" loading={tableLoading}
            pagination={{ total: total, showTotal: total => `共 ${total} 条，每页 ${size} 条`, defaultCurrent: page, defaultPageSize: size, showQuickJumper: true, size: 'default' }}
            columns={columns}
            dataSource={followList}
            onChange = {this.handleTableChange.bind()}
            scroll={{ x: 780, y: tableHeight }} 
          />
        </div>
      </div>
    )
  }
}

export default withRouter(Follow)