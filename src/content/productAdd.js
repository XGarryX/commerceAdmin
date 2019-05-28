import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Input, TreeSelect, Select, Button, message } from 'antd'
import xss from 'xss'
import BraftEditor from 'braft-editor'
import SearchSelect from '../components/SearchSelect'
import PicturesWall from '../components/PicturesWall'
import ProduceAttrs from '../components/ProduceAttrs'
import { updateTime } from '../redux/action/app'
import '../style/content/productAdd.less'
import 'braft-editor/dist/index.css'

class productAdd extends Component {
    constructor(props) {
        super(props)

        this.onAttrChange = this.onAttrChange.bind(this)
        this.onImageUpload = this.onImageUpload.bind(this)
        this.uploadFn = this.uploadFn.bind(this)
        this.submit = this.submit.bind(this)
    }
    state = {}
    init() {
        this.setState({
            ador: '',
            attrs: [],
            buyLink: '',
            catalogId: '',
            department: '',
            departmentId: '',
            images: [],
            inner: BraftEditor.createEditorState(null),
            internalName: '',
            name: '',
            price: '',
            priceStr: '',
            purchasePrice: '',
            supplier: '',
            type: [],
            childUpInit: true,
        }, () => this.setState({
            childUpInit: false
        }))
        this.getDepartments()
        this.getCatalogs()
    }
    //获取商品属性
    onAttrChange(attrs) {
        this.props.updateTime(new Date().getTime())
        this.setState({
            attrs
        })
    }
    //获取数据
    getDate(path, method) {
        const { api, token, checkTimeOut } = this.props
        checkTimeOut()
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
        .then(({data: {list}}) => {
            this.setState({
                department: list
            })
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
    onImageUpload(images) {
        const { checkTimeOut, updateTime } = this.props
        checkTimeOut()
        updateTime(new Date().getTime())
        this.setState({
            images
        })
    }
    filterOption(input, option) {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    handleChange(type, value) {
        const { checkTimeOut, updateTime } = this.props
        checkTimeOut()
        updateTime(new Date().getTime())
        this.setState({
            [type]: value
        })
    }
    uploadFn(param) {
        const { api, token, checkTimeOut, updateTime } = this.props
        const serverURL = `${api}/business/product/control/image/upload`
        const fd = new FormData()

        checkTimeOut()
        updateTime(new Date().getTime())
        fd.append('file', param.file)
        const successFn = ({data: {oneImg}}) => {
            const { id, imgUrl } = oneImg
            param.success({
                url: imgUrl,
                meta: {
                    id,
                }
            })
        }
    
        const errorFn = (response) => {
            param.error({
              msg: 'unable to upload.'
            })
        }   

        axios({
            url: serverURL,
            method: 'POST',
            data: fd,
            headers: {
                Authorization: token,
                'Content-Type':'multipart/form-data'
            },
            onUploadProgress: function (event) {
                param.progress(event.loaded / event.total * 100)
            },
        })
            .then(res => successFn(res))
            .catch(err => errorFn(err))
    }
    submit() {
        const key = [{
            name: 'departmentId', msg: '请选择部门'
        }, {
            name: 'ador', msg: '请选择广告手'
        }, {
            name: 'catalogId', msg: '请选择商品分类'
        }, {
            name: 'name', msg: '请填写商品名称'
        }, {
            name: 'internalName', msg: '请填写内部名称'
        }, {
            name: 'purchasePrice', msg: '请填写商品采购价'
        }, {
            name: 'price', msg: '请填写商品零售价'
        }, {
            name: 'priceStr', msg: '请填写各地区货币价格'
        }, {
            name: 'supplier', msg: '请选择供应商'
        }, {
            name: 'buyLink', msg: '请填写采购链接'
        }]
        let param = {more: {
            details: {}
        }, spec: []}
        const { attrs = [], inner, images } = this.state
        const { token, api } = this.props
        for(let i = 0;i < key.length;i++){
            const { name, msg } = key[i]
            let value = this.state[name]
            if(!value){
                message.error(msg)
                return
            }
            param[name] = value
        }
        //商品图片
        if(images && images.length){
            param.images = images.map(item => {
                return {
                    id: item.uid
                }
            })
        } else {
            message.error('请至少上传一张图集')
            return
        }
        //验证商品属性是否完整
        for(let i = 0;i < attrs.length;i++){
            let value = attrs[i]
            const { attrName, attrSrot } = value
            if(!attrName){
                message.error('请填写属性名称')
                return
            }
            let nameVo = {"orderByName": attrSrot}
            for(let j = 0;j < value.attrValues.length;j++){
                let aValue = value.attrValues[j]
                let { name, sort } = aValue
                if(!name){
                    message.error('请填写属性值名称')
                    return
                }
                let spec = {
                    name: attrName,
                    value: name,
                    valueVo: {
                        "orderByValue": sort
                    }
                }
                if(j == 0){
                    spec.nameVo = nameVo
                }
                param.spec.push(spec)
            }
        }
        param.more.details.text = xss(inner.toHTML().replace(/\"/g, "\\\""))
        const hide = message.loading('添加中..', 0);
        axios({
            url: `${api}/business/product/control/base`,
            method: 'POST',
            data: param,
            headers: {
                Authorization: token
            }
        })
            .then(({ data: {resultCode, resultMessage}}) => {
                hide()
                if(resultCode != "200"){
                    throw({message: resultMessage})
                }
                message.success('添加成功')
                this.init()
            })
            .catch(({message='添加失败'}) => {
                hide()
                message.error(message)
            })
    }
    componentDidMount() {
        this.getDepartments()
        this.getCatalogs()
    }
    render() {
        const { type, department, childUpInit, departmentId, ador, catalogId, name, internalName, purchasePrice, price, priceStr, supplier, buyLink, inner } = this.state
        return (
            <div className="add-product">
                <form>
                    <table className="product-table">
                        <tbody>
                            <tr className="department">
                                <th>部门</th>
                                <td className="">
                                    <Select
                                        loading={!department}
                                        className="select"
                                        placeholder="选择部们"
                                        value={departmentId}
                                        onChange={e => this.handleChange('departmentId', e)}
                                    >
                                        {department && department.map(item => (
                                            <Select.Option value={item.id} key={item.id}>{item.roleName}</Select.Option>
                                        ))}
                                    </Select>
                                </td>
                            </tr>
                            <tr className="ader">
                                <th>广告手</th>
                                <td>
                                    <Select
                                        loading={this.state.isFetching}
                                        className="select"
                                        placeholder="选择广告手"
                                        dataSource={this.state.ader}
                                        value={ador}
                                        onChange={e => this.handleChange('ador', e)}
                                    >
                                        <Select.Option value="sm">三毛</Select.Option>
                                        <Select.Option value="wm">五毛</Select.Option>
                                    </Select>
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
                                        value={catalogId}
                                        onChange={e => this.handleChange('catalogId', e)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>商品名称</th>
                                <td>
                                    <Input className="input" placeholder="请输入商品名称" value={name} onChange={e => this.handleChange('name', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <th>内部名称</th>
                                <td>
                                    <Input className="input" placeholder="请输入内部名称" value={internalName} onChange={e => this.handleChange('internalName', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <th>SKU</th>
                                <td>
                                    <Input className="input" placeholder="SKU" disabled/>
                                </td>
                            </tr>
                            <tr>
                                <th>采购价</th>
                                <td>
                                    <Input className="input" placeholder="请输入采购价" value={purchasePrice} onChange={e => this.handleChange('purchasePrice', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <th>零售价</th>
                                <td>
                                    <Input className="input" placeholder="请输入零售价" value={price} onChange={e => this.handleChange('price', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <th>各地区货币价格</th>
                                <td>
                                    <Input className="input" placeholder="请输入货币价格" value={priceStr} onChange={e => this.handleChange('priceStr', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <th>供应商</th>
                                <td>
                                    <Select
                                        className="select"
                                        placeholder="选择供应商"
                                        dataSource={this.state.supplier}
                                        value={supplier}
                                        onChange={e => this.handleChange('supplier', e)}
                                    >
                                        <Select.Option value="taobao">淘宝</Select.Option>
                                        <Select.Option value="1688">1688</Select.Option>
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <th>产品采购连接</th>
                                <td>
                                    <Input className="input" placeholder="请输入产品采购连接" value={buyLink} onChange={e => this.handleChange('buyLink', e.target.value)} />
                                </td>
                            </tr>
                            <tr className="tr-editer">
                                <th>产品内容</th>
                                <td>
                                    <div className="editer-block">
                                        <BraftEditor className="editer" value={inner} onChange={e => this.handleChange('inner', e)} media={{uploadFn: this.uploadFn}} />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>图集相册</th>
                                <td>
                                    <PicturesWall onImageUpload={this.onImageUpload} childUpInit={childUpInit} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <ProduceAttrs onAttrChange={this.onAttrChange} childUpInit={childUpInit} />
                    <div className="form-actions">
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </div>
                </form>
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
)(productAdd)
