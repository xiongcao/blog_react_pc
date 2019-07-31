import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Table, Popconfirm, Modal, Radio, message, Tag } from 'antd';
import * as Fetch from '@/libs/fetch';
import { MyButton } from '@/components'

import '@/pages/tagComponent/tagComponent.less'

class TagComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      tableHeight: 0,
      tagList: [],
      tagForm: {},
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          align: 'center',
          width: 80
        },
        {
          title: '标签名',
          dataIndex: 'name',
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
          title: '创建时间',
          dataIndex: 'createdDate',
          align: 'center',
          width: 150
        },
        {
          title: '最后修改时间',
          dataIndex: 'lastModifiedDate',
          align: 'center',
          width: 150
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
        },
      ]
    }
  }

  componentDidMount () {
		this.getCategoryList()
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
  
  getCategoryList () {
    Fetch.get(`tag/findAll`).then((res) => {
			if (res.code === 0) {
				this.setState({
					tagList: res.data
				})
			}
		})
  }

  updateStatus = (id, status) => {
    Fetch.post(`tag/updateStatus/${id}/${status}`).then((res) => {
			if (res.code === 0) {
        message.success("成功")
				this.getCategoryList()
			}
		})
  }

  openModal = (record) => {
    let id = record && record.id
    if (id) {	// 编辑
			let { name, rank, status } = record
			this.props.form.setFieldsValue({
				name, rank, status
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
      tagForm: record,
			id
		})
  }

  handleOk = e => {
		this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.state.id && (values.id = this.state.id)
        values = Object.assign({}, this.state.tagForm, values)
				Fetch.post(`tag/save`, values).then((res) => {
					if (res.code === 0) {
						message.success('保存成功')
						this.setState({
							visible: false
						})
						this.getCategoryList()
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

  render() {
    let { columns, tagList, tableLoading, tableHeight, visible } = this.state
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
      <div className="tag-manage">
        <div style={{marginBottom: '15px'}}><MyButton type="error" onClick={ this.openModal }>添 加</MyButton></div>
        <div className="table">
          <Table bordered rowKey="id" size="middle" loading={tableLoading}
            pagination={false}
            columns={columns}
            dataSource={tagList}
            scroll={{ x: 780, y: tableHeight }} 
          />
        </div>
        <Modal
          title='添加/编辑标签'
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item label="标签名称">
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

export default withRouter(Form.create({ name: 'tag' })(TagComponent))