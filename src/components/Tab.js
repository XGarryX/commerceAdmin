import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Icon } from 'antd'
import { toggleTab, removeTab, changeState } from '../redux/action/tab'
import '../style/components/Tab.less'

const TabPane = Tabs.TabPane
class Tab extends Component {
    constructor(props) {
        super(props)

        this.refresh = this.refresh.bind(this)
    }
    handleChange(key) {
        this.props.toggleTab(key)
    }
    handleEdit(key) {
        const {props: {removeTab, toggleTab, tabList}} = this
        removeTab(key)
        const defaultKey = key == tabList[0].tabKey ? 
                tabList[1] && tabList[1].tabKey || null :
                tabList[0].tabKey
        toggleTab(defaultKey)
    }
    refresh() {
        const { changeState } = this.props
        changeState(true)
        setTimeout(() => changeState(false), 0)
    }
    render() {
        const { tabList, tabKey } = this.props
        return (
            tabList.length ? <div className="tab">
                <div className="refresh" onClick={this.refresh}>
                    <span>刷新</span>
                    <Icon type="redo" className="refresj-icon"/>
                </div>
                <Tabs
                    hideAdd
                    tabBarStyle={{margin: 0}}
                    activeKey={tabKey}
                    onChange={key => this.handleChange(key)}
                    onEdit={key => this.handleEdit(key)}
                    type="editable-card"
                    className="tag-list"
                >
                {
                    tabList.map(tab => {
                        return <TabPane
                            tab={tab.name}
                            key={tab.tabKey}
                        >
                        </TabPane>
                    })
                }
                </Tabs>
            </div> : ''
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
    changeState: state => dispatch(changeState(state)),
})

export default connect(
    mapStoreToProps,
    mapDispathToProps
)(Tab)
