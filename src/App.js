import React, { Component } from 'react'
import {
  Layout, Menu, Icon,
} from 'antd'
import { connect } from 'react-redux'
import Tab from './components/Tab'
import PageLoadable from './components/PageLoadable'
import { addTab, toggleTab } from './redux/action/tab'
import siderData from './config/sider.js'
import './style/App.less'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout
class App extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({
      userName: '用户名',
      collapsed: false,
    }, siderData)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(tab) {
    const {props: {toggleTab, addTab, tabList}} = this
    !tabList.find(item => item.tabKey === tab.tabKey) && addTab(tab)
    toggleTab(tab.tabKey)
  }
  onCollapse = collapsed => {
    this.setState({ collapsed });
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
          <Sider
            width={200}
            theme="light"
            collapsible
            collapsed={this.state.collapsed}
            className="sider"
            onCollapse={this.onCollapse}
          >
            <Menu
              mode="inline"
              style={{borderRight: 'none' }}
              selectedKeys={[this.props.tabKey]}
            >
            {
              this.state.menuList.map(menu => {
                return <SubMenu key={menu.key} title={<span><Icon type={menu.icon} />{menu.name}</span>}>
                {
                  menu.item.map(item => {
                    return <Menu.Item key={item.tabKey} onClick={() => this.handleClick(item)} >{item.name}</Menu.Item>
                  })
                }
                </SubMenu>
              })
            }
            </Menu>
          </Sider>
          <Layout>
            <Tab className="tab-list"></Tab>
            <Content className="content">{
              this.props.tabList.map(item => {
                return <PageLoadable key={item.tabKey} keyValue={item.tabKey} path={item.path} /> 
              })
            }</Content>
          </Layout>
        </Layout>
      </Layout>
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
  addTab: tabKey => dispatch(addTab(tabKey)),
  toggleTab: tabKey => dispatch(toggleTab(tabKey)),
})

export default connect(
  mapStoreToProps,
  mapDispathToProps
)(App)
