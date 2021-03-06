import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Table, Popconfirm, message, Tag, Input } from 'antd';
import * as Fetch from '@/libs/fetch';
import { MyButton } from '@/components'

import '@/pages/essay/essay.less'

class EssayList extends Component {
  constructor(props){
    super(props)
    this.state = {
      tableHeight: 0,
      essayList: [],
      name: '',
      size: 50,
      page: 0,
      total: 0,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          align: 'center',
          width: 80
        },
        {
          title: '标题',
          dataIndex: 'title',
          align: 'center',
          width: 180
        },
        {
          title: '类型',
          dataIndex: 'categorys',
          align: 'center',
          width: 80,
          render: (categorys, record) => {
            return categorys.map((category) => 
              (<Tag key={category.id}>{category.name}</Tag>)
            )
          }
        },
        {
          title: '标签',
          dataIndex: 'tags',
          align: 'center',
          width: 80,
          render: (tags, record) => {
            return tags.map((tag) => 
              (<Tag key={tag.id}>{tag.name}</Tag>)
            )
          }
        },
        {
          title: '原创/转发',
          dataIndex: 'type',
          align: 'center',
          width: 80,
          render: (type, record) => {
            if (type === 0) {
              return <Tag color="red">原创</Tag>
            } else {
              return <Tag>转发</Tag>
            }
          }
        },
        {
          title: '序号',
          dataIndex: 'rank',
          align: 'center',
          width: 80
        },
        {
          title: '浏览量',
          dataIndex: 'browseNumber',
          align: 'center',
          width: 80
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 100,
          render: (status, record) => {
            let html
            if (status === 0) {
              html = '已删除'
            } else if (status === 1) {
              html = (
                <Popconfirm placement="left" title={"设置为私密或自序"} onConfirm={this.updateStatus.bind(this, record.id, 2)} onCancel={this.updateStatus.bind(this, record.id, 4)} okText="私密" cancelText="自序">
                  <MyButton size="small" color="#2db7f5">公开</MyButton>
                </Popconfirm>
              )
            } else if (status === 2) {
              html = (
                <Popconfirm placement="left" title={"是否设置为公开"} onConfirm={this.updateStatus.bind(this, record.id, 1)} okText="是" cancelText="否">
                  <MyButton size="small" color="#f5222d">私密</MyButton>
                </Popconfirm>
              )
            } else if (status === 3) {
              html = (
                <Tag>草稿</Tag>
              )
            } else {
              html = <Tag color="red">自序</Tag>
            }
						return html
					}
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 120,
          render: (id, record) => {
            return (
              <>
                <MyButton size="small" color="#108ee9" onClick={this.essayEdit.bind(this, record.id)}>修改</MyButton>
                <Popconfirm placement="left" title="删除后不可恢复，确认删除此数据吗" onConfirm={this.updateStatus.bind(this, record.id, 0)} okText="确认" cancelText="取消">
                  <MyButton size="small" color="#f50">删除</MyButton>
                </Popconfirm>
              </>
						)
          }
        },
      ]
    }
  }

  componentDidMount () {
		this.getEssayList()
		this.resizeTable()
		window.onresize = this.resizeTable
	}

	componentWillUnmount () {
		window.onresize = null
	}

	resizeTable = () => {
		let tableHeight = document.documentElement.clientHeight - 286
		this.setState({
			tableHeight
		})
  }
  
  getEssayList () {
    let { page, size, name } = this.state
    let data = { page, size, title: name }
    Fetch.get(`essay/admin/findAll`, data).then((res) => {
			if (res.code === 0) {
				this.setState({
          essayList: res.data.content,
          total: res.data.totalElements
				})
			}
		})
  }

  searchFn = (v) => {
    this.setState({
      name: v
    }, () => {
      this.getEssayList()
    })
  }

  updateStatus = (id, status) => {
    Fetch.post(`essay/updateStatus/${id}/${status}`).then((res) => {
			if (res.code === 0) {
        message.success("成功")
				this.getEssayList()
			}
		})
  }

  essayEdit = (id) => {
    this.props.history.push({pathname:"/admin/essayEdit/" + id});
  }

  render() {
    let { columns, essayList, tableLoading, tableHeight, total, page, size } = this.state
    return (
      <div className="essay-manage">
        {/* <div style={{marginBottom: '15px'}}>
          <MyButton type="error" onClick={ this.essayEdit.bind(this, -1) }>添 加</MyButton>
        </div> */}
        <div className="top-tool">
          <div className="left">
          <MyButton type="error" onClick={ this.essayEdit.bind(this, -1) }>添 加</MyButton>
          </div>
          <div className="right">
            <Input.Search
              placeholder="请输入文章名称"
              enterButton="搜索"
              onSearch={this.searchFn.bind(this)}
            />
          </div>
        </div>
        <div className="table">
          <Table bordered rowKey="id" size="middle" loading={tableLoading}
            pagination={{ total: total, showTotal: total => `共 ${total} 条，每页 ${size} 条`, defaultCurrent: page, defaultPageSize: size, showQuickJumper: true, size: 'default' }}
            columns={columns}
            dataSource={essayList}
            scroll={{ x: 620, y: tableHeight }} 
          />
        </div>
      </div>
    )
  }
}

export default withRouter(EssayList)