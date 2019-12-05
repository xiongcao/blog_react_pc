import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Table, message, Tag } from 'antd';
import * as Fetch from '@/libs/fetch';
import { MyButton } from '@/components'
import { oss } from '@/libs/publicPath.js'

class AdminList extends Component {
  constructor(props){
    super(props)
    this.state = {
      tableHeight: 0,
      adminList: [],
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
          width: 60
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          align: 'center',
          width: 90,
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
          title: '昵称',
          dataIndex: 'nickname',
          align: 'center',
          width: 120
        },
        {
          title: '手机号',
          dataIndex: 'phoneNumber',
          align: 'center',
          width: 120
        },
        {
          title: '性别',
          dataIndex: 'gender',
          align: 'center',
          width: 80,
          render: (gender) => {
            let txt = ''
            if (gender === 0) {
              txt = '男'
            } else if (gender === 1) {
              txt = '女'
            } else {
              txt = '未知'
            }
          }
        },
        {
          title: '职位',
          dataIndex: 'position',
          align: 'center',
          width: 120
        },
        {
          title: '地区',
          dataIndex: 'province',
          align: 'center',
          width: 160,
          render: (province, record) => {
          return (<span>{province} {record.city} {record.area} </span>)
          }
        },
        {
          title: '生日',
          dataIndex: 'birthday',
          align: 'center',
          width: 100
        },
        {
          title: '账号锁定时间',
          dataIndex: 'lockedDate',
          align: 'center',
          width: 100
        },
        {
          title: '注册时间',
          dataIndex: 'createdDate',
          align: 'center',
          width: 100
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 120,
          render: (status) => {
            let txt
            let color
            switch(status) {
              case 0:
                txt = '已删除'
                color = 'magenta'
                break;
              case 1:
                txt = '正常'
                color = '#87d068'
                break;
              case 2:
                txt = '密码尝试锁定'
                color = '#f50'
                break;
              case 3:
                txt = '超管锁定'
                color = 'red'
                break;
            }
            return (
              <Tag color={color}>{txt}</Tag>
						)
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 120,
          render: (status, record) => {
            return <Fragment>
              {
                (record.status === 2 || record.status === 3) ? (<MyButton size="small" color="#108ee9" onClick={this.updateStatus.bind(this, record.id, 1)}>解锁</MyButton>) : 
                (<MyButton size="small" color="#f50" onClick={this.updateStatus.bind(this, record.id, 3)}>锁定</MyButton>)
              }
            </Fragment>
          }
        }
      ]
    }
  }

  componentDidMount () {
		this.getAdminList()
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
  
  getAdminList () {
    let { page, size, field, value } = this.state
    let data = { page, size, field, value }
    Fetch.get(`user/findAll`, data).then((res) => {
			if (res.code === 0) {
				this.setState({
          adminList: res.data.content,
          total: res.data.totalElements
				})
			}
		})
  }

  updateStatus = (id, status) => {
    Fetch.post(`user/unlock`, {params:{id, status}}).then((res) => {
			if (res.code === 0) {
        message.success("成功")
				this.getAdminList()
			}
		})
  }

  handleTableChange = (e) => {
		this.setState({
			page: e.current - 1,
		}, () => {
			this.getAdminList()
		})
	}

  render() {
    let { columns, adminList, tableLoading, tableHeight, total, size, page } = this.state
    return (
      <div className="admin-manage">
        <div className="table">
          <Table bordered rowKey="id" size="middle" loading={tableLoading}
            pagination={{ total: total, showTotal: total => `共 ${total} 条，每页 ${size} 条`, defaultCurrent: page, defaultPageSize: size, showQuickJumper: true, size: 'default' }}
            columns={columns}
            dataSource={adminList}
            onChange = {this.handleTableChange.bind()}
            scroll={{ x: 1180, y: tableHeight }} 
          />
        </div>
      </div>
    )
  }
}

export default withRouter(AdminList)