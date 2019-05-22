import React, { Component } from 'react'
import { Table, Input, Button, Icon } from 'antd'
import axios from 'axios'
import '../style/content/productList.less'
import { depm, ader, type } from '../static/add.js'

const toDouble = num => Number(num).toFixed(2)
const data = [{
    key: '2',
    ID: '001',
    type: '服装',
    ADer: '陈卓锐',
    picture: '',
    name: '上衣',
    iname: 'M1-上衣',
    SKU: 'S0406163526',
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
    SKU: 'S0404182323',
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
    SKU: 'S0404103724',
    buyPrice: 4.3,
    selfPrice: 10,
    money: '',
    stock: 20,
    state: 0,
    operation: '编辑'
}, {
    key: '5',
    ID: '001',
    type: '玩具',
    ADer: '林瑞福',
    picture: '',
    name: '玩具',
    iname: 'M3-玩具',
    SKU: 'S0404103724',
    buyPrice: 4.3,
    selfPrice: 10,
    money: '',
    stock: 20,
    state: 0,
    operation: '编辑'
}]

class productList extends Component {
    state = {
        isFetching: true,
        searchText: {}
    }
    searchProduct() {
        this.setState({
            isFetching: true
        })
        /*axios.post('/serch', {
                ...this.state.searchText
            })
            .then(response => {

            })
            .catch(err => {

            })*/
        setTimeout(() => {
            this.setState({
                isFetching: false
            })
        }, 1000)
    }
    getColumnSearchProps = (dataIndex, placeholder) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => { this.searchInput = node; }}
                    placeholder={placeholder ? placeholder : `搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(confirm, selectedKeys, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(confirm, selectedKeys, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                Search
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters, dataIndex)}
                    size="small"
                    style={{ width: 90 }}
                >
                Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilterDropdownVisibleChange: visible => visible && setTimeout(() => this.searchInput.select()),
        // render: (text) => (
        //     <Highlighter
        //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //         searchWords={[this.state.searchText[dataIndex]]}
        //         autoEscape
        //         textToHighlight={text.toString()}
        //   />
        // ),
    })
    handleSearch = (confirm, selectedKeys, dataIndex) => {
        const { data, searchText } = this.state
        confirm()
        this.setState({
            searchText: Object.assign(searchText, {
                [dataIndex]: selectedKeys[0]
            })
        })
        setTimeout(() => {
            this.setState({
                data: data.filter(item => item[dataIndex].toString().toLowerCase().includes(selectedKeys[0].toLowerCase()))
            })
        }, 500)
        this.searchProduct()
    }
    handleReset = (clearFilters, dataIndex) => {
        this.setState({
            searchText: Object.assign(this.state.searchText, {
                [dataIndex]: ''
            })
        })
        this.searchProduct()
        clearFilters();
    }
    handlePageChange(page, pageSize) {
        console.log(page, pageSize)
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                depm,
                ader,
                type,
                data: data,
                isFetching: false
            })
        }, 1000)
    }
    render() {
        const { isFetching, data } = this.state
        const columns = [{
            title: 'ID',
            className: 'ID',
            dataIndex: 'ID',
            ...this.getColumnSearchProps('ID'),
        }, {
            title: '分类',
            className: 'type',
            dataIndex: 'type',
            ...this.getColumnSearchProps('type'),
        }, {
            title: '广告手',
            className: 'ADer',
            dataIndex: 'ADer',
            ...this.getColumnSearchProps('Ader'),
        }, {
            title: '产品图片',
            className: 'picture',
            dataIndex: 'picture',
            render: url => <a href='javascript:;'>查看</a>,
        }, {
            title: '产品名',
            className: 'name',
            dataIndex: 'name',
            ...this.getColumnSearchProps('name'),
        }, {
            title: '内部名',
            className: 'iname',
            dataIndex: 'iname',
            ...this.getColumnSearchProps('iname'),
        }, {
            title: 'SKU',
            className: 'SKU',
            dataIndex: 'SKU',
            ...this.getColumnSearchProps('SKU'),
        }, {
            title: '进货价',
            className: 'buyPrice',
            dataIndex: 'buyPrice',
            render: num => <span>{toDouble(num)}</span>,
            ...this.getColumnSearchProps('buyPrice', '高于X eg:60'),
        }, {
            title: '销售价',
            className: 'selfPrice',
            dataIndex: 'selfPrice',
            render: num => <span>{toDouble(num)}</span>,
        }, {
            title: '各地区货币价格',
            className: 'money',
            dataIndex: 'money',
        }, {
            title: '库存',
            className: 'stock',
            dataIndex: 'stock',
            ...this.getColumnSearchProps('stock'),
        }, {
            title: '状态',
            className: 'state',
            dataIndex: 'state',
            render: state => <span>{state ? '上架' : '下架'}</span>,
            ...this.getColumnSearchProps('state'),
        }, {
            title: '操作',
            className: 'operation',
            dataIndex: 'operation',
            render: text => <a href='javascript:;'>{text}</a>,
        }]
        return (
            <div>
                <Table
                    size="middle"
                    loading={isFetching}
                    bordered={true}
                    className="productList"
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        total: data ? data.length : 0,
                        showTotal: total => `共有${total}条数据`,
                        hideOnSinglePage: true,
                        showSizeChanger: true, 
                        onChange: this.handlePageChange,
                        pageSize: 1
                    }}
                />
            </div>
        )
    }
}

export default productList
