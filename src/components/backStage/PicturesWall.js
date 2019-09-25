import React from 'react';
import config from '../../config';
import { Upload, Icon, message } from 'antd';
import { toJS } from 'mobx';


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type.includes('image/');
  if (!isJPG) {
    message.error('只能上传图片！');
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error('图片大于10MB!');
  }
  return isJPG && isLt10M;
}

class PicturesWall extends React.Component {
  state = {
    loading: false,
    fileList: [],
    imageUrl: ""
  };

  componentDidMount() {
    this.setState({
      imageUrl: toJS(this.props.imgUrl)
    })
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      const path = info.file.response.data
      getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl, loading: false },
        this.props.isAdd ? () => { this.props.onChange(config.PIC_URL + path) }
          :() => { this.props.getImgUrl(<img src={config.PIC_URL + path} alt="avatar" style={{ height: '100px', width: '100px' }} />) }
      ))
    }
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const {imageUrl} = this.state;

    return (

      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={config.UPLOAD_URL}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ height: '100px', width: '100px' }} /> : uploadButton}
      </Upload>

    );
  }
}

export default PicturesWall;