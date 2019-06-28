import React, { Component } from 'react'
import axios from 'axios'
import { message } from "antd";
import { apiPath } from '../config/api'
import { statusObj } from '../config/orderStatus'
import { expressTable, expressStatusTable } from '../config/express'
import { langTable } from '../config/lang'
import '../style/content/OrderInfo.less'

class OrderInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    getData(url, params, method = 'GET', tips = '加载中'){
        const { checkTimeOut, updateTime, token } = this.props
        const hide = message.loading(tips, 0);
        let handle = {
            url: apiPath + url,
            method,
            headers: {
                accessToken: token
            }
        }
        const paramsName = method == 'GET' ? 'params' : 'data'
        handle = Object.assign(handle, {
            [paramsName]: params
        })
        checkTimeOut()
        updateTime(new Date().getTime())
        return axios(handle)
        .then(({data, data: {resultCode, resultMessage}}) => {
            if(resultCode != "200"){
                throw({message: resultMessage})
            }
            hide()
            return data || {}
        })
        .catch(err => {
            message.error(err.message)
            hide()
            return {}
        })
    }
    Init(orderId) {
        this.getData(`/business/order/user/list?id=${orderId}`)
            .then(({list = [{}]}) => {
                console.log(list[0])
                this.setState({
                    orderInfo: list[0]
                })
            })
    }
    filterMap(arr = [], fn) {
        let resArr = []
        for(let i in arr){
            let item = arr[i]
            let res = fn(item, i, arr)
            res && resArr.push(res)
        }
        return resArr
    }
    componentDidMount() {
        const { orderId } = this.props
        this.Init(orderId)
    }
    componentWillReceiveProps ({ orderId }) {
        this.props.orderId !== orderId && this.Init(orderId)
    }
    render() {
        const { filterMap, state: { orderInfo } } = this
        const columns = [{
            title: '订单状态',
            dataIndex: 'payStatus',
            render: payStatus => statusObj[payStatus]
        }, {
            title: '订单号',
            dataIndex: 'id',
        }, {
            title: '产品名',
            dataIndex: 'products',
            render: (products = [{}]) => {
                const { product = {}, count } = products[0]
                return (
                    <p>
                        <span>{product.name}</span>
                        <span>{product.allSpecMatchValue} x {count}</span>
                    </p>
                )
            },
        }, {
            title: '内部名称',
            dataIndex: 'products',
            key: 'iName',
            render: (products = [{product:{}}]) => products[0].product.internalName,
        }, {
            title: '地区',
            dataIndex: 'lang',
            render: lang => langTable[lang],
        }, {
            title: '总价',
            dataIndex: 'allPrice',
            render: allPrice => allPrice / 100,
        }, {
            title: '物流',
            dataIndex: 'more',
            key: 'express',
            render: (more = {}) => expressTable[more.express],
        }, {
            title: '姓名',
            dataIndex: 'name',
        }, {
            title: '邮箱',
            dataIndex: 'email',
            render: email => email || '无',
        }, {
            title: '送货地址',
            dataIndex: 'addressVo',
            render: (addressVo = {}) => {
                const { addressInfo } = addressVo
                return addressInfo
            },
        }, {
            title: '下单时间',
            dataIndex: 'buyTimeInfo',
            render: (buyTimeInfo = {}) => buyTimeInfo.buyTime,
        }, {
            title: '留言',
            dataIndex: 'mark',
            render: mark => mark || '无',
        }, {
            title: '物流状态',
            dataIndex: 'expressStatus',
            render: status => expressStatusTable[status],
        }, {
            title: '发货时间',
            dataIndex: 'updateLog',
            render: (updateLog = []) => {
                const res = updateLog.find(({expressStatus}) => expressStatus == 11) || {}
                return res.statusUpdateTime
            },
        }, {
            title: '快递单号',
            dataIndex: 'more',
            key: 'expressNumber',
            render: (more = {}) => more.expressNumber || '无',
        }, {
            title: '订单更新',
            dataIndex: 'updateLog',
            key: 'orderLog',
            render: (orderLog = []) => {
                return (
                    <ul className="log-list">
                    {
                        filterMap(orderLog, ({nowPayStatus, prePayStatus, statusUpdateTime}) => {
                            if(nowPayStatus != prePayStatus){
                                return (
                                    <li className="log-item" key={nowPayStatus}>
                                        <span>{statusObj[nowPayStatus]}</span>  <span>{statusUpdateTime}</span>
                                    </li>
                                )
                            }
                        })
                    }
                    </ul>
                )
            },
        }, {
            title: '物流更新',
            dataIndex: 'updateLog',
            key: 'orderLog',
            render: (orderLog = []) => {
                return (
                    <ul className="log-list">
                    {
                        filterMap(orderLog, ({nowPayStatus, prePayStatus, expressStatus, statusUpdateTime}) => {
                            if(nowPayStatus == prePayStatus){
                                return (
                                    <li className="log-item" key={expressStatus}>
                                        <span>{expressStatusTable[expressStatus]}</span>  <span>{statusUpdateTime}</span>
                                    </li>
                                )
                            }
                        })
                    }
                    </ul>
                )
            },
        }]
        return (
            <div className="OrderInfo">
                <ul className="info-list">
                {orderInfo && columns.map(({title, dataIndex, key = dataIndex, render}) => {
                    const value = orderInfo[dataIndex]
                    return (
                        <li key={key} className="info-item">
                            <span className="title">{title}:</span>
                            <div className="content">{render ? render(value, orderInfo) : value}</div>
                        </li>
                    )
                })}
                </ul>
            </div>
        )
    }
}

export default OrderInfo
