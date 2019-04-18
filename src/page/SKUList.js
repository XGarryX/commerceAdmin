import React, { Component } from 'react'
import { Table, Input, Select, Button, Modal } from 'antd'
import '../style/page/SKUList.less'
import SKUList from '../static/SKUList.json'

class SKU extends Component {
    constructor(props) {
        super(props)
        this.handleResize = this.handleResize.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handlePreview = this.handlePreview.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }
    state = {
        SKUList: [],
        size: 'default',
        isFetching: true,
        previewVisible: false,
        previewImage: ''
    }
    handlePageChange(page, pageSize) {
        console.log(page, pageSize)
    }
    handleResize = ((win) => {
        let _lastHeight, _lastOrderHeight
        return () => {
            const winHeight = win.innerHeight
            const parentElm = document.body.querySelector('#SKU-block')
            const orderElm = parentElm.querySelector('.SKU-list')
            if(_lastOrderHeight != orderElm.offsetHeight || _lastHeight != winHeight){
                const searchBar = parentElm.querySelector('.search-bar')
                const pagination = parentElm.querySelector('.ant-pagination')
                const tabelHeader = parentElm.querySelector('.ant-table-header')
                const scrollY = parentElm.offsetHeight - (searchBar && searchBar.offsetHeight || 0) - (pagination && pagination.offsetHeight || 0) - (tabelHeader && tabelHeader.offsetHeight || 0)
                this.setState({
                    scrollY
                })
                _lastOrderHeight = orderElm.offsetHeight
            }
            _lastHeight = winHeight
        }
    })(window)
    handlePreview(url) {
        this.setState({
            previewImage: url,
            previewVisible: true,
        });
    }
    handleCancel() {this.setState({ previewVisible: false })}
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                SKUList,
                isFetching: false
            })
        }, 1000)
        window.addEventListener('resize', this.handleResize)
    }
    componentDidUpdate() {this.handleResize()}
    componentWillUnmount() {window.removeEventListener('resize', this.handleResize)}
    render() {
        const { size, previewVisible, isFetching, scrollY, SKUList, previewImage } = this.state
        const columns = [{
            title: '产品图片',
            className: 'image',
            dataIndex: 'image',
            render: url => url && <img src={url} onClick={() => this.handlePreview(url)}/>
        }, {
            title: '内部名称',
            className: 'iname',
            dataIndex: 'iname',
        }, {
            title: 'SKU',
            className: 'SKU',
            dataIndex: 'SKU',
        }, {
            title: '属性',
            className: 'attributes',
            dataIndex: 'attributes',
        }]
        const options = [{
            key: 'department',
            title: '部门',
            render: props => <Select {...props}/>
        }, {
            key: 'iname',
            title: '内部名称',
            render: props => <Input {...props}/>
        }, {
            key: 'SKU',
            title: 'SKU',
            render: props => <Input {...props}/>
        }]
        return (
            <div className="SKU-block" id="SKU-block">
                <div className="search-bar">
                {
                    options.map(item => {
                        const { key, render, title, className } = item
                        const props = {
                            onChange: e => this.handleSeachOptionChange(key, e.target.value),
                            className: `opitons ${className || ''}`,
                            size: 'small'
                        }
                        return (
                            <label key={key}>
                                {title}:{render(props)}
                            </label>
                        )
                    })
                }
                    <p className="search-operating">
                        <Button type="primary" size={size}>搜索</Button>
                        <Button type="primary" icon="download" size={size}>导出EXCEL</Button>
                    </p>
                </div>
                <div className="SKU-list">
                    <Table
                        size="middle"
                        loading={isFetching}
                        className="productList"
                        rowKey="SKU"
                        bordered
                        columns={columns}
                        scroll={
                            {x: 1000, y: scrollY}
                        }
                        dataSource={SKUList}
                        onExpandedRowsChange={() => console.log(1)}
                        pagination={{
                            total: SKUList ? SKUList.length : 0,
                            pageSize: 10,
                            showTotal: total => `共有${total}条数据`,
                            showSizeChanger: true, 
                            onChange: this.handlePageChange
                        }}
                    />
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

export default SKU
