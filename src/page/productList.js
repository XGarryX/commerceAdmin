import React, { Component } from 'react'

class productList extends Component {
    render() {
        return (
            <span style={this.props.style} >{this.props.text}</span>
        )
    }
}

export default productList
