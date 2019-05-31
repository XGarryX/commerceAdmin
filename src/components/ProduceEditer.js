import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, TreeSelect, Select, InputNumber } from 'antd'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import { updateTime } from '../redux/action/app'
import { apiPath, imagePath } from '../config/api'
import PicturesWall from '../components/PicturesWall'
import ProduceAttrs from '../components/ProduceAttrs'
import '../style/components/ProduceEditer.less'
import 'braft-editor/dist/index.css'

class ProduceEditer extends Component {
    constructor(props) {
        super(props)

        this.onImageUpload = this.onImageUpload.bind(this)
        this.uploadFn = this.uploadFn.bind(this)
    }
    filterOption(input, option) {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    uploadFn(param) {
        const { token, checkTimeOut, updateTime } = this.props
        const serverURL = `${apiPath}/file/qiniu/upload`
        const fd = new FormData()

        checkTimeOut()
        updateTime(new Date().getTime())
        fd.append('file', param.file)
        const successFn = ({ data: { fileName, prefix }}) => {
            param.success({
                url: imagePath + prefix + fileName,
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
                accessToken: token,
                'Content-Type':'multipart/form-data'
            },
            onUploadProgress: function (event) {
                param.progress(event.loaded / event.total * 100)
            },
        })
            .then(res => successFn(res))
            .catch(err => errorFn(err))
    }
    onImageUpload(images) {
        const { checkTimeOut, updateTime, handleChange } = this.props
        checkTimeOut()
        updateTime(new Date().getTime())
        handleChange('images', images)
    }
    render() {
        const { isFetching, department, departmentId, aderList, ader, ador, type, catalogId, name, internalName, purchasePrice, price, priceStr, supplier, buyLink, inner, images = [], attrs =[] } = this.props
        const { handleChange, onAttrChange } = this.props
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
                                        onChange={e => handleChange('departmentId', e)}
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
                                        loading={isFetching}
                                        className="select"
                                        placeholder="选择广告手"
                                        value={ador}
                                        onChange={e => handleChange('ador', e)}
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
                                        onChange={e => handleChange('catalogId', e)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>商品名称</th>
                                <td>
                                    <Input className="input" placeholder="请输入商品名称" value={name} onChange={e => handleChange('name', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <th>内部名称</th>
                                <td>
                                    <Input className="input" placeholder="请输入内部名称" value={internalName} onChange={e => handleChange('internalName', e.target.value)} />
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
                                    <InputNumber className="input" placeholder="请输入采购价" value={purchasePrice} onChange={e => handleChange('purchasePrice', e)} />
                                </td>
                            </tr>
                            <tr>
                                <th>零售价</th>
                                <td>
                                    <InputNumber className="input" placeholder="请输入零售价" value={price} onChange={e => handleChange('price', e)} />
                                </td>
                            </tr>
                            <tr>
                                <th>各地区货币价格</th>
                                <td>
                                    <Input className="input" placeholder="请输入货币价格" value={priceStr} onChange={e => handleChange('priceStr', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <th>供应商</th>
                                <td>
                                    <Select
                                        className="select"
                                        placeholder="选择供应商"
                                        dataSource={supplier}
                                        value={supplier}
                                        onChange={e => handleChange('supplier', e)}
                                    >
                                        <Select.Option value="taobao">淘宝</Select.Option>
                                        <Select.Option value="1688">1688</Select.Option>
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <th>产品采购连接</th>
                                <td>
                                    <Input className="input" placeholder="请输入产品采购连接" value={buyLink} onChange={e => handleChange('buyLink', e.target.value)} />
                                </td>
                            </tr>
                            <tr className="tr-editer">
                                <th>产品内容</th>
                                <td>
                                    <div className="editer-block">
                                        <BraftEditor className="editer" value={inner} onChange={e => handleChange('inner', e)} media={{uploadFn: this.uploadFn}} />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>图集相册</th>
                                <td>
                                    <PicturesWall onImageUpload={this.onImageUpload} images={images} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <ProduceAttrs onAttrChange={onAttrChange} attrs={attrs} />
                </form>
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
)(ProduceEditer)
