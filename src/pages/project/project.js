import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Input, Table, Popconfirm, Modal, Radio, message } from 'antd';
import * as Fetch from '@/libs/fetch';
import { MyButton, UploadImage } from '@/components'
import { oss } from '@/libs/publicPath.js'
import store from '@/libs/store.js';

import '@/assets/styles/table-search.less';

class Project extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: store.getState().user,
      visible: false,
      tableHeight: 0,
      projectList: [],
      projectForm: {},
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          align: 'center',
          width: 80
        },
        {
          title: '封面',
          dataIndex: 'cover',
          align: 'center',
          width: 100,
          render: (cover) => {
            let img = cover ? (oss + cover) : (require('@/assets/img/defaultComm.png'))
            return (
              <img src={img} style={{height: 80}}/>
            )
          }
        },
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '简介',
          dataIndex: 'introduction',
          align: 'center',
          width: 180
        },
        {
          title: '项目周期',
          dataIndex: 'cycle',
          align: 'center',
          width: 120
        },
        {
          title: '链接',
          dataIndex: 'url',
          align: 'center',
          width: 120
        },
        {
          title: '序号',
          dataIndex: 'rank',
          align: 'center',
          width: 80
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: 120,
          render: (status, record) => {
            let tips = status === 1 ? '隐藏' : '显示'
						return (
							<Popconfirm placement="left" title={"是否修改为" + tips} onConfirm={this.updateStatus.bind(this, record.id, status === 1 ? 0 : 1)} okText="是" cancelText="否">
								{status === 1 ? (<MyButton size="small" color="#2db7f5">显示</MyButton>) : (<MyButton size="small">隐藏</MyButton>)}
							</Popconfirm>
						)
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
                <MyButton size="small" color="#108ee9" onClick={this.openModal.bind(this, record)}>修改</MyButton>
                <Popconfirm placement="left" title="删除后不可恢复，确认删除此数据吗" onConfirm={this.updateStatus.bind(this, record.id, -1)} okText="确认" cancelText="取消">
                  <MyButton size="small" color="#f50">删除</MyButton>
                </Popconfirm>
              </>
						)
          }
        }
      ]
    }
  }

  componentDidMount () {
		this.getProjectList()
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
  
  getProjectList () {
    Fetch.get(`project/admin/findAll`).then((res) => {
			if (res.code === 0) {
				this.setState({
					projectList: res.data
				})
			}
		})
  }

  updateStatus = (id, status) => {
    Fetch.post(`project/updateStatus/${id}/${status}`).then((res) => {
			if (res.code === 0) {
        message.success("成功")
				this.getProjectList()
			}
		})
  }

  openModal = (record) => {
    let id = record && record.id
    if (id) {	// 编辑
			let { name, rank, status, cover, url, introduction, cycle } = record
			this.props.form.setFieldsValue({
				name, rank, status, cover, url, introduction, cycle
			})
		} else {
			this.props.form.setFieldsValue({
				name: '',
				rank: 0,
				status: 1
			})
		}
		this.setState({
      visible: true,
      projectForm: record || {},
			id
		})
  }

  handleOk = e => {
		this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.state.id && (values.id = this.state.id)
        values = Object.assign({}, this.state.projectForm, values)
				Fetch.post(`project/save`, values).then((res) => {
					if (res.code === 0) {
						message.success('保存成功')
						this.setState({
							visible: false
						})
						this.getProjectList()
					}
				})
      }
    })
  }

  handleCancel = e => {
    this.setState({
      visible: false
    })
  }

  validateRank = (rule, value, callback) => {
    if (!/^[0-9]{1,}$/.test(value)) {
      callback('序号只能是数字')
    } else {
      callback()
    }
	};

  uploadSuccess = (cover) => {
		this.props.form.setFieldsValue({
			cover
		})
  }

  render() {
    let { columns, projectList, tableLoading, tableHeight, visible, projectForm } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 18 },
      }
		};
		const { getFieldDecorator } = this.props.form;
    return (
      <div className="project-manage">
        <div className="top-tool">
          <div className="left">
          <MyButton type="error" onClick={ this.openModal }>添 加</MyButton>
          </div>
        </div>
        <div className="table">
          <Table bordered rowKey="id" size="middle" loading={tableLoading}
            pagination={false}
            columns={columns}
            dataSource={projectList}
            scroll={{ x: 780, y: tableHeight }} 
          />
        </div>
        <Modal
          title='添加/编辑项目'
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item label="项目名称">
                {
                  getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入名称',
                      }
                    ]
                  })(<Input/>)
                }
              </Form.Item>
              <Form.Item label="封面">
                {
                  getFieldDecorator('cover')(
                    <Fragment>
                      <Input hidden/>
                      <UploadImage imagePath={projectForm.cover} folder="project_cover" uploadSuccess={this.uploadSuccess.bind()} />
                    </Fragment>
                  )
                }
              </Form.Item>
              <Form.Item label="介绍">
                {
                  getFieldDecorator('introduction')(<Input/>)
                }
              </Form.Item>
              <Form.Item label="周期">
                {
                  getFieldDecorator('cycle')(<Input/>)
                }
              </Form.Item>
              <Form.Item label="链接">
                {
                  getFieldDecorator('url')(<Input/>)
                }
              </Form.Item>
              <Form.Item label="序号">
                {
                  getFieldDecorator('rank', {
                    rules: [
                      {
                        validator: this.validateRank,
                      }
                    ]
                  })(<Input/>)
                }
              </Form.Item>
              <Form.Item label="状态">
                {
                  getFieldDecorator('status')(
                    <Radio.Group>
                      <Radio value={1}>显示</Radio>
                      <Radio value={0}>隐藏</Radio>
                    </Radio.Group>
                  )
                }
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}

export default withRouter(Form.create({ name: 'project' })(Project))