import React, { Component } from 'react'
import { Input, Select, Button, message } from 'antd'
import axios from 'axios'
import { apiPath } from '../config/api'
import { statusList } from '../config/orderStatus'
import '../style/content/SetStatus.less'

class SetStatus  extends Component {
    constructor(props) {
        super(props)

        this.state = {
            status: '',

        }
    }
    renderOption(data, name = 'name', key = 'id') {
        return data.map(item => {
            return <Select.Option key={item[key]} value={item[key]}>{item[name]}</Select.Option>
        })
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
    Init() {
        //const { orderId } = this.props
        const orderId = '01bfc09c537a47ffa20073a18f2a5f5f'
        this.getData(`/business/order/info/${orderId}`)
            .then(({status, name, phone, email, mark}) => {
                this.setState({
                    status, name, phone, email, mark
                })
            })
    }
    handleOrderChange(key, value) {
        this.setState({
            [key]: value
        })
    }
    componentDidMount() {
        this.Init()
    }
    componentWillReceiveProps(newProps) {
        this.props.orderId !== newProps.orderId && this.Init()
    }
    render() {
        const payWay = [{name: '货到付款', id: 'cash'}]
        const { status, name, phone, email, mark } = this.state
        const attrs = [
            [{
                title: '商品属性'
            }], [{
                title: '订单状态',
                className: 'orderState',
                render: () => <Select className="select" value={status} onChange={value => this.handleOrderChange('status', value)}>{this.renderOption(statusList, 'name', 'status')}</Select>
            }, {
                title: '支付方式',
                render: () => <Select className="select" defaultValue="cash">{this.renderOption(payWay)}</Select>
            }], [{
                title: '数量/价格',
                className: 'countAndPrice',
                render: () => <p><Input /> / <Input />元</p>
            }, {
                title: '邮编',
                render: () => <Input />
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
                title: '备注',
                render: () => <Input.TextArea value={mark} onChange={e => this.handleOrderChange('mark', e.target.value)} />
            }, {
                title: '地址',
                render: () => <p><Input /><br /><Input /></p>
            }], [{
                title: '快递设置',
                render: () => <Select className="select" />
            }, {
                title: '快递编号',
                render: () => <Input />
            }], [{
                title: '操作备注',
                render: () => <Input.TextArea />
            }]
        ]
        return (
            <div className="setStatus">
                <div className="product-info">
                {attrs.map((item, index) => {
                    return (
                        <div className="item-info" key={index}>
                        {item.map(({title, render, className}) => {
                            return (
                                <div className={`info-block ${className && className}`} key={title}>
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
                    <Button type="primary">确认修改</Button>
                </div>
            </div>
        )
    }
}

export default SetStatus
