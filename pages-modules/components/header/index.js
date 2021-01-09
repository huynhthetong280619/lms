import React, { Component } from 'react'
import { Button, Col, Row, Popover, Menu, Modal, Input, Tooltip } from 'antd'
import { Form, Divider, message } from 'antd'
import { Avatar, dividerClassName } from "@fluentui/react-northstar";
import { GoogleLogin } from 'react-google-login';
import { GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID } from '../../../assets/constants/const'
import restClient from '../../../assets/common/core/restClient'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { get, isEmpty } from 'lodash'

import styles from './styles.scss'
import './overwrite.css'

//import message from '../../../assets/images/contents/chat.png'
import notification from '../../../assets/images/contents/notification.png'
import profile from '../../../assets/images/contents/profile.png'
import enter from '../../../assets/images/contents/enter.png'
import logo from '../../../assets/logo/logo.png'
import { UserOutlined, KeyOutlined, GoogleOutlined, FacebookOutlined, PoweroffOutlined, HomeOutlined } from '@ant-design/icons';
import Router from 'next/router'
import { authenticate, removeCookie, isAuth } from '../../../assets/common/core/localStorage';
import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";

const { SubMenu } = Menu;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
class Headers extends React.Component {

    state = {
        current: 'mail',
        isVisible: false,
        isLogin: false,
        username: '',
        isLoading: false,
        loginChange: 'Sign in',
        isLoadingPage: false
    };

    componentDidMount() {
        if (isAuth) {
            const user = JSON.parse((localStorage.getItem('user')));
            console.log('user', user)
            if (!isEmpty(user)) {
                this.setState({
                    isLogin: true,
                    username: user.code,
                    profile: user
                })
            }
        }
    }

    openLogin = () => {
        this.setState({ isVisible: true });
    };

    handleOk = () => {
        this.setState({ isVisible: false });
    };

