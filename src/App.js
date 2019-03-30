import React, { Component } from 'react';
import {
  Layout, Menu, Icon,
} from 'antd'
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
  }
  render() {
    return (
      <Layout className="content">
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
                    return <Menu.Item key={item.key}>{item.name}</Menu.Item>
                  })
                }
                </SubMenu>
              })
            }
            </Menu>
          </Sider>
          <Layout>
            <Content>111</Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default App;
