import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Table, Popconfirm, message, Tag, Button } from 'antd';
import * as Fetch from '@/libs/fetch';
import { MyButton } from '@/components'
import './comment.less'

class Comment extends Component {
  constructor(props){
    super(props)
    this.state = {
      tableHeight: 0,
      commentList: [],
      columns: [
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
          title: '评论内容',
          dataIndex: 'content',
          align: 'center',
          width: 220,
          render: (content) => {
            return (<div className="comment-content">{content}</div>)
          }
        },
        {
          title: 'PID',
          dataIndex: 'pid',
          align: 'center',
          width: 80
        },
        {
          title: '评论时间',
          dataIndex: 'createdDate',
          align: 'center',
          width: 160
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 120,
          render: (status,) => {
            if (status === 1) {
              return <Tag color="#2db7f5">正常</Tag>
            } else {
              return <Tag color="red">已删除</Tag>
            }
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
                record.status === 1 ? (
                  <Popconfirm placement="left" title="删除后不可恢复，确认删除此数据吗" onConfirm={this.updateStatus.bind(this, record.id, 0)} okText="确认" cancelText="取消">
                  <MyButton size="small" color="#f50">删除</MyButton>
                </Popconfirm>
                ) : (
                  <Button disabled size="small">删除</Button>
                )
              }
              </>
						)
          }
        },
      ]
    }
  }

  componentDidMount () {
		this.getCommentList()
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
  
  getCommentList () {
    Fetch.get(`comment/findAll`).then((res) => {
			if (res.code === 0) {
				this.setState({
					commentList: res.data
				})
			}
		})
  }

  updateStatus = (id, status) => {
    Fetch.post(`comment/updateStatus/${id}/${status}`).then((res) => {
			if (res.code === 0) {
        message.success("成功")
				this.getCommentList()
			}
		})
  }

  render() {
    let { columns, commentList, tableLoading, tableHeight } = this.state
    return (
      <div className="comment-manage">
        <div className="table">
          <Table bordered rowKey="id" size="middle" loading={tableLoading}
            pagination={false}
            columns={columns}
            dataSource={commentList}
            scroll={{ x: 780, y: tableHeight }} 
          />
        </div>
      </div>
    )
  }
}

export default withRouter(Comment)