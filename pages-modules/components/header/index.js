import React, { Component } from 'react'
import { Button, Col, Row, Popover, Menu, Modal, Input, Tooltip, Breadcrumb  } from 'antd'
import { Avatar, dividerClassName } from "@fluentui/react-northstar";
import { GoogleLogin } from 'react-google-login';
import { GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID } from '../../../assets/constants/const'
import restClient from '../../../assets/common/core/restClient'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { get, isEmpty } from 'lodash'

import styles from './styles.scss'
import './overwrite.css'

import message from '../../../assets/images/contents/chat.png'
import notification from '../../../assets/images/contents/notification.png'
import profile from '../../../assets/images/contents/profile.png'
import enter from '../../../assets/images/contents/enter.png'
import logo from '../../../assets/logo/logo.png'
import { UserOutlined, KeyOutlined, GoogleOutlined, FacebookOutlined, PoweroffOutlined, HomeOutlined } from '@ant-design/icons';
import Router from 'next/router'
import { authenticate, removeCookie } from '../../../assets/common/core/localStorage';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

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
        username: '',
        password: '',
        isLogin: false,
        username: '',
        isLoading: false,
        loginChange: 'Sign in'
    };

    componentDidMount() {
        const user = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('user'))))
        console.log('user', user)
        if (!isEmpty(user)) {
            this.setState({
                isLogin: true,
                username: user.code,
                profile: user
            })
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

    handleLogin = async () => {
        this.setState({
            isLoading: true,
            loginChange: "On Authenticate..."
        })
        console.log(this.state.username);
        console.log(this.state.password);
        const data = {
            code: this.state.username,
            password: this.state.password
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
            })
    }

    logout = (e) => {

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
            <Row style={{ paddingTop: 10, paddingBottom: 10 }} className="lms_ws_header--">
                {/* <div className="sweet-loading">
                    <ClipLoader
                        css={override}
                        size={150}
                        color={"#123abc"}
                        loading={this.state.loading}
                    />
                </div> */}
                <Modal title="Login form" centered={true} visible={this.state.isVisible} onOk={this.handleOk} onCancel={this.handleCancel} footer={null}>
                    <Row style={{ margin: '10px 0' }}>
                        <Input size="large" onChange={(text) => { this.setState({ username: text.target.value }) }} placeholder="Enter your code..." prefix={<UserOutlined />} style={{ borderRadius: 20 }} />
                    </Row>
                    <Row style={{ margin: '10px 0' }}>
                        <Input size="large" onChange={(text) => { this.setState({ password: text.target.value }) }} placeholder="Enter your password..." prefix={<KeyOutlined />} style={{ borderRadius: 20 }} />
                    </Row>
                    <Row style={{ textAlign: 'center', margin: '10px 0' }}>
                        <div>
                            <button type='primary' className="btn-login" onClick={this.handleLogin} /*style={{ borderRadius: 20, width: 100, padding: '5px 0', fontSize: 20, lineHeight: '20px' }}*/ disabled={this.state.isLoading}>{this.state.loginChange}</button>
                        </div>
                    </Row>
                    <Row style={{ textAlign: 'center' }}>
                        <div style={{
                            width: "100%", color: '#cacaca',
                            fontWeight: 600
                        }}>__________Or sign by certificate__________</div>
                        <Row style={{ width: "100%" }}>
                            <GoogleLogin
                                clientId={GOOGLE_CLIENT_ID}
                                render={renderProps => (
                                    <Col span={12} style={{ cursor: 'pointer' }}>
                                        <div>
                                            <GoogleOutlined onClick={renderProps.onClick} disabled={renderProps.disabled} style={{ color: "#ff4000", fontSize: 50 }} /></div><div style={{
                                                fontWeight: 700,
                                                color: '#756c6c'
                                            }}>Login with Google</div>
                                    </Col>
                                )}
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
                            <FacebookLogin
                                appId={FACEBOOK_CLIENT_ID}
                                callback={this.responseFacebook}
                                render={renderProps => (
                                    <Col span={12} style={{ cursor: 'pointer' }}>
                                        <FacebookOutlined onClick={renderProps.onClick} disabled={renderProps.disabled} style={{ color: "#0B83ED", fontSize: 50 }} /><div style={{
                                            fontWeight: 700,
                                            color: '#756c6c'
                                        }}>Login with Facebook</div>
                                    </Col>
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
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <UserOutlined />
                            <span>Application List</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Application</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col xs={10}>
                    {/* Authentication */}
                    {
                        this.state.isLogin ? <div style={{ textAlign: 'right' }}>
                            <Popover placement="bottomRight" title={title} content={content} trigger="click">
                                <button className='btn-account-info' style={{
                                    height: '46px',
                                    verticalAlign: 'bottom',
                                    lineHeight: '46px',
                                    borderRadius: '50%'
                                }}>
                                    <Avatar image={this.state.profile.urlAvatar} />
                                </button>
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