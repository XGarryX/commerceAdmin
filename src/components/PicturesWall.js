import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Upload, Icon, Modal, message } from 'antd'

class PicturesWall extends Component {
    constructor(props) {
        super(props)

        this.handlePreview = this.handlePreview.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    }
    handleCancel() {
        this.setState({ previewVisible: false })
    }
    handleChange({ fileList }) {
        this.setState({ fileList })
    }
    handlePreview(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    beforeUpload({type, size}) {
        const isJPG = type === 'image/jpeg';
        if (!isJPG) {
            message.error('请上传图片！');
        }
        const isLt2M = size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片的大小超过2MB');
        }
        return isJPG && isLt2M;
    }
    render() {
        const { previewVisible, previewImage, fileList } = this.state
        const { token } = this.props
        const maxImageLength = 4
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        return (
            <div className="clearfix">
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    multiple
                    beforeUpload={this.beforeUpload}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    headers={{
                        Authorization: token
                    }}
                >
                    {fileList.length >= maxImageLength ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

const mapStoreToProps = store => {
    const { token, api } = store
    return {
        token,
        api
    }
}

export default connect(
    mapStoreToProps
)(PicturesWall)
