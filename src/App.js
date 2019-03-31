import React, { Component } from 'react'
import {
  Layout, Menu, Icon,
} from 'antd'
import { connect } from 'react-redux'
import Tab from './components/Tab'
import { addTab, toggleTab } from './redux/action/tab'
import './style/App.less'
import siderData from './config/sider.js'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout
class App extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({
      userName: '用户名'
    }, siderData)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(tab) {
    const {props: {toggleTab, addTab, tabList}} = this
    !tabList.find(item => item.tabKey === tab.key) && addTab({name: tab.name, tabKey: tab.key})
    toggleTab(tab.key)
  }
  render() {
    return (
      <Layout className="main">
        <Header className="header">
          <div className="logo">后台管理中心</div>
          <div className="user">
            <Icon className="user-icon" type="user"/>
            {this.state.userName}
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              style={{ height: '100%', borderRight: '1px solid #e2e2e2' }}
            >
            {
              this.state.menuList.map(menu => {
                return <SubMenu key={menu.key} title={<span><Icon type={menu.icon} />{menu.name}</span>}>
                {
                  menu.item.map(item => {
                    return <Menu.Item key={item.key} onClick={() => this.handleClick(item)} >{item.name}</Menu.Item>
                  })
                }
                </SubMenu>
              })
            }
            </Menu>
          </Sider>
          <Layout>
            <Tab className="tab-list"></Tab>
            <Content className="content">111</Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

const mapStoreToProps = store => {
  const {tab: {tabList}} = store
  return {
      tabList
  }
}

const mapDispathToProps = dispatch => ({
  addTab: tabKey => dispatch(addTab(tabKey)),
  toggleTab: tabKey => dispatch(toggleTab(tabKey)),
})

export default connect(
  mapStoreToProps,
  mapDispathToProps
)(App)
