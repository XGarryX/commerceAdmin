import React, { Component } from 'react'
import { Table, Input, Select, Button, Modal, message } from 'antd'
import axios from 'axios'
import { apiPath } from '../config/api'
import exportExecl, { format } from '../public/exportExecl'
import '../style/content/SKUList.less'

class SKU extends Component {
    constructor(props) {
        super(props)
        this.handleResize = this.handleResize.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handlePreview = this.handlePreview.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSeachOptionChange = this.handleSeachOptionChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.reSearch = this.reSearch.bind(this)
        this.handleExport = this.handleExport.bind(this)
    }
    state = {
        skuList: null,
        size: 'default',
        departmentList: null,
        isFetching: true,
        previewVisible: false,
        previewImage: '',
        searchText: {},
        pageSize: 10,
        pageNo: 1,
    }
    handlePageChange(pageNo, pageSize) {
        this.setState({
            pageNo,
            pageSize
        }, () => this.getSkuList())
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
    handleSeachOptionChange(key, value) {
        const { searchText } = this.state
        this.setState({
            searchText: Object.assign(searchText, {
                [key]: value
            })
        })
    }
    handleExport() {
        const nameMap = {
            '内部名称': {key: 'internalName'},
            'SKU': {key: 'id'},
            '属性': {key: 'skuValue'},
        }
        const { skuList = [] } = this.state
        exportExecl(format(skuList, nameMap), 'SKU')
    }
    handleSearch() {
        this.setState({
            pageNo: 1,
        }, () => this.getSkuList())
    }
    reSearch() {
        this.setState({
            searchText: {},
            pageNo: 1
        }, () => this.getSkuList())
    }
    getData(url, params){
        const { checkTimeOut, updateTime, token } = this.props
        checkTimeOut()
        updateTime(new Date().getTime())
        return axios({
            url: apiPath + url,
            method: 'GET',
            params,
            headers: {
                accessToken: token
            }
        })
        .then(({data, data: {resultCode, resultMessage}}) => {
            if(resultCode != "200"){
                throw({resultMessage})
            }
            return (data || {})
        })
        .catch(({resultMessage}) => {
            message.error(resultMessage)
        })
    }
    getSkuList() {
        const { searchText, pageNo, pageSize } = this.state
        const params = Object.assign(searchText, {
            pageSize,
            pageNo,
        })
        this.setState({
            isFetching: true
        })
        this.getData('/business/product/control/skus', params)
        .then((data = {}) => {
            const {list, totalCount} = data
            this.setState({
                skuList: list,
                totalCount,
                isFetching: false
            })
        })
    }
    getDepartments() {
        this.getData('/common/departments')
        .then(({list}) => {
            this.setState({
                departmentList: list,
            })
        })
    }
    componentDidMount() {
        this.getSkuList()
        this.getDepartments()
        window.addEventListener('resize', this.handleResize)
    }
    componentDidUpdate() {
        this.handleResize()
    }
    componentWillUnmount() {window.removeEventListener('resize', this.handleResize)}
    render() {
        const { size, previewVisible, scrollY, isFetching, skuList, previewImage, departmentList, totalCount, searchText: { department, internalName, id }, pageNo, pageSize } = this.state
        const columns = [{
            title: '产品图片',
            className: 'image',
            dataIndex: 'imgUrl',
            render: url => url && <img src={url} onClick={() => this.handlePreview(url)}/>
        }, {
            title: '内部名称',
            className: 'iname',
            dataIndex: 'internalName',
        }, {
            title: 'SKU',
            className: 'SKU',
            dataIndex: 'id',
        }, {
            title: '属性',
            className: 'attributes',
            dataIndex: 'skuValue',
        }]
        const options = [{
            key: 'department',
            title: '部门',
            render: props => {
                return (<Select {...props} loading={!departmentList} onChange={e => this.handleSeachOptionChange(props.key, e)} value={department} >
                {departmentList && departmentList.map(item => (
                    <Select.Option value={item.id} key={item.id}>{item.roleName}</Select.Option>
                ))}
                </Select>)
            }
        }, {
            key: 'internalName',
            title: '内部名称',
            render: props => <Input {...props} onChange={e => this.handleSeachOptionChange(props.key, e.target.value)} value={internalName} />
        }, {
            key: 'id',
            title: 'SKU',
            render: props => <Input {...props} onChange={e => this.handleSeachOptionChange(props.key, e.target.value)} value={id} />
        }]
        return (
            <div className="SKU-block" id="SKU-block">
                <div className="search-bar">
                {
                    options.map(item => {
                        const { key, render, title, className } = item
                        const props = {
                            key,
                            className: `opitons ${className || ''}`,
                        }
                        return (
                            <label key={key}>
                                {title}:{render(props)}
                            </label>
                        )
                    })
                }
                    <p className="search-operating">
                        <Button type="primary" size={size} onClick={this.handleSearch} >搜索</Button>
                        <Button type="primary" size={size} onClick={this.reSearch} >重置</Button>
                        <Button type="primary" icon="download" size={size} onClick={this.handleExport} >导出EXCEL</Button>
                    </p>
                </div>
                <div className="SKU-list">
                    <Table
                        size="middle"
                        loading={isFetching}
                        className="productList"
                        rowKey="id"
                        bordered
                        columns={columns}
                        scroll={
                            {x: 1000, y: scrollY}
                        }
                        dataSource={skuList}
                        onExpandedRowsChange={() => console.log(1)}
                        pagination={{
                            total: totalCount || 0,
                            pageSize,
                            showTotal: totalCount => `共有${totalCount || 0}条数据`,
                            showSizeChanger: true, 
                            onChange: this.handlePageChange,
                            onShowSizeChange: this.handlePageChange,
                            current: pageNo,
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
