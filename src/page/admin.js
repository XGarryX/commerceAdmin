import React, { Component } from 'react'
import {
  Layout, Menu, Icon,
} from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import Tab from '../components/Tab'
import PageLoadable from '../components/PageLoadable'
import { addTab, toggleTab } from '../redux/action/tab'
import { changeToken } from '../redux/action/token'
import { updateTime, setTimeFn } from '../redux/action/app'
import { taggleSider } from '../redux/action/sider'
import siderData from '../config/sider.js'
import '../style/page/admin.less'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({
      userName: '用户名',
    }, siderData)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(tab) {
    const { updateTime, checkTimeOut, toggleTab, addTab, tabList } = this.props
    checkTimeOut()
    updateTime(new Date().getTime())
    !tabList.find(item => item.tabKey === tab.tabKey) && addTab(tab)
    toggleTab(tab.tabKey)
  }
  onCollapse(collapsed) {
    this.props.taggleSider(collapsed);
  }
  componentWillMount() {
    const { changeToken, history, setTimeFn } = this.props
    const token = localStorage.getItem('token')
    if(token) {
      let { exp = 0 } = jwtDecode(token)
      if(exp * 1000 < new Date().getTime()) {
        history.push('/login')
      }
    } else {
      history.push('/login')
    }
    changeToken(token)
    setTimeFn(history.push)
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
            collapsed={this.props.collapsed}
            className="sider"
            onCollapse={this.onCollapse.bind(this)}
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
              this.props.tabList.filter(({ hiding }) => {
                return !hiding
              }).map(({ tabKey, path, props = {} }) => {
                return <PageLoadable key={tabKey} keyValue={tabKey} path={path} prop={props} />
              })
            }</Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

const mapStoreToProps = store => {
  const {tab: {tabList, tabKey}, sider: { collapsed }, lastTime: { checkTimeOut } } = store
  return {
      tabList,
      tabKey,
      collapsed,
      checkTimeOut
  }
}

const mapDispathToProps = dispatch => ({
  changeToken: token => dispatch(changeToken(token)),
  addTab: tabKey => dispatch(addTab(tabKey)),
  toggleTab: tabKey => dispatch(toggleTab(tabKey)),
  taggleSider: state => dispatch(taggleSider(state)),
  updateTime: time => dispatch(updateTime(time)),
  setTimeFn: fn => dispatch(setTimeFn(fn)),
})

export default withRouter(connect(
  mapStoreToProps,
  mapDispathToProps
)(Admin))
