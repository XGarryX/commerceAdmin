import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import { Button, message } from 'antd'
import xss from 'xss'
import { updateTime } from '../redux/action/app'
import ProduceEditer from '../components/ProduceEditer'
import { apiPath, imagePath } from '../config/api'
import '../style/content/productAdd.less'

class productEdit extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
        this.onAttrChange = this.onAttrChange.bind(this)
        this.submit = this.submit.bind(this)
    }
    init() {
        const { id } = this.props
        if (id) {
            this.getDate(`/business/product/info/${id}`, 'GET')
                .then(({data}) => {
                    const { more, spec } = data
                    data.inner = BraftEditor.createEditorState(more.details.text)
                    data.images = more.bannerImgs.split(',').map(item => {
                        return {
                            url: item,
                            uid: item,
                            thumbUrl: imagePath + item.replace("\\.", ".")
                        }
                    })
                    let attrsObj = {}
                    let attrs = []
                    spec.forEach(({name, id, value, nameVo}) => {
                        let attr = attrsObj[name]
                        if(!attr){
                            attr = attrsObj[name] = {
                                attrName: name,
                                date: nameVo.id,
                                must: false,
                                attrValues: []
                            }
                            attrs.push(attr)
                        }
                        attr.attrValues.push({
                            date: id,
                            key: id,
                            name: value
                        })
                    })
                    data.attrs = attrs
                    this.setState(data)
                })
            this.getDepartments()
            this.getCatalogs()
        }
    }
    //获取数据
    getDate(path, method) {
        const { token, checkTimeOut } = this.props
        checkTimeOut()
        return axios({
            url: apiPath + path,
            method,
            headers: {
                accessToken: token
            }
        })
    }
    //获取商品属性
    onAttrChange(attrs) {
        this.props.updateTime(new Date().getTime())
        this.setState({
            attrs
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
    //获取广告手
    getUser(id) {
        this.getDate(`/common/department/console/user?departmentId=${id}`, 'GET')
        .then(({data: {list}}) => {
            this.setState({
                aderList: list
            })
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
    handleChange(type, value) {
        const { checkTimeOut, updateTime } = this.props
        checkTimeOut()
        updateTime(new Date().getTime())
        this.setState({
            [type]: value
        })
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
        const { token } = this.props
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
            param.more.bannerImgs = images.reduce((images, { url, response }) => {
                if (url) {
                    return (images && (images + '\,')) + url
                }
                const { prefix, fileName } = response
                return (images && (images + '\,')) + prefix + fileName.replace(/\./g, '\\.')
            }, '')
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
        param.purchasePrice = param.purchasePrice * 100
        param.price = param.price * 100
        const hide = message.loading('添加中..', 0);
        axios({
            url: `${apiPath}/business/product/control/base/${this.props.id}`,
            method: 'PUT',
            data: param,
            headers: {
                accessToken: token
            }
        })
            .then(({ data: {resultCode, resultMessage}}) => {
                hide()
                if(resultCode != "200"){
                    throw({message: resultMessage})
                }
                message.success('修改成功')
                this.init()
            })
            .catch(({message='修改失败'}) => {
                hide()
                message.error(message)
            })
    }
    shouldComponentUpdate ({ id }) {
        if(id && id != this.props.id){
            this.init()
        }
        return true
    }
    componentWillUpdate(nextProps, { departmentId }) {
        if(departmentId && departmentId != this.state.departmentId){
            this.getUser(departmentId)
        }
    }
    componentDidMount() {
        this.init()
    }
    render() {
        return (
            <div className="product">
                <ProduceEditer
                    {...this.state}
                    handleChange={this.handleChange}
                    onAttrChange={this.onAttrChange}
                />
                <div className="form-actions" style={{padding: '10px', textAlign: 'right'}}>
                    <Button type="primary" onClick={this.submit} >修改</Button>
                </div>
            </div>
        )
    }
}

const mapStoreToProps = store => {
    const { token, lastTime: { checkTimeOut } } = store
    return {
        token,
        checkTimeOut
    }
}
  
const mapDispathToProps = dispatch => ({
    updateTime: time => dispatch(updateTime(time)),
})

export default connect(
    mapStoreToProps,
    mapDispathToProps
)(productEdit)
