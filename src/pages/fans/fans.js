import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Table, Popconfirm, message, Tag, Button } from 'antd';
import * as Fetch from '@/libs/fetch';
import { MyButton } from '@/components'
import './fans.less'

class Fans extends Component {
  constructor(props){
    super(props)
    this.state = {
      tableHeight: 0,
      fansList: [],
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
          width: 100
        },
        {
          title: '用户名',
          dataIndex: 'name',
          align: 'center',
          width: 120
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          align: 'center',
          width: 120
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
                  <Tag>粉丝</Tag>
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
              <>
              {
                record.mutualWatch ? (
                  <Button size="small" disabled>关注TA</Button>
                ) : (
                  <MyButton size="small" color="#f50" onClick={this.saveFollow.bind(this, record)}>关注TA</MyButton>
                )
              }
              </>
						)
          }
        }
      ]
    }
  }

  componentDidMount () {
		this.getFansList()
		this.resizeTable()
		window.onresize = this.resizeTable
	}

	componentWillUnmount () {
		window.onresize = null
	}

	resizeTable = () => {
		let tableHeight = document.documentElement.clientHeight - 280
		this.setState({
			tableHeight
		})
  }
  
  getFansList () {
    let { page, size, field, value } = this.state
    let data = { page, size, field, value }
    Fetch.get(`follow/followList/2`, data).then((res) => {
			if (res.code === 0) {
				this.setState({
          fansList: res.data.content,
          total: res.data.totalElements
				})
			}
		})
  }

  saveFollow = (record) => {
    Fetch.post(`follow/save`, {
      followUserId: record.followUserId
    }).then((res) => {
			if (res.code === 0) {
        message.success("成功")
				this.getFansList()
			}
		})
  }

  handleTableChange = (e) => {
		this.setState({
			page: e.current - 1,
		}, () => {
			this.getFansList()
		})
	}

  render() {
    let { columns, fansList, tableLoading, tableHeight, total, size, page } = this.state
    return (
      <div className="fans-manage">
        <div className="table">
          <Table bordered rowKey="id" size="middle" loading={tableLoading}
            pagination={{ total: total, showTotal: total => `共 ${total} 条，每页 ${size} 条`, defaultCurrent: page, defaultPageSize: size, showQuickJumper: true, size: 'default' }}
            columns={columns}
            dataSource={fansList}
            onChange = {this.handleTableChange.bind()}
            scroll={{ x: 780, y: tableHeight }} 
          />
        </div>
      </div>
    )
  }
}

export default withRouter(Fans)