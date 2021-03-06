import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Table, Popconfirm, message, Tag, Button } from 'antd';
import * as Fetch from '@/libs/fetch';
import { MyButton } from '@/components'
import './collect.less'

class Collect extends Component {
  constructor(props){
    super(props)
    this.state = {
      tableHeight: 0,
      collectList: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          align: 'center',
          width: 80
        },
        {
          title: '文章',
          dataIndex: 'title',
          align: 'center',
          width: 150
        },
        {
          title: '博主',
          dataIndex: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '收藏时间',
          dataIndex: 'createdDate',
          align: 'center',
          width: 160
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          // fixed: 'right',
          width: 100,
          render: (id, record) => {
            return (
              <Popconfirm placement="left" title="删除后不可恢复，确认删除此数据吗" onConfirm={this.updateStatus.bind(this, record.id, 0)} okText="确认" cancelText="取消">
                <MyButton size="small" color="#f50">删除</MyButton>
              </Popconfirm>
						)
          }
        },
      ]
    }
  }

  componentDidMount () {
		this.getCollectList()
		this.resizeTable()
		window.onresize = this.resizeTable
	}

	componentWillUnmount () {
		window.onresize = null
	}

	resizeTable = () => {
		let tableHeight = document.documentElement.clientHeight - 225
		this.setState({
			tableHeight
		})
  }
  
  getCollectList () {
    Fetch.get(`collect/findAll`).then((res) => {
			if (res.code === 0) {
				this.setState({
					collectList: res.data
				})
			}
		})
  }

  updateStatus = (id, status) => {
    Fetch.post(`collect/updateStatus/${id}/${status}`).then((res) => {
			if (res.code === 0) {
        message.success("成功")
				this.getCollectList()
			}
		})
  }

  render() {
    let { columns, collectList, tableLoading, tableHeight } = this.state
    return (
      <div className="collect-manage">
        <div className="table">
          <Table bordered rowKey="id" size="middle" loading={tableLoading}
            pagination={false}
            columns={columns}
            dataSource={collectList}
            scroll={{ x: 780, y: tableHeight }} 
          />
        </div>
      </div>
    )
  }
}

export default withRouter(Collect)