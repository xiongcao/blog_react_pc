import React, { Component } from 'react';
import { Modal, Table, message } from 'antd';
import * as Fetch from '@/libs/fetch';

class TagModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: props.visible,
      tagList: [],
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

  UNSAFE_componentWillMount () {
    this.getTagList()
  }

  getTagList () {
    Fetch.get(`tag/findSuperAll`).then((res) => {
			if (res.code === 0) {
				this.setState({
					tagList: res.data
				})
			}
		})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
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
    const { visible, columns, tagList, selectedRowKeys } = this.state
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
        className="TagModal"
      >
        <Table bordered rowKey="id" size="middle"
          pagination={false}
          columns={columns}
          dataSource={tagList}
          rowSelection={rowSelection}
          scroll={{ y: 275 }}
        />
      </Modal>
    );
  }
}

export default TagModal;
