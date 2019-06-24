import React, { Component } from 'react'
import { Table, Input, Select, DatePicker, Button, message } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'
import { apiPath } from '../config/api'
import { addTab, toggleTab, setTabProps } from '../redux/action/tab'
import { langList, langTable } from '../config/lang'
import { statusObj, statusList } from '../config/orderStatus'
import { expressList, expressTable, expressStatusList, expressStatusTable } from '../config/express'
import exportExecl, { format } from '../public/exportExecl'
import '../style/content/orderList.less'

const { RangePicker } = DatePicker

class productList extends Component {
    constructor(props) {
        super(props)

        this.handleResize = this.handleResize.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.reSearch = this.reSearch.bind(this)
        this.handleTimeChange = this.handleTimeChange.bind(this)
        this.handleExport = this.handleExport.bind(this)
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
            return data || {}
        })
        .catch(err => {
            message.error(err.message)
            return {}
        })
    }
    getOrderList() {
        const { searchText, pageNo, pageSize } = this.state
        const params = Object.assign({}, searchText, {
            monent: undefined,
            pageSize,
            pageNo,
        })
        this.setState({
            isFetching: true
        })
        this.getData('/business/order/console/list', params)
        .then((data = {}) => {
            const {list, totalCount} = data
            this.setState({
                orderList: list,
                totalCount,
                isFetching: false
            })
        })
    }
    timeToDate(time) {
        let date = new Date(time)
        const toDouble = num => num > 9 ? num : '0' + num
        return `${date.getFullYear()}-${toDouble(date.getMonth() + 1)}-${toDouble(date.getDate())} ${toDouble(date.getHours())}:${toDouble(date.getMinutes())}:${toDouble(date.getSeconds())}`
    }
    setStatus(orderId) {
        const tabKey = "order-edit"
        const { addTab, toggleTab, setTabProps, tabList } = this.props
        const index = tabList.find(item => item.tabKey == tabKey)
        if (index) {
            setTabProps(tabKey, {orderId})
        } else {
            addTab({
                tabKey,
                name: '修改订单',
                path: 'SetStatus',
                props: {orderId}
            })
        }
        toggleTab(tabKey)
    }
    handleExport() {
        const nameMap = {
            '订单号': {
                key: 'id'
            },
            '地区': {
                key: 'lang',
                handle: lang => langTable[lang]
            },
            '订单状态': {
                key: 'payStatus',
                handle: status => statusObj[status]
            },
            '姓名': {
                key: 'name'
            },
            '电话': {
                key: 'phone'
            },
            '邮箱': {
                key: 'email'
            },
            '总价': {
                key: 'allPrice',
                handle: allPrice => allPrice / 100
            },
            '产品名': {
                key: 'products',
                handle: products => {
                    let { name, allSpecMatchValue } = products[0].product
                    return name + ' ' + allSpecMatchValue
                }
            },
            '内部名称': {
                key: 'products',
                handle: products => products[0].product.internalName
            },
            '邮编': {
                key: 'more',
                handle: (more = {}) => more.zipCode
            },
            '送货地址': {
                key: 'addressVo',
                handle: ({addressInfo}) => addressInfo
            },
            '留言': {
                key: 'mark'
            },
            '下单时间': {
                key: 'createTime',
                handle: time => this.timeToDate(time)
            },
            '快递单号': {
                key: 'more',
                handle: (more = {}) => more.expressNumber
            },
            '物流状态': {
                key: 'expressStatus',
                handle: status => expressStatusTable[status]
            },
            '备注': {
                key: 'more',
                handle: (more = {}) => more.remarks
            }
        }
        const { orderList = [] } = this.state
        exportExecl(format(orderList, nameMap), '订单列表')
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
        value = typeof value == 'object' ? value.target.value : value
        const { searchText } = this.state
        this.setState({
            searchText: Object.assign({}, searchText, {
                [key]: value
            })
        })
    }
    handleTimeChange(monent) {
        let startTime = this.timeToDate(monent[0]._d.getTime())
        let endTime = this.timeToDate(monent[1]._d.getTime())
        const { searchText } = this.state
        this.setState({
            searchText: Object.assign({}, searchText, {
                monent,
                startTime,
                endTime
            })
        })
    }
    componentDidMount() {
        this.getOrderList()
        this.getData('/common/departments')
        .then(({list}) => {
            this.setState({
                department: list
            })
        })
        window.addEventListener('resize', this.handleResize)
    }
    componentDidUpdate() {
        this.handleResize()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }
    render() {
        const { isFetching, orderList, totalCount, size, department = [], pageNo, pageSize, searchText } = this.state
        const renderOption = (data, key = 'key', name = 'name') => data.map(item => <Select.Option key={item[key]} value={item[key]}>{item[name]}</Select.Option>)
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
            dataIndex: 'lang',
            render: lang => langTable[lang]
        // }, {
        //     title: '仓库',
        //     className: 'stock',
        //     dataIndex: 'stock',
        }, {
            title: '物流',
            className: 'logistics',
            dataIndex: 'more',
            key: 'express',
            render: (more = {}) => expressTable[more.express]
        }, {
            title: '订单状态',
            className: 'state',
            dataIndex: 'payStatus',
            render: status => statusObj[status]
        }, {
            title: '姓名',
            className: 'userName',
            dataIndex: 'name',
        }, {
            title: '电话',
            className: 'phone',
            dataIndex: 'phone',
        }, {
            title: '邮箱',
            className: 'Email',
            dataIndex: 'email',
        }, {
            title: '总价',
            className: 'total',
            dataIndex: 'allPrice',
            render: allPrice => allPrice / 100
        }, {
            title: '产品名',
            className: 'productName',
            dataIndex: 'products',
            render: (products = [{}]) => {
                const { product = {}, count } = products[0]
                return (
                    <p>
                        <span>{product.name}</span>
                        <br />
                        <span>{product.allSpecMatchValue} x{count}</span>
                    </p>
                )
            }
        }, {
            title: '内部名称',
            className: 'iNmae',
            dataIndex: 'products',
            key: 'iNmae',
            render: (products = [{product:{}}]) => products[0].product.internalName
        }, {
            title: '邮编',
            className: 'postalCode',
            dataIndex: 'more',
            key: 'zipCode',
            render: (more = {}) => more.zipCode
        }, {
            title: '送货地址',
            className: 'address',
            dataIndex: 'addressVo',
            render: (addressVo = {}) => {
                const { addressInfo } = addressVo
                return addressInfo
            }
        }, {
            title: '留言',
            className: 'message',
            dataIndex: 'mark',
        }, {
            title: '下单时间',
            className: 'orderTime',
            dataIndex: 'createTime',
            render: time => this.timeToDate(time),
        }, {
            title: '发货时间',
            className: 'postTime',
            dataIndex: 'postTime',
        }, {
            title: '快递单号',
            className: 'expressNumber',
            dataIndex: 'more',
            key: 'expressNumber',
            render: (more = {}) => more.expressNumber
        }, {
            title: '物流状态',
            className: 'postState',
            dataIndex: 'expressStatus',
            render: status => expressStatusTable[status]
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
        // }, {
        //     title: '汇率',
        //     className: 'exchangeRate',
        //     dataIndex: 'exchangeRate',
        }, {
            title: '重复数',
            className: 'repeatNumber',
            dataIndex: 'repeatNumber',
        }, {
            title: '备注',
            className: 'remarks',
            dataIndex: 'more',
            key: 'more',
            render: (more = {}) => more.remarks
        }, {
            title: '操作',
            className: 'operating',
            dataIndex: 'id',
            key: 'operating',
            render: id => <a href="javascript:;" onClick={() => this.setStatus(id)}>详情</a>,
        }]
        const options = [{
            key: 'departmentId',
            title: '部门',
            render: props => {
                return(
                    <Select {...props}>
                    {renderOption(department, 'id', 'roleName')}
                    </Select>
                )
            }
        // }, {
        //     key: 'domain',
        //     title: '域名',
        //     className: "long",
        //     render: props => <Select {...props}/>
        }, {
            key: 'expressStatus',
            title: '物流状态',
            render: props => <Select {...props}>{renderOption(expressStatusList, 'status')}</Select>
        }, {
            key: 'express',
            title: '物流',
            render: props => <Select {...props}>{renderOption(expressList, 'id')}</Select>
        }, {
            key: 'lang',
            title: '地区',
            render: props => {
                return(
                    <Select {...props}>
                    {renderOption(langList)}
                    </Select>
                )
            }
        }, {
            key: 'payStatus',
            title: '订单状态',
            render: props => <Select {...props}>{renderOption(statusList, 'status')}</Select>
        }, {
            key: 'phone',
            title: '电话',
            className: "long",
            render: props => <Input {...props}/>
        }, {
            key: 'keyWord',
            title: '关键词',
            className: "long",
            render: props => <Input {...props}/>
        }, {
            key: 'monent',
            title: '起始时间',
            render: props => <RangePicker {...props} onChange={this.handleTimeChange} style={{width: 200}}/>
        }]
        return (
            <div className="order-block" id="order-block">
                <div className="search-bar">
                {
                    options.map(item => {
                        const { key, render, title, className } = item
                        const props = {
                            onChange: e => this.handleSeachOptionChange(key, e),
                            value: searchText[key],
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
                        <Button type="primary" icon="download" size={size} onClick={this.handleExport}>导出EXCEL</Button>
                    </p>
                </div>
                <div className="order-list">
                    <Table
                        size="middle"
                        loading={isFetching}
                        className="productList"
                        rowKey="id"
                        bordered
                        columns={columns}
                        scroll={
                            {x: 1000, y: this.state.scrollY}
                        }
                        dataSource={orderList}
                        pagination={{
                            total: totalCount || 0,
                            pageNo: pageNo,
                            pageSize: pageSize,
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

const mapStoreToProps = store => {
    const { tab: { tabList } } = store
    return {
        tabList
    }
}
  
const mapDispathToProps = dispatch => ({
    addTab: tabKey => dispatch(addTab(tabKey)),
    toggleTab: tabKey => dispatch(toggleTab(tabKey)),
    setTabProps: (tabKey, props) => dispatch(setTabProps(tabKey, props)),
})

export default connect(
    mapStoreToProps,
    mapDispathToProps
)(productList)

