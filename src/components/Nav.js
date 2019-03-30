import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addeNav, toggleNav, removeNav } from '../redux/action/nav'

class Nav extends Component {
    constructor(props){
        super(props)
        this.state = {
            active: null
        }
    }
    handleClick(tap) {
        props.handleClick(tap)
    }
    render() {
        const {props} = this
        return (
            <ul>
            {
                props.tapList.map((item, index) => {
                    return <li key={index} onClick={() => this.handleClick(item, index)}>{item.tapName}</li>
                })
            }
            </ul>
        )
    }
}

const mapStoreToProps = store => {
    const {nav: {navList, navKey}} = store
    return {
        navList,
        navKey
    }
}

const mapDispathToProps = dispatch => ({
    toggleNav: navKey => dispatch()
})

export default Nav
