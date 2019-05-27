import React, { Component } from 'react'
import { Table, Input, Button, Icon, Modal } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'
import '../style/content/productList.less'

class productList extends Component {
    constructor(props) {
        super(props)

        this.handlePageChange = this.handlePageChange.bind(this)
    }
    state = {
        previewVisible: false,
        previewImage: '',
        isFetching: true,
        searchText: {},
        pageSize: 10,
        pageNo: 1,
    }
    getData(url, method, data) {
        const { api, token } = this.props
        return axios({
            url: api + url,
            method,
            data,
            headers: {
                Authorization: token
            }
        })
    }
    //记录操作时间
    operating() {
        const { checkTimeOut, updateTime } = this.props
        checkTimeOut()
        updateTime(new Date().getTime())
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
    })
    handleSearch = (confirm, selectedKeys, dataIndex) => {
        this.operating()
        confirm()
        this.setState({
            searchText: Object.assign(searchText, {
                [dataIndex]: selectedKeys[0]
            })
        }, () => console.log(this.state.searchText))
        this.searchProduct()
    }
    handleReset = (clearFilters, dataIndex) => {
        this.operating()
        this.setState({
            searchText: Object.assign(this.state.searchText, {
                [dataIndex]: ''
            })
        }, () => console.log(this.state.searchText))
        this.searchProduct()
        clearFilters();
    }
    handlePageChange(pageNo, pageSize) {
        this.operating()
        this.setState({
            pageNo,
            pageSize
        })
    }
    //查看图片
    checkPic(url) {
        this.setState({
            previewImage: url,
            previewVisible: true
        })
    }
    componentDidMount() {
        const { pageSize, pageNo } = this.state
        this.setState({
            isFetching: true
        })
        axios.all([
            this.getData('/product/infos', 'GET', {pageSize, pageNo}),
            this.getData('/product/catalogs', 'GET', {pageSize, pageNo}),
        ])
            .then(res => {
                let keys = ['data', 'catalogs']
                let obj = {}
                res.forEach(({data: {list}}, index) => {
                    obj[keys[index]] = list
                })
                this.setState(obj, () => console.log(this.state))
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.setState({
                    isFetching: false
                })
            })
    }
    render() {
        const { isFetching, data, catalogs, pageSize, previewVisible, previewImage } = this.state
        const columns = [{
            title: 'ID',
            className: 'ID',
            dataIndex: 'ID',
            ...this.getColumnSearchProps('ID'),
        }, {
            title: '分类',
            className: 'catalogId',
            dataIndex: 'catalogId',
            render: id => <span>{catalogs.find(item => item.id == id).itemValue}</span>,
            ...this.getColumnSearchProps('catalogId'),
        }, {
            title: '广告手',
            className: 'ader',
            dataIndex: 'ader',
            render: id => <span>111</span>,
            ...this.getColumnSearchProps('ader'),
        }, {
            title: '产品图片',
            className: 'picture',
            dataIndex: 'picture',
            render: url => <a onClick={url => this.checkPic('http://image.garry.fun/image/product/1544499402808.jpg')}>查看</a>,
        }, {
            title: '产品名',
            className: 'name',
            dataIndex: 'name',
            ...this.getColumnSearchProps('name'),
        }, {
            title: '内部名',
            className: 'internalName',
            dataIndex: 'internalName',
            ...this.getColumnSearchProps('internalName'),
        }, {
            title: 'SKU',
            className: 'SKU',
            dataIndex: 'SKU',
            ...this.getColumnSearchProps('SKU'),
        }, {
            title: '进货价',
            className: 'purchasePrice',
            dataIndex: 'purchasePrice',
            render: num => <span>{num}</span>,
            ...this.getColumnSearchProps('purchasePrice', '高于X eg:60'),
        }, {
            title: '销售价',
            className: 'price',
            dataIndex: 'price',
            render: num => <span>{num}</span>,
        }, {
            title: '各地区货币价格',
            className: 'pricestr',
            dataIndex: 'pricestr',
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
                    rowKey="id"
                    pagination={{
                        total: data ? data.length : 0,
                        showTotal: total => `共有${total}条数据`,
                        showSizeChanger: true, 
                        onChange: this.handlePageChange,
                        pageSize
                    }}
                />
                <Modal visible={previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

const mapStoreToProps = store => {
    const { token, api, lastTime: { checkTimeOut } } = store
    return {
        token,
        api,
        checkTimeOut
    }
}
  
const mapDispathToProps = dispatch => ({
    updateTime: time => dispatch(updateTime(time)),
  })

export default connect(
    mapStoreToProps,
    mapDispathToProps
)(productList)
