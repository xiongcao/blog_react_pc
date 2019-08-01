import React, { Component } from 'react';
import { Modal, Table, message } from 'antd';
import * as Fetch from '@/libs/fetch';

class CategoryModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: props.visible,
      categoryList: [],
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          align: 'center',
          width: 100
        },
        {
          title: '封面',
          dataIndex: 'cover',
          align: 'center',
          width: 90,
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
          align: 'center'
        },
        {
          title: '序号',
          dataIndex: 'rank',
          align: 'center',
          width: 100
        }
      ]
    }
  }

  componentWillMount () {
    this.getCategoryList()
  }

  getCategoryList () {
    Fetch.get(`category/findSuperAll`).then((res) => {
			if (res.code === 0) {
				this.setState({
					categoryList: res.data
				})
			}
		})
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      visible: nextProps.visible,
      selectedRowKeys: [],
      selectedRows: []
    })
  }

  handleOk = e => {
    if (this.state.selectedRows.length === 0) {
      return message.warning("请选择类型")
    } else {
      Modal.confirm({
        title: '您确认执行此操作吗',
        content: '此操作会覆盖您已创建的类型，请谨慎选择',
        onOk: () => {
          this.setState({
            visible: false,
          });
          this.props.onChange(this.state.selectedRows);
        }
      })
    }
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
    this.props.onChange();
  };

  render () {
    const { visible, columns, categoryList, selectedRowKeys } = this.state
    const rowSelection = {
			columnWidth: 60,
			selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({
          selectedRowKeys,
          selectedRows
				})
      }
    }
    return (
      <Modal
        title="公共库类型列表"
        visible={visible}
        width={666}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{
          padding: '6px 24px',
          minHeight: 300
        }}
        className="CategoryModal"
      >
        <Table bordered rowKey="id" size="middle"
          pagination={false}
          columns={columns}
          dataSource={categoryList}
          rowSelection={rowSelection}
          scroll={{ y: 275 }}
        />
      </Modal>
    );
  }
}

export default CategoryModal;
