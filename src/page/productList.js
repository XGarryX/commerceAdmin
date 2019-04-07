import React, { Component } from 'react'
import { Table, Input } from 'antd'
import '../style/page/productList.less'

const columns = [{
    title: 'ID',
    dataIndex: 'ID',
    render: text => text ? <span>{text}</span> : <Input />,
}, {
    title: '分类',
    dataIndex: 'type',
}, {
    title: '广告手',
    dataIndex: 'ADer',
}, {
    title: '产品图片',
    dataIndex: 'picture',
}, {
    title: '产品名',
    dataIndex: 'name',
}, {
    title: '内部名',
    dataIndex: 'iname',
}, {
    title: 'SKU',
    dataIndex: 'SKU',
}, {
    title: '进货价',
    dataIndex: 'buyPrice',
}, {
    title: '销售价',
    dataIndex: 'selfPrice',
}, {
    title: '各地区货币价格',
    dataIndex: 'money',
}, {
    title: '库存',
    dataIndex: 'stock',
}, {
    title: '状态',
    dataIndex: 'state',
}, {
    title: '操作',
    dataIndex: 'operation',
}]
const data = [{
    key: '1',
}, {
    key: '2',
    ID: '001',
    type: '服装',
    ADer: '陈卓锐',
    picture: '',
    name: '上衣',
    iname: 'M1-上衣',
    dataIndex: 'S0406163526',
    buyPrice: 7,
    selfPrice: 15,
    money: '',
    stock: 99,
    state: 1,
    operation: '编辑'
}, {
    key: '3',
    ID: '002',
    type: '背包',
    ADer: '陈卓杰',
    picture: '',
    name: '背包',
    iname: 'M2-背包',
    dataIndex: 'S0404182323',
    buyPrice: 40,
    selfPrice: 120,
    money: '',
    stock: 66,
    state: 1,
    operation: '编辑'
}, {
    key: '4',
    ID: '003',
    type: '玩具',
    ADer: '林瑞福',
    picture: '',
    name: '玩具',
    iname: 'M3-玩具',
    dataIndex: 'S0404103724',
    buyPrice: 4.3,
    selfPrice: 10,
    money: '',
    stock: 20,
    state: 0,
    operation: '编辑'
}];
class productList extends Component {
    render() {
        return (
            <div>
                <Table className="productList" columns={columns} dataSource={data} />
            </div>
        )
    }
}

export default productList
