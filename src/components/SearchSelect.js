import React, { Component } from 'react'
import { Select } from 'antd'

const Option = Select.Option

class SearchSelect extends Component{
    render() {
        const { className, style, placeholder, handleChange, dataSource, loading, keyName = 'id', name = 'name' } = this.props
        return (
            <Select
                showSearch
                loading={loading}
                className={className}
                style={style}
                placeholder={placeholder}
                optionFilterProp="children"
                onChange={handleChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {
                dataSource && dataSource.map(item => <Option key={item[keyName]} value={item[keyName]}>{item[name]}</Option>)
            }
            </Select>
        )
    }
}

export default SearchSelect
