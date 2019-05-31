import React, { Component } from 'react'
import { Table, Input, Button, Icon, Modal, message } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'
import Images from '../components/Images'
import { updateTime } from '../redux/action/app'
import { apiPath, imagePath } from '../config/api'
import { addTab, toggleTab, setTabProps } from '../redux/action/tab'
import '../style/content/productList.less'

class productList extends Component {
    constructor(props) {
        super(props)

        this.handlePageChange = this.handlePageChange.bind(this)
    }
    state = {
        previewVisible: false,
        previewImage: '',
        searchText: {},
        pageSize: 10,
        pageNo: 1,
    }
    getData(url, params) {
        const { token } = this.props
        return axios({
            url: apiPath + url,
            method: 'GET',
            params,
            headers: {
                accessToken: token
            }
        })
    }
    //记录操作时间
    operating() {
        const { checkTimeOut, updateTime } = this.props
        checkTimeOut()
        updateTime(new Date().getTime())
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
            searchText: Object.assign(this.state.searchText, {
                [dataIndex]: selectedKeys[0]
            })
        }, () => this.getListInfo())
    }
    handleReset = (clearFilters, dataIndex) => {
        this.operating()
        this.setState({
            searchText: Object.assign(this.state.searchText, {
                [dataIndex]: ''
            })
        }, () => this.getListInfo())
        clearFilters();
    }
    handlePageChange(pageNo, pageSize) {
        if(pageSize){
            this.operating()
            this.setState({
                pageNo,
                pageSize
            })
            this.getData('/business/product/list', {pageSize, pageNo})
                .then(({data: {list}}) => {
                    this.setState({
                        data: list
                    })
                })
        }
            
    }
    jump2Edit(id) {
        const tabKey = "product-edit"
        const { addTab, toggleTab, setTabProps, tabList } = this.props
        const index = tabList.find(item => item.tabKey == tabKey)
        if (index) {
            setTabProps(tabKey, {id})
        } else {
            addTab({
                tabKey,
                name: '编辑产品',
                path: 'productEdit',
                props: {id}
            })
        }
        toggleTab(tabKey)
    }
    //查看图片
    checkPic(url) {
        this.setState({
            previewImage: url,
            previewVisible: true
        })
    }
    getListInfo() {
        let { pageSize, pageNo, searchText, searchText: { purchasePrice } } = this.state
        this.setState({
            data: []
        })
        purchasePrice ? searchText.purchasePrice = purchasePrice * 100 : ''
        axios.all([
            this.getData('/business/product/list', {...searchText, pageSize, pageNo}),
            this.getData('/product/catalogs'),
        ])
            .then(res => {
                let keys = ['data', 'catalogs']
                let obj = {}
                res.forEach(({data: {list, resultCode, resultMessage}}, index) => {
                    if(resultCode != "200"){
                        throw({message: resultMessage})
                    }
                    obj[keys[index]] = list
                })
                this.setState(obj)
            })
            .catch(({message}) => message.error(message))
    }
    componentDidMount() {
        this.getListInfo()
    }
    render() {
        const { data, catalogs, pageSize, previewVisible, previewImage } = this.state
        const columns = [{
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
            className: 'images',
            dataIndex: 'more',
            render: (more) => {
                return <a onClick={() => this.checkPic(imagePath + (more ? more.bannerImgs.split(',')[0].replace("\\.", ".") : ''))}>查看</a>
            },
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
            render: num => <span>{num / 100}</span>,
            ...this.getColumnSearchProps('purchasePrice', '高于X eg:60'),
        }, {
            title: '销售价',
            className: 'price',
            dataIndex: 'price',
            render: num => <span>{num / 100}</span>,
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
            render: state => <span>{!state ? '在售' : '下架'}</span>,
            ...this.getColumnSearchProps('state'),
        }, {
            title: '操作',
            className: 'operation',
            dataIndex: '',
            render: ({id}) => <a href='javascript:;'><span onClick={() => this.jump2Edit(id)}>编辑</span></a>,
        }, {
            title: '',
            dataIndex: 'id',
            className: 'preview',
            render: id => <a href='javascript:;'><span onClick={() => window.open(`http://localhost:3001/${id}`)}>预览</span></a>,
        }]
        return (
            <div>
                <Table
                    size="middle"
                    loading={!data}
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
                    <Images alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

const mapStoreToProps = store => {
    const { token, lastTime: { checkTimeOut }, tab: { tabList } } = store
    return {
        token,
        checkTimeOut,
        tabList
    }
}
  
const mapDispathToProps = dispatch => ({
    updateTime: time => dispatch(updateTime(time)),
    addTab: tabKey => dispatch(addTab(tabKey)),
    toggleTab: tabKey => dispatch(toggleTab(tabKey)),
    setTabProps: (tabKey, props) => dispatch(setTabProps(tabKey, props)),
})

export default connect(
    mapStoreToProps,
    mapDispathToProps
)(productList)
