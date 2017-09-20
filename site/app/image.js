import React from 'react';
import { Upload, Icon, Modal } from 'antd';

class PicturesWall extends React.Component {
  state = {
    imgDest:'',
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    console.log(file,999)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
      imgDest:file.response.result === 'success'?file.response.path:''
    });
  }

  handleChange = ({ fileList,file }) => {
      this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList,imgDest } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/upload"
          listType="picture-card"
          fileList={fileList}
          name="imgfile"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 20 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
          <div><span style={{fontWeight:'bold'}}>图片地址是:</span><a href={imgDest} target="_blank">{imgDest}</a></div>
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;