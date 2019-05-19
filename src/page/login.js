import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import JsEncrypt  from 'jsencrypt'
import axios from 'axios'
import '../style/page/login.less'

class Login extends Component {
    state = {
        api: 'http://localhost:8081/api'
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { api, pubilcKey } = this.state
                const jse = new JsEncrypt ()
                jse.setPublicKey(pubilcKey)
                axios.post(`${api}/user/basic/register`, {
                    phone: jse.encrypt(values.phone),
                    password: jse.encrypt(values.password),
                    repeatPassword: jse.encrypt(values.password),
                    verityCode: values.verityCode,
                })
                    .then(res => console.log(res))
            }
        })
    }
    changeCode = e => {
        e.target.src = `${this.state.api}/common/kaptcha?${Math.random()}`
    }
    componentDidMount() {
        axios.get(`${this.state.api}/common/publicKey`)
            .then(res => {
                this.setState({
                    pubilcKey: res.data.ext1
                })
            })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="login">
                <div className="background"></div>
                <div className="login-form-block">
                    <h2>后台系统</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('verityCode', {
                                rules: [{ required: true, message: '请输入验证码!' }],
                            })(
                                <p>
                                    <Input placeholder="验证码" className="login-form-code"/>
                                    <img
                                        src={`${this.state.api}/common/kaptcha`}
                                        className="login-form-kaptcha"
                                        onClick={this.changeCode}
                                    />                                
                                </p>,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" size ="large" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <iframe id="code-iframe" />
            </div>
        )
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);
export default WrappedNormalLoginForm
