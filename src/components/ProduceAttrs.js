import React, { Component } from 'react'
import { Table, Input, InputNumber, Upload, Button, Icon, Select } from 'antd'
import axios from 'axios'
import '../style/components/ProduceAttrs.less'

class ProduceAttrs extends Component {
    constructor(props) {
        super(props)

        this.addAttrList = this.addAttrList.bind(this)
    }
    state = {
        attrs: []
    }
    //添加属性
    addAttrList() {
        const { attrs } = this.state
        const date = new Date().getTime()
        const attr = {
            must: false,
            date,
            attrValues: [{
                date,
                key: date
            }]
        }
        this.setState({
            attrs: [...attrs, attr]
        })
    }
    //删除属性
    deleteAttr(attr) {
        const { attrs, attrs: { length } } = this.state
        const index = attrs.indexOf(attr)
        this.setState({
            attrs: [...attrs.slice(0, index), ...attrs.slice(index + 1, length)]
        })
    }
    //属性修改
    attrChange(value, key, attrObj) {
        const { attrs, attrs: { length } } = this.state
        const index = attrs.indexOf(attrObj)
        this.setState({
            attrs: [...attrs.slice(0, index), Object.assign(attrs[index], {
                [key]: value
            }), ...attrs.slice(index + 1, length)]
        })
    }
    //添加属性值
    addAttrValue(attrObj) {
        const { attrs } = this.state
        const index = attrs.indexOf(attrObj)
        const targetAttr = attrs[index]
        const date = new Date().getTime()
        targetAttr.attrValues = [...targetAttr.attrValues, {date, key: date}]
        this.setState({
            attrs
        })
    }
    //删除属性值
    deleteAttrValue(attrObj, key) {
        const { attrs } = this.state
        const index = attrs.indexOf(attrObj)
        const targetAttr = attrs[index]
        const attrValuesIndex = targetAttr.attrValues.findIndex(item => item.date == key)
        targetAttr.attrValues = [...targetAttr.attrValues.slice(0, attrValuesIndex), ...targetAttr.attrValues.slice(attrValuesIndex + 1, targetAttr.attrValues.length)]
        this.setState({
            attrs
        })
    }
    //修改属性值
    changeAttrValue(attrObj, date, key, value) {
        const { attrs } = this.state
        const index = attrs.indexOf(attrObj)
        const targetAttr = attrs[index]
        const attrValuesIndex = targetAttr.attrValues.findIndex(item => item.date == date)
        targetAttr.attrValues[attrValuesIndex] = Object.assign(targetAttr.attrValues[attrValuesIndex], {
            [key]: value
        })
        this.setState({
            attrs
        }, () => console.log(this.state))
    }
    //渲染属性元素
    renderAttr(attr) {
        const attrsColumn = [{
            title: '属性id',
            className: 'attrId',
            dataIndex: 'attrId',
        }, {
            title: '属性标题',
            className: 'title',
            dataIndex: 'title',
            render: () => <Input placeholder="属性值标题" onChange={e => this.changeAttrValue(attr, attr.date, 'title', e.target.value)} />,
        }, {
            title: '标识',
            className: 'id',
            dataIndex: 'id',
            render: () => <Input placeholder="英文标识如：red1" onChange={e => this.changeAttrValue(attr, attr.date, 'id', e.target.value)} />,
        }, {
            title: '价格',
            className: 'price',
            dataIndex: 'price',
            render: () => <InputNumber placeholder="价格" min={0} onChange={e => this.changeAttrValue(attr, attr.date, 'price', e)} />,
        }, {
            title: '排序',
            className: 'sort',
            dataIndex: 'sort',
            render: () => <Input placeholder="排序" onChange={e => this.changeAttrValue(attr, attr.date, 'sort', e.target.value)}/>,
        }, {
            title: '图片',
            className: 'picture',
            dataIndex: 'picture',
            render: () => (
                <Upload action="" showUploadList={false}>
                    <Button>
                        <Icon type="upload" /> Upload
                    </Button>
                </Upload>
            ),
        }, {
            title: '操作',
            className: 'delete',
            dataIndex: 'date',
            render: date => <a onClick={() => this.deleteAttrValue(attr, date)}>删除</a>,
        },]
        return (
            <div className="attr-block" key={attr.date}>
                <div className="attr-tabel">
                    <div className="attr-header">
                        <div className="attr-th attrName">
                            <span>属性分类名</span>
                            <Button type="primary" size="small" onClick={() => this.deleteAttr(attr)}>删除</Button>
                        </div>
                        <div className="attr-th">
                            <span>排序</span>
                        </div>
                        <div className="attr-th">
                            <span>是否必须</span>
                        </div>
                    </div>
                    <div className="attr-body">
                        <div className="attr-tr">
                            <div className="attr-td">
                                <Input placeholder="属性分类名称" size="small" onChange={e => this.attrChange(e.target.value, "attrName", attr)}/>
                            </div>
                            <div className="attr-td">
                                <Input size="small" onChange={e => this.attrChange(e.target.value, "srot", attr)} />
                            </div>
                            <div className="attr-td">
                                <Select size="small" defaultValue="false" onChange={e => this.attrChange(e, "must", attr)} >
                                    <Select.Option value="false">否</Select.Option>
                                    <Select.Option value="true">是</Select.Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <Table
                    size="small"
                    bordered={true}
                    className="productList"
                    columns={attrsColumn}
                    dataSource={attr.attrValues}
                    pagination={false}
                    footer={() => <Button type="primary" size="small" onClick={() => this.addAttrValue(attr)}>+属性值</Button>}
                />
            </div>
        )
    }
    componentDidMount() {
        
    }
    render() {
        const { attrs } = this.state
        return (
            <div className="produceAttrs">
                {
                    attrs.map(item => {
                        return this.renderAttr(item)
                    })
                }
                <Button type="primary" onClick={this.addAttrList}>添加属性</Button>
            </div>
        )
    }
}

export default ProduceAttrs
