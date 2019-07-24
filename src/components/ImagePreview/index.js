import React, { Component } from 'react';
import { Modal } from 'antd';
import './index.less';

class ImagePreview extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false
    }
  }

  preview = () => {
    this.setState({
      visible: true
    })
  }

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render () {
    const { imagePath, css } = this.props

    return (
      <div className="imagePreview" style={css}>
        <div className="td" onClick={this.preview} style={css}>
          <div className="img" style={{'backgroundImage':'url('+imagePath+')'}}></div>
        </div>
        <Modal
          footer={null}
          closable={false}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className="imageModel"
        >
          <div className="commentImage">
            <img src={imagePath} alt=""/>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ImagePreview;
