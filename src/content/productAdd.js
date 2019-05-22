import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Input, TreeSelect } from 'antd'
import BraftEditor from 'braft-editor'
import SearchSelect from '../components/SearchSelect'
import PicturesWall from '../components/PicturesWall'
import ProduceAttrs from '../components/ProduceAttrs'
import '../style/content/productAdd.less'
import 'braft-editor/dist/index.css'

class productAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: true
        }
    }
    //获取数据
    getDate(path, method) {
        const { api, token } = this.props
        return axios({
            url: api + path,
            method,
            headers: {
                Authorization: token
            }
        })  
    }
    //获取部门
    getDepartments() {
        this.getDate('/common/departments', 'GET')
        .then(({data}) => {
            console.log(data)
        })
    }
    //获取分类
    getCatalogs() {
        this.getDate('/product/catalogs', 'GET')
        .then(({data: { list }}) => {
            this.handleCatalogs(list)
        })
    }
    //处理分类数据
    handleCatalogs(data) {
        let tabel = {}
        data.forEach(({id, itemValue, parentId, status}) => {
            let parent = tabel[parentId] = tabel[parentId] || []
            parent.push({
                key: id,
                value: id,
                title: itemValue,
                parentId,
                status
            })
        })
        this.setState({
            type: this.setCatalogs2Step(tabel)
        })
    }
    //aaaaaaa以后一定优化这里
    setCatalogs2Step(data, pid = "0") {
        const arr = data[pid]
        const resArr = []
        if(!arr) return null
        arr.forEach(item => {
            resArr.push(Object.assign(item, {
                children: this.setCatalogs2Step(data, item.key)
            }))
        })
        return resArr
    }
    filterOption(input, option) {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    handleChange(type, value) {
        this.setState({
            [type]: value
        })
    }
    componentDidMount() {
        this.getDepartments()
        this.getCatalogs()
    }
    render() {
        const { type } = this.state
        return (
            <div className="add-product">
                <form>
                    <table className="product-table">
                        <tbody>
                            <tr className="department">
                                <th>部门</th>
                                <td className="">
                                    <SearchSelect
                                        loading={this.state.isFetching}
                                        className="select"
                                        placeholder="选择部们"
                                        dataSource={this.state.depm}
                                    />
                                </td>
                            </tr>
                            <tr className="ader">
                                <th>广告手</th>
                                <td>
                                    <SearchSelect
                                        loading={this.state.isFetching}
                                        className="select"
                                        placeholder="选择广告手"
                                        dataSource={this.state.ader}
                                    />
                                </td>
                            </tr>
                            <tr className="ader">
                                <th>商品分类</th>
                                <td>
                                    <TreeSelect 
                                        loading={!type}
                                        showSearch
                                        placeholder="选择分类"
                                        className="select"
                                        treeData={type}
                                        treeNodeFilterProp="title"
                                        onChange={e => this.handleChange('catalogs', e)}
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
                                    <SearchSelect
                                        loading={this.state.isFetching}
                                        className="select"
                                        placeholder="选择供应商"
                                        dataSource={this.state.supplier}
                                    />
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
                                        <BraftEditor className="editer" onChange={e => console.log(e.toHTML())}/>
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
                    <ProduceAttrs />
                </form>
            </div>
        )
    }
}

const mapStoreToProps = store => {
    const { token, api } = store
    return {
        token,
        api
    }
}
  
export default connect(
    mapStoreToProps
)(productAdd)