    handleCancel = () => {
        this.setState({ isVisible: false });
    };


    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
    };

    handleLogin = async (values) => {
        this.setState({
            isLoading: true,
            loginChange: "On Authenticate...",
            isLoadingPage: true
        })
        console.log(values.username);
        console.log(values.password);
        const data = {
            code: values.username,
            password: values.password
        }
        await restClient.asyncPost(`/user/authenticate`, data, null)
            .then(res => {
                if (!res.hasError) {
                    // cookieCutter.set('token', get(res.data, 'token'))
                    // Router.push(
                    //     '/courses'
                    // )
                    authenticate(res, () => {
                        Router.push("/courses");
                    })
                } else {
                    this.setState({ isLoading: false, loginChange: 'Sign in' });
                    message.error(res.data.message);
                }
            })

    }

    responseGoogle = async (response) => {
        const token = response.tokenId;
        console.log(token);
        const data = {
            token: token
        }
        this.setState({
            isLoading: true,
            loginChange: "On Authenticate..."
        })
        await restClient.asyncPost(`/user/auth/google`, data, null)
            .then(res => {
                console.log(res.data);
                if (!res.hasError) {
                    authenticate(res, () => {
                        Router.push("/courses");
                    })
                }
                else {
                    this.setState({ isLoading: false, loginChange: 'Sign in' });
                    message.error(res.data.message);
                }
            })
    }

    responseFacebook = async (response) => {
        this.setState({
            isLoading: true,
            loginChange: "On Authenticate..."
        })
        console.log('responseFacebook', response);
        const token = response.accessToken;
        console.log('responseFacebook', token);
        const data = {
            token: token
        }

        await restClient.asyncPost(`/user/auth/facebook`, data, null)
            .then(res => {
                console.log(res.data);
                if (!res.hasError) {
                    // cookieCutter.set('token', get(res.data, 'token'))
                    // Router.push(
                    //     '/courses'
                    // )
                    authenticate(res, () => {
                        Router.push({ pathname: "/courses" });
                    })
                }
                else {
                    this.setState({ isLoading: false, loginChange: 'Sign in' });
                    message.error(res.data.message);
                }
            })
    }

    logout = (e) => {
        this.setState({ isLoadingPage: true, isLogin: false })

        removeCookie('token');
        localStorage.removeItem('user')
        Router.push({ pathname: "/" });
    }

    render() {

        const content = (
            <div>
                <a className='menu_item setting' href="/profiles">Account settings</a>
                <a className='menu_item sign_out'
                    onClick={(e) => this.logout()}
                >Sign out</a>
            </div>
        );

        const title = (
            <div className='account_info'>
                <div className='account_avatar'>
                    <Avatar image={get(this.state.profile, 'urlAvatar')} />
                </div>
                <div className='account_name'>{get(this.state.profile, 'surName') + ' ' + get(this.state.profile, 'firstName')}</div>
                <div className='account_email'>{get(this.state.profile, 'emailAddress')}</div>
            </div>
        );

        console.log('title', this.state.profile)

        const { current } = this.state;

        return (
            <Row style={{
                paddingTop: 10, paddingBottom: 10, display: 'flex',
                justifyContent: 'space-around'
            }} className="lms_ws_header--">
                <div className="sweet-loading" style={{
                    position: 'absolute',
                    zIndex: 1000,
                    top: '50%',
                    left: '50%',
                }}>
                    <FadeLoader
                        css={override}
                        size={150}
                        color={"#123abc"}
                        loading={this.state.isLoadingPage}
                    />
                </div>
                <Modal title="Login form" centered={true} visible={this.state.isVisible} onOk={this.handleOk} onCancel={this.handleCancel} footer={null}>
                    <Form
                        onFinish={this.handleLogin}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                            ]}
                        >
                            <Input
                                size='large'
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Enter your code..." />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<KeyOutlined className="site-form-item-icon" />}
                                size='large'
                                placeholder="Enter your password..."
                            />
                        </Form.Item>

                        <Form.Item
                            style={{ textAlign: 'center' }}
                        >
                            <Button className="btn-login" type="primary" size='large' htmlType="submit"
                                loading={this.state.isLoading}>
                                {this.state.loginChange}</Button>
                        </Form.Item>
                    </Form>

                    <Row style={{ textAlign: 'center' }}>
                        <Divider style={{
                            width: "100%", color: '#cacaca',
                        }}> Or sign by certificate</Divider>
                        <Row style={{ width: '100%', justifyContent: 'center' }}>
                            <GoogleLogin
                                clientId={GOOGLE_CLIENT_ID}
                                render={renderProps => (
                                    <Row>
                                        <Button className="social google" onClick={renderProps.onClick} disabled={renderProps.disabled}>Log in with Google</Button>
                                    </Row>
                                )}
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />

                        </Row>
                        <Row style={{ width: '100%', justifyContent: 'center' }}>
                            <FacebookLogin
                                appId={FACEBOOK_CLIENT_ID}
                                callback={this.responseFacebook}
                                render={renderProps => (
                                    <Row>
                                        <Button className="social facebook" onClick={renderProps.onClick} disabled={renderProps.disabled}>Log in with Facebook</Button>
                                    </Row>
                                )}
                            />
                        </Row>

                    </Row>
                </Modal>

                <Col xs={4}>
                    <div>
                        <span><a href="/courses">
                            <img src={logo} width={110} />
                        </a></span>
                    </div>
                </Col>
                <Col span={4}>

                </Col>
                <Col xs={10}>
                    {/* Authentication */}
                    {
                        this.state.isLogin ? <div style={{ textAlign: 'right' }}>
                            <Popover placement="bottomRight" title={title} content={content} trigger="click">
                                {/* <button className='btn-account-info' style={{
                                    height: '46px',
                                    verticalAlign: 'bottom',
                                    lineHeight: '46px',
                                    borderRadius: '50%'
                                }}> */}
                                    <Avatar image={this.state.profile.urlAvatar} />
                                {/* </button> */}
                            </Popover>
                        </div>
                            :
                            <div className={styles.blockLogin}>
                                <Button className={styles.btnLogin} onClick={() => this.openLogin()}>
                                    <Tooltip title="Click to login">
                                        <img src={enter} width={20} />
                                    </Tooltip>
                                </Button>
                            </div>
                    }

                </Col>
            </Row>
        )
    }
}


export default Headers