import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs } from 'antd'
import { toggleTab, removeTab } from '../redux/action/tab'
import '../style/Tab.less'

const TabPane = Tabs.TabPane
class Tab extends Component {
    handleChange(key) {
        this.props.toggleTab(key)
    }
    handleEdit(key) {
        const {props: {removeTab, toggleTab, tabList, tabKey}} = this
        removeTab(key)
        const defaultKey = tabList[0] && tabList[0].tabKey
        !tabList.includes(tabKey) && defaultKey && toggleTab(defaultKey)
    }
    render() {
        const {props} = this
        return (
            <Tabs
                hideAdd
                activeKey={props.tabKey}
                onChange={key => this.handleChange(key)}
                onEdit={key => this.handleEdit(key)}
                type="editable-card"
            >
            {
                props.tabList.map(tab => {
                    return <TabPane
                        tab={tab.name}
                        key={tab.tabKey}
                    >
                    </TabPane>
                })
            }
            </Tabs>
        )
    }
}

const mapStoreToProps = store => {
    const {tab: {tabList, tabKey}} = store
    return {
        tabList,
        tabKey
    }
}

const mapDispathToProps = dispatch => ({
    toggleTab: tabKey => dispatch(toggleTab(tabKey)),
    removeTab: tabKey => dispatch(removeTab(tabKey)),
})

export default connect(
    mapStoreToProps,
    mapDispathToProps
)(Tab)
