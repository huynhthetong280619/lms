import React, { Component } from 'react'
import { Button, Col, Row, Popover, Menu, Modal, Input, Tooltip } from 'antd'

import { GoogleLogin } from 'react-google-login';
import { GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID } from '../../../assets/constants/const'
import restClient from '../../../assets/common/core/restClient'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'


import styles from './styles.scss'
import './overwrite.css'

import message from '../../../assets/images/contents/chat.png'
import notification from '../../../assets/images/contents/notification.png'
import profile from '../../../assets/images/contents/profile.png'
import logo from '../../../assets/logo/logo.png'
import { UserOutlined, KeyOutlined, GoogleOutlined, FacebookOutlined, PoweroffOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
class Headers extends React.Component {

    state = {
        current: 'mail',
        isVisible: false,
        username: '',
        password: ''
    };

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
        console.log(this.state.username);
        console.log(this.state.password);
        const data = {
            code: this.state.username,
            password: this.state.password
        }
        await restClient.asyncPost(`/user/authenticate`, data)
            .then(res => {
                console.log(res.data);
            })

    }

    responseGoogle = async (response) => {
        const token = response.tokenId;
        console.log(token);
        const data = {
            token: token
        }

        await restClient.asyncPost(`/user/auth/google`, data)
            .then(res => {
                console.log(res.data);
            })
    }

    responseFacebook= async (response) => {
        console.log(response);
        // const token = response.tokenId;
        // console.log(token);
        // const data = {
        //     token: token
        // }

        // await restClient.asyncPost(`/user/auth/google`, data)
        //     .then(res => {
        //         console.log(res.data);
        //     })
    }

    render() {
        const text = (<div>
            <div>Sign in as</div>
            <div>No name</div>
        </div>);

        const content = (
            <div className="popover-login">
                <a href='/profiles'>Your profile</a>
                <div>Sign out</div>
            </div>)

        const { current } = this.state;

        return (
            <Row style={{ paddingTop: 10, paddingBottom: 10 }} className="lms_ws_header--">
                <Modal title="Login form" centered={true} visible={this.state.isVisible} onOk={this.handleOk} onCancel={this.handleCancel} footer={null}>
                    <Row style={{ margin: '10px 0' }}>
                        <Input size="large" onChange={(text) => { this.setState({ username: text.target.value }) }} placeholder="Enter your email..." prefix={<UserOutlined />} style={{ borderRadius: 20 }} />
                    </Row>
                    <Row style={{ margin: '10px 0' }}>
                        <Input size="large" onChange={(text) => { this.setState({ password: text.target.value }) }} placeholder="Enter your password..." prefix={<KeyOutlined />} style={{ borderRadius: 20 }} />
                    </Row>
                    <Row style={{ textAlign: 'center', margin: '10px 0' }}>
                        <div>
                            <Button type='primary' onClick={this.handleLogin} style={{ borderRadius: 20, width: 100, padding: '5px 0', fontSize: 20, lineHeight: '20px' }}>Login</Button>
                        </div>
                    </Row>
                    <Row style={{ textAlign: 'center' }}>
                        <div style={{
                            width: "100%", color: '#cacaca',
                            fontWeight: 600
                        }}>Other login</div>
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
                <Col span={10}>

                </Col>
                <Col xs={8}>
                    {/* Authentication */}
                    <div className={styles.blockLogin}>
                        <Button className={styles.btnLogin} onClick={() => this.openLogin()}>
                            <Tooltip title="Click to login">
                                <PoweroffOutlined />
                            </Tooltip>
                        </Button>
                    </div>
                    {/* <ul></ul> */}
                    {/* <div style={{ textAlign: 'right' }}>
                    <Popover>
                        <span>
                            <i>
                                <img src={message} />
                            </i>
                        </span>
                    </Popover>
                    <Popover>
                        <span>
                            <i>
                                <img src={notification} />
                            </i>
                        </span>
                    </Popover>
                    <Popover placement="top" title={text} content={content} trigger="click">
                        <span>
                            <i>
                                <img src={profile} style={{ width: '32px' }} />
                            </i>
                            <span style={{
                                paddingLeft: '5px', fontSize: '15px',
                                fontWeight: '800',
                                color: '#fff'
                            }}>Profile</span>
                        </span>
                    </Popover>
                </div>
             */}
                </Col>
            </Row>
        )
    }
}


export default Headers
