import React, { Component, Fragment } from 'react';
import { Upload, Icon, Modal  } from 'antd';
import { api, oss } from '@/libs/publicPath.js'
import './index.less';

class UploadImage extends Component {
  constructor(props){
    super(props)
    this.state = {
      fileList: [],
      previewVisible: false,
      previewImage: ''
    }
  }

  componentWillMount() {
    this.setState({
      fileList: [
        {
          uid: '-1',
          url: this.props.imagePath ? oss + this.props.imagePath : require('@/assets/img/defaultComm.png')
        }
      ]
    })
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
		if (fileList[0] && fileList[0].response) {
			this.props.uploadSuccess(fileList[0].response.data)
		}
		this.setState({ fileList })
	}

  render () {
    const { previewVisible, previewImage, fileList } = this.state;
		const uploadButton = (
      <div>
        <Icon type="plus" />
      </div>
    );

    return (
      <Fragment>
        <Upload
          action={`${api}oss/${this.props.folder}`}
          accept="jpg,png,jpeg,gif"
          listType="picture-card"
          withCredentials={true}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Fragment>
    );
  }
}

export default UploadImage;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}