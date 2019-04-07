import React, { Component } from 'react'
import { Select } from 'antd'

const Option = Select.Option

class SearchSelect extends Component{
    render() {
        const { style, placeholder, handleChange } = this.props
        return (
            <Select
                showSearch
                style={style}
                placeholder={placeholder}
                optionFilterProp="children"
                onChange={handleChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {
                
            }
            </Select>
        )
    }
}

export default SearchSelect
