import React, { Component } from 'react'
import { Upload, Icon, Modal } from 'antd'

class PicturesWall extends Component {
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
    render() {
        const { previewVisible, previewImage, fileList } = this.state
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
                    onPreview={this.handlePreview.bind(this)}
                    onChange={this.handleChange.bind(this)}
                >
                    {fileList.length >= maxImageLength ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

export default PicturesWall
