import React, { Component } from 'react'
//import axios from 'axios'
import { Input, Select, TreeSelect } from 'antd'
import BraftEditor from 'braft-editor'
import PicturesWall from '../components/PicturesWall'
import { depm, ader, type, supplier } from '../static/add.js'
import '../style/page/productAdd.less'
import 'braft-editor/dist/index.css'

const { Option } = Select,
    { TreeNode } = TreeSelect 
class productAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: true
        }
    }
    componentDidMount() {
        !this.setState.depm && setTimeout(() => {
            this.setState({
                depm,
                ader,
                isFetching: false
            })
        }, 1000)
    }
    filterOption(input, option) {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    render() {
        return (
            <div className="add-product">
                <form>
                    <table className="product-table">
                        <tbody>
                            <tr className="department">
                                <th>部门</th>
                                <td className="">
                                    <Select
                                        showSearch
                                        className="select"
                                        placeholder="选择部们"
                                        filterOption={this.filterOption}
                                    >
                                    {
                                        depm.map(item => {
                                            return <Option key={item.id} value={item.id}>{item.name}</Option>
                                        })
                                    }
                                    </Select>
                                </td>
                            </tr>
                            <tr className="ader">
                                <th>广告手</th>
                                <td>
                                    <Select
                                        showSearch
                                        className="select"
                                        placeholder="选择广告手"
                                        filterOption={this.filterOption}
                                    >
                                    {
                                        ader.map(item => {
                                            return <Option key={item.id} value={item.id}>{item.name}</Option>
                                        })
                                    }
                                    </Select>
                                </td>
                            </tr>
                            <tr className="ader">
                                <th>商品分类</th>
                                <td>
                                    <TreeSelect 
                                        showSearch
                                        placeholder="选择分类"
                                        className="select"
                                        treeData={type}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>商品名称</th>
                                <td>
                                    <Input className="input" placeholder="请输入商品名称"/>
                                </td>
                            </tr>
                            <tr>
                                <th>内部名称</th>
                                <td>
                                    <Input className="input" placeholder="请输入内部名称"/>
                                </td>
                            </tr>
                            <tr>
                                <th>SKU</th>
                                <td>
                                    <Input className="input" placeholder="SKU"/>
                                </td>
                            </tr>
                            <tr>
                                <th>采购价</th>
                                <td>
                                    <Input className="input" placeholder="请输入采购价"/>
                                </td>
                            </tr>
                            <tr>
                                <th>零售价</th>
                                <td>
                                    <Input className="input" placeholder="请输入零售价"/>
                                </td>
                            </tr>
                            <tr>
                                <th>各地区货币价格</th>
                                <td>
                                    <Input className="input" placeholder="请输入货币价格"/>
                                </td>
                            </tr>
                            <tr>
                                <th>供应商</th>
                                <td>
                                    <Select
                                        showSearch
                                        className="select"
                                        placeholder="选择供应商"
                                        filterOption={this.filterOption}
                                    >
                                    {
                                        supplier.map(item => {
                                            return <Option key={item.id} value={item.id}>{item.name}</Option>
                                        })
                                    }
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <th>产品采购连接</th>
                                <td>
                                    <Input className="input" placeholder="请输入产品采购连接"/>
                                </td>
                            </tr>
                            <tr className="tr-editer">
                                <th>产品内容</th>
                                <td>
                                    <div className="editer-block">
                                        <BraftEditor className="editer"/>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>图集相册</th>
                                <td>
                                    <PicturesWall />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        )
    }
}

export default productAdd
