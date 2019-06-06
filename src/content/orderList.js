import React, { Component } from 'react'
import { Table, Input, Select, DatePicker, Button } from 'antd'
import axios from 'axios'
import { apiPath } from '../config/api'
import '../style/content/orderList.less'

const { RangePicker } = DatePicker

class productList extends Component {
    constructor(props) {
        super(props)

        this.handleResize = this.handleResize.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.reSearch = this.reSearch.bind(this)
    }
    state = {
        orderList: [],
        isFetching: true,
        scrollY: 0,
        size: 'default',
        searchText: {},
        pageNo: 1,
        pageSize: 10
    }
    handleSearch() {
        this.setState({
            pageNo: 1,
        }, () => this.getOrderList())
    }
    reSearch() {
        this.setState({
            searchText: {},
            pageNo: 1
        }, () => this.getOrderList())
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
                throw({message: resultMessage})
            }
            return (data || {})
        })
        .catch(({message}) => {
            message.error(message)
        })
    }
    getOrderList() {
        const { searchText, pageNo, pageSize } = this.state
        const params = Object.assign(searchText, {
            pageSize,
            pageNo,
        })
        this.setState({
            isFetching: true
        })
        this.getData('/business/order/control/console/list', params)
        .then((data = {}) => {
            const {list, totalCount} = data
            this.setState({
                orderList: list,
                totalCount,
                isFetching: false
            })
        })
    }
    handlePageChange(pageNo, pageSize) {
        this.setState({
            pageNo,
            pageSize
        }, () => this.getOrderList())
    }
    handleResize = ((win) => {
        let _lastHeight, _lastOrderHeight
        return () => {
            const winHeight = win.innerHeight
            const parentElm = document.body.querySelector('#order-block')
            const orderElm = parentElm.querySelector('.order-list')
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
    handleSeachOptionChange(key, value) {
        const { searchText } = this.state
        this.setState(Object.assign(searchText, {
            [key]: value
        }), () => {
            console.log(this.state)
        })
    }
    componentDidMount() {
        this.getOrderList()
        window.addEventListener('resize', this.handleResize)
    }
    componentDidUpdate() {
        this.handleResize()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }
    render() {
        const { isFetching, orderList, totalCount, size } = this.state
        const columns = [{
            title: '订单号',
            className: 'orderId',
            dataIndex: 'id',
        }, {
            title: '域名',
            className: 'domain',
            dataIndex: 'domain',
        }, {
            title: '地区',
            className: 'area',
            dataIndex: 'area',
        }, {
            title: '仓库',
            className: 'stock',
            dataIndex: 'stock',
        }, {
            title: '物流',
            className: 'logistics',
            dataIndex: 'logistics',
        }, {
            title: '订单状态',
            className: 'state',
            dataIndex: 'state',
        }, {
            title: '姓名',
            className: 'userName',
            dataIndex: 'userName',
        }, {
            title: '电话',
            className: 'phone',
            dataIndex: 'phone',
        }, {
            title: '邮箱',
            className: 'Email',
            dataIndex: 'Email',
        }, {
            title: '总价',
            className: 'total',
            dataIndex: 'total',
        }, {
            title: '产品名',
            className: 'productName',
            dataIndex: 'productName',
        }, {
            title: '内部名称',
            className: 'iNmae',
            dataIndex: 'iName',
        }, {
            title: '邮编',
            className: 'postalCode',
            dataIndex: 'postalCode',
        }, {
            title: '送货地址',
            className: 'address',
            dataIndex: 'address',
        }, {
            title: '留言',
            className: 'message',
            dataIndex: 'mark',
        }, {
            title: '下单时间',
            className: 'orderTime',
            dataIndex: 'createTime',
            render: time => {
                let date = new Date(time)
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}\n${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            }
        }, {
            title: '发货时间',
            className: 'postTime',
            dataIndex: 'postTime',
        }, {
            title: '快递单号',
            className: 'postNumber',
            dataIndex: 'postNumber',
        }, {
            title: '物流状态',
            className: 'postState',
            dataIndex: 'postState',
        }, {
            title: '已结款金额',
            className: 'payment',
            dataIndex: 'payment',
        }, {
            title: '运费',
            className: 'postFee',
            dataIndex: 'postFee',
        }, {
            title: '手续费',
            className: 'handlingFee',
            dataIndex: 'handlingFee',
        }, {
            title: '汇率',
            className: 'exchangeRate',
            dataIndex: 'exchangeRate',
        }, {
            title: '重复数',
            className: 'repeatNumber',
            dataIndex: 'repeatNumber',
        }, {
            title: '备注',
            className: 'remarks',
            dataIndex: 'remarks',
        }, {
            title: '操作',
            className: 'operating',
            dataIndex: 'operating',
            render: () => <a href="javascript:;">详情</a>,
        }]
        const options = [{
            key: 'department',
            title: '部门',
            render: props => <Select {...props}/>
        }, {
            key: 'domain',
            title: '域名',
            className: "long",
            render: props => <Select {...props}/>
        }, {
            key: 'postState',
            title: '物流状态',
            render: props => <Select {...props}/>
        }, {
            key: 'logistics',
            title: '物流',
            render: props => <Select {...props}/>
        }, {
            key: 'area',
            title: '地区',
            render: props => <Select {...props}/>
        }, {
            key: 'state',
            title: '订单状态',
            render: props => <Select {...props}/>
        }, {
            key: 'keyWords',
            title: '关键词',
            className: "long",
            render: props => <Input {...props}/>
        }, {
            key: 'startTime',
            title: '起始时间',
            render: props => <RangePicker {...props} style={{width: 200}}/>
        }]
        return (
            <div className="order-block" id="order-block">
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
                        <Button type="primary" size={size} onClick={this.handleSearch} >搜索</Button>
                        <Button type="primary" size={size} onClick={this.reSearch} >重置</Button>
                        <Button type="primary" icon="download" size={size}>导出EXCEL</Button>
                    </p>
                </div>
                <div className="order-list">
                    <Table
                        size="middle"
                        loading={isFetching}
                        className="productList"
                        rowKey="orderId"
                        bordered
                        columns={columns}
                        scroll={
                            {x: 1000, y: this.state.scrollY}
                        }
                        dataSource={orderList}
                        pagination={{
                            total: totalCount || 0,
                            pageSize: 10,
                            showTotal: totalCount => `共有${totalCount}条数据`,
                            showSizeChanger: true, 
                            onChange: this.handlePageChange,
                            onShowSizeChange: this.handlePageChange,
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default productList
