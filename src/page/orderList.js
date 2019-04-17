import React, { Component } from 'react'
import { Table, Input, Select, DatePicker } from 'antd'
import axios from 'axios'
import orderList from '../static/orderList.json'
import '../style/page/orderList.less'

const { RangePicker } = DatePicker

class productList extends Component {
    constructor(props) {
        super(props)
        this.handleResize = this.handleResize.bind(this)
    }
    state = {
        orderList: [],
        isFetching: true,
        scrollY: 0,
    }
    handlePageChange(page, pageSize) {
        console.log(page, pageSize)
    }
    handleResize = ((win) => {
        let _lastHeight
        return () => {
            const winHeight = win.innerHeight
            if(_lastHeight != winHeight){
                const parentElm = document.body.querySelector('#order-block')
                const searchBar = parentElm.querySelector('.search-bar')
                const pagination = parentElm.querySelector('.ant-pagination')
                const tabelHeader = parentElm.querySelector('.ant-table-header')
                const scrollY = parentElm.offsetHeight - (searchBar && searchBar.offsetHeight || 0) - (pagination && pagination.offsetHeight || 0) - (tabelHeader && tabelHeader.offsetHeight || 0)
                this.setState({
                    scrollY
                })
            }
            _lastHeight = winHeight
        }
    })(window)
    handleSeachOptionChange(key, value) {
        this.setState({
            [key]: value
        })
    }
    renderSearchOption(options) {
        return options.map(item => {
            const { key, render, title } = item
            return (
                <label>
                    {title}:
                    {
                        render(value => {
                            this.handleSeachOptionChange(key, value)
                        })
                    }
                </label>
            )
        })
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                orderList,
                isFetching: false
            })
        }, 1000)
        window.addEventListener('resize', this.handleResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }
    render() {
        const { isFetching, orderList } = this.state
        const columns = [{
            title: '订单号',
            className: 'orderId',
            dataIndex: 'orderId',
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
            dataIndex: 'message',
        }, {
            title: '下单时间',
            className: 'orderTime',
            dataIndex: 'orderTime',
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
            render: handleChange => <Select onChange={e => handleChange(e)}/>
        }, {
            key: 'domain',
            title: '域名',
            render: handleChange => <Select onChange={e => handleChange(e)}/>
        }]
        return (
            <div className="order-block" id="order-block">
                <div className="search-bar">
                    {/* <label>
                        部门:<Select size="small" className="opitons"></Select>
                    </label>
                    <label>
                        域名:<Select size="small" className="opitons long"></Select>
                    </label>
                    <label>
                        物流状态:<Select size="small" className="opitons"></Select>
                    </label>
                    <label>
                        物流:<Select size="small" className="opitons"></Select>
                    </label>
                    <label>
                        地区:<Select size="small" className="opitons"></Select>
                    </label>
                    <label>
                        订单状态:<Select size="small" className="opitons"></Select>
                    </label>
                    <label>
                        关键词:<Input size="small" className="opitons long" />
                    </label>
                    <label>
                        起始时间:<RangePicker size="small" style={{width: 200}} className="opitons" />
                    </label> */}
                    {...this.renderSearchOption(options)}
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
                        onExpandedRowsChange={() => console.log(1)}
                        pagination={{
                            total: orderList ? orderList.length : 0,
                            pageSize: 10,
                            showTotal: total => `共有${total}条数据`,
                            showSizeChanger: true, 
                            onChange: this.handlePageChange.bind(this)
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default productList
