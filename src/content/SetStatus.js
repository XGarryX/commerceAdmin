import React, { Component } from 'react'
import { Input, Select, Button, message } from 'antd'
import axios from 'axios'
import { apiPath } from '../config/api'
import { statusList } from '../config/orderStatus'
import { expressList, expressStatusList } from '../config/express'
import '../style/content/SetStatus.less'

class SetStatus  extends Component {
    constructor(props) {
        super(props)

        this.submitChange = this.submitChange.bind(this)
        this.handleCountChange = this.handleCountChange.bind(this)

        this.state = {}
    }
    renderOption(data, name = 'name', key = 'id') {
        return data.map(item => {
            return <Select.Option key={item[key]} value={item[key]}>{item[name]}</Select.Option>
        })
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
        console.log(orderId)
        this.getData(`/business/order/info/${orderId}`)
            .then(({name, phone, email, mark, more, products, expressStatus, payStatus}) => {
                this.setState({
                    name, phone, email, mark, more, products, expressStatus, payStatus
                })
            })
    }
    submitChange() {
        const { orderId } = this.props
        this.getData(`/business/order/control/${orderId}`, this.state, 'PUT', '修改中...')
        .then(({resultCode}) => {
            resultCode == '200' && message.success('修改成功')
        })
    }
    handleOrderChange(key, value) {
        this.setState({
            [key]: value
        })
    }
    handleCountChange(count = 0) {
        const { products } = this.state
        this.setState({
            allPrice: products[0].price * count, 
            products: [Object.assign({}, products[0], {
                count
            })]
        })
    }
    componentDidMount() {
        const { orderId } = this.props
        this.Init(orderId)
    }
    componentWillReceiveProps ({ orderId }) {
        this.props.orderId !== orderId && this.Init(orderId)
    }
    render() {
        const payWay = [{name: '货到付款', id: 'cash'}]
        const { payStatus, name, phone, email, mark, more = {}, products = [{}], expressStatus, reason } = this.state
        const setMore = (key, value) => {
            this.handleOrderChange('more', Object.assign({}, more, {[key]: value}))
        }
        const attrs = [
            [{
                title: '商品属性'
            }], [{
                title: '订单状态',
                className: 'orderState',
                render: () => <Select className="select" value={payStatus} onChange={value => this.handleOrderChange('payStatus', value)}>{this.renderOption(statusList, 'name', 'status')}</Select>
            }, {
                title: '支付方式',
                render: () => <Select className="select" defaultValue="cash">{this.renderOption(payWay)}</Select>
            }], [{
                title: '数量/价格',
                className: 'countAndPrice',
                render: () => <p><Input value={products[0].count} onChange={e => this.handleCountChange(e.target.value)} /> / <Input value={(products[0].price || 0) / 100} disabled />元</p>
            }, {
                title: '邮编',
                render: () => <Input value={more.zipCode} onChange={e => setMore('zipCode', e.target.value)} />
            }], [{
                title: '姓名',
                render: () => <Input value={name} onChange={e => this.handleOrderChange('name', e.target.value)} />
            }, {
                title: '手机',
                render: () => <Input value={phone} onChange={e => this.handleOrderChange('phone', e.target.value)} />
            }], [{
                title: '电子邮箱',
                render: () => <Input value={email} onChange={e => this.handleOrderChange('email', e.target.value)} />
            }], [{
                title: '留言',
                render: () => <Input.TextArea value={mark} onChange={e => this.handleOrderChange('mark', e.target.value)} />
            }, {
                title: '地址',
                render: () => <Input.TextArea value={more.addressDetailed} onChange={e => setMore('addressDetailed', e.target.value)} />
            }], [{
                title: '快递设置',
                render: () => <Select className="select" value={more.express} onChange={value => setMore('express', value)} >{this.renderOption(expressList)}</Select>
            }, {
                title: '快递编号',
                render: () => <Input value={more.expressNumber} onChange={e => setMore('expressNumber', e.target.value)} />
            }], [{
                title: '物流状态',
                render: () => <Select className="select" value={expressStatus} onChange={value => this.handleOrderChange('expressStatus', value)} >{this.renderOption(expressStatusList, 'name', 'status')}</Select>
            }, {
                title: '异常描述',
                hide: expressStatus != '16',
                render: () => <Input.TextArea value={reason} onChange={e => this.handleOrderChange('reason', e.target.value)} />
            }], [{
                title: '操作备注',
                render: () => <Input.TextArea value={more.remarks} onChange={e => setMore('remarks', e.target.value)} />
            }]
        ]
        return (
            <div className="setStatus">
                <div className="product-info">
                {attrs.map((item, index) => {
                    return (
                        <div className="item-info" key={index}>
                        {item.map(({title, render, className, hide}) => {
                            return (
                                !hide && <div className={`info-block ${className && className}`} key={title}>
                                    <span className="title">{title}:</span>
                                    <div className="content">{render && render()}</div>
                                </div>
                            )
                        })}
                        </div>
                    )
                })}
                </div>
                <div className="botton-bar">
                    <Button type="primary" onClick={this.submitChange}>确认修改</Button>
                </div>
            </div>
        )
    }
}

export default SetStatus
