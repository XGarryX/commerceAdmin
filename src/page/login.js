import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, message } from 'antd'
import JsEncrypt  from 'jsencrypt'
import base64url from "base64url"
import axios from 'axios'
import { changeToken } from '../redux/action/token'
import '../style/page/login.less'

class Login extends Component {
    _isMounted = false

    constructor(props) {
        super(props)

        this.codeLoad = this.codeLoad.bind(this)
        this.codeError = this.codeError.bind(this)
        this.changeCode = this.changeCode.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        let setState = this.setState
        this.setState = function () {
            if ( this._isMounted ) return
            setState.call(this, ...arguments)
        }
    }
    state = {
        hasCodeLoad: false,
        isLoggingIn: false,
    }
    loginFail(msg) {
        this.setState({
            isLoggingIn: false
        }, () => message.info(msg))
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { publicKey } = this.state
                const { api } = this.props
                const jse = new JsEncrypt ()
                jse.setPublicKey(publicKey)
                axios.post(`${api}/cuser/basic/login`, {
                    phone: jse.encrypt(values.phone),
                    password: jse.encrypt(values.password),
                    verityCode: values.verityCode,
                })
                    .then(({data}) => {
                        if (data.resultCode == 200) {
                            this.props.changeToken(data.token)
                            localStorage.setItem('token', data.token)
                            this.props.history.push('/admin')
                        }
                        this.loginFail(data.resultMessage)
                    })
                    .catch(e => {
                        this.loginFail(e.message)
                    })
                    this.setState({
                    isLoggingIn: true
                })
                this.changeCode()
            }
        })
    }
    codeLoad() {
        this.setState({hasCodeLoad: true})
    }
    codeError() {
        this.setState({hasCodeLoad: true})

    }
    changeCode() {
        this.setState({
            codeUrl: `${this.props.api}/common/kaptcha?${Math.random()}`,
            hasCodeLoad: false
        })
    }
    componentDidMount() {
        const token = localStorage.getItem('token')
        if(token && JSON.parse(base64url.decode(token.split(".")[1])).exp * 1000 > new Date().getTime()) {
            this.props.history.push('/admin')
        }
        this.changeCode()
        axios.get(`${this.props.api}/common/publicKey`, {}, {
            timeout: 1000 * 30
        })
            .then(({data: { publicKey }}) => {
                this.setState({
                    publicKey
                })
            })
            .catch(e => {
                message.info(e.message)
            })
    }
    componentWillUnmount() {
        this._isMounted = true
        this.codeLoad= null
        this.codeError = null
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { codeUrl, hasCodeLoad, isLoggingIn } = this.state
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
                                <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('verityCode', {
                                rules: [{ required: true, message: '请输入验证码!' }],
                            })(
                                <p>
                                    <Input placeholder="验证码" className="login-form-code" allowClear />
                                    <img
                                        src={codeUrl}
                                        className="login-form-kaptcha"
                                        onClick={this.changeCode}
                                        onLoad={this.codeLoad}
                                        onError={this.codeError}
                                        style={{display: hasCodeLoad ? '' : 'none'}}
                                    />
                                    { !hasCodeLoad && <span style={{float: 'right'}}>加载中...</span> }
                                </p>,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" size ="large" htmlType="submit" className="login-form-button" loading={isLoggingIn}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

const mapStoreToProps = store => {
    const { api } = store
    return {
        api: store.api
    }
}
  
const mapDispathToProps = dispatch => ({
    changeToken: token => dispatch(changeToken(token)),
})

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);
export default connect(
    mapStoreToProps,
    mapDispathToProps
)(withRouter(WrappedNormalLoginForm))
