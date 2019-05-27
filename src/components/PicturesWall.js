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
    handleChange(fileObj) {
        let {file, file: {response}, fileList} = fileObj
        if (file.status == "error") {
            const index = fileList.findIndex(item => item.uid == file.uid)
            fileList = [...fileList.slice(0, index), ...fileList.slice(index + 1, fileList.length)]
            message.error('上传失败')
        } else if (file.status == "done" && response.resultCode == "200") {
            message.success('上传成功')
        }
        this.beforeUpload(file) && this.setState({ fileList }, () => this.props.onImageUpload(this.state.fileList))
    }
    handlePreview(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    beforeUpload({type, size}) {
        const isJPG = type.match('image')
        if (!isJPG) {
            message.error('请上传图片！')
        }
        const isLt2M = size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error('图片的大小超过2MB')
        }
        return isJPG && isLt2M
    }
    componentWillReceiveProps (newProps) {
        newProps.childUpInit && this.setState({
            previewVisible: false,
            previewImage: '',
            fileList: [],
        })
    }
    render() {
        const { previewVisible, previewImage, fileList } = this.state
        const { token, api } = this.props
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
                    action={`${api}/business/product/control/image/upload`}
                    headers={{Authorization: this.props.token}}
                    fileList={fileList}
                    multiple
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
