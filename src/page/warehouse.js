import React, { Component } from 'react'
import { Table } from 'antd'
import warehouseList from '../static/warehouse.json'
import '../style/page/warehouse.less'

class WareBouse extends Component {
    state = {
        warehouseList: [],
        isFetching: true
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                warehouseList,
                isFetching: false
            })
        }, 1000)
    }
    render() {
        const { isFetching, scrollY } = this.state
        const columns = [{
            title: 'ID',
            className: 'warehouseId',
            dataIndex: 'warehouseId',
        }, {
            title: '仓库名称',
            className: 'warehouseName',
            dataIndex: 'warehouseName',
        }, {
            title: '域名',
            className: 'domain',
            dataIndex: 'domain',
        }, {
            title: '库存',
            className: 'stock',
            dataIndex: 'stock',
        }, {
            title: '操作',
            className: 'operating',
            dataIndex: 'operating',
            render: () => <a href="javascript:;">仓库设置</a>
        }]
        return (
            <div className="wareBouse-list">
                <Table
                    size="middle"
                    loading={isFetching}
                    className="productList"
                    rowKey="warehouseId"
                    bordered
                    columns={columns}
                    scroll={
                        {x: 1000, y: scrollY}
                    }
                    dataSource={warehouseList}
                    pagination={{
                        total: warehouseList ? warehouseList.length : 0,
                        pageSize: 10,
                        showTotal: total => `共有${total}条数据`,
                        showSizeChanger: true, 
                        onChange: this.handlePageChange
                    }}
                />
            </div>
        )
    }
}

export default WareBouse
