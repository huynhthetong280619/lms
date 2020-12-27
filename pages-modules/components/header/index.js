import React, { Component } from 'react'
import { Button, Col, Row, Popover, Menu, Modal, Input, Tooltip, Spin } from 'antd'

import styles from './styles.scss'
import './overwrite.css'

import message from '../../../assets/images/contents/chat.png'
import notification from '../../../assets/images/contents/notification.png'
import profile from '../../../assets/images/contents/profile.png'
import logo from '../../../assets/logo/logo.png'
import { UserOutlined, KeyOutlined, GoogleOutlined, FacebookOutlined, PoweroffOutlined, LoadingOutlined } from '@ant-design/icons';
import restClient from '../../../assets/common/core/restClient'
import Router from 'next/router'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import glb_sv from '../../../assets/global/global.service';
import dynamic from 'next/dynamic'

// const DynamicComponentWithNoSSR = dynamic(
//     () => import('../../basic-component/dynamicNoSSR'),
//     { ssr: false }
// )

const { SubMenu } = Menu;
class Headers extends React.Component {

    state = {
        current: 'mail',
        isVisible: false,
        account: {
            code: '',
            password: ''
        },
        isLogin: false
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

    loginNormal = async () => {
        this.setState({
            isLogin: true
        })
        console.log('loginNormal', this.state.account);

        // define data
        const data = this.state.account
        // call api authenticate

        await restClient.asyncPost(`/user/authenticate`, data)
            .then(res => res.data)
            .then(data => {
                console.log('data', data)
                this.setState({
                    isLogin: true
                })

                setCookie(null, 'token', data.token, {
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/'
                })

                // glb_sv.token = data.token
                // console.log(data)
                // localStorage.setItem('token', data.token)

                // console.log('localStorage', localStorage.getItem('token'))
                console.log('normalLogin', data)
                // Router.push('/courses')
            })

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
                        <Input size="large" placeholder="Enter your code..." prefix={<UserOutlined />} style={{ borderRadius: 20 }} onChange={(e) => this.setState({ account: { ...this.state.account, code: e.target.value.trim() } })} />
                    </Row>
                    <Row style={{ margin: '10px 0' }}>
                        <Input size="large" placeholder="Enter your password..." prefix={<KeyOutlined />} style={{ borderRadius: 20 }} onChange={(e) => this.setState({ account: { ...this.state.account, password: e.target.value.trim() } })} />
                    </Row>
                    <Row style={{ textAlign: 'center', margin: '10px 0' }}>
                        <div>
                            <Button type='primary' style={{ borderRadius: 20, width: 100, padding: '5px 0', fontSize: 20, lineHeight: '20px' }} onClick={() => this.loginNormal()} disabled={this.state.isLogin}>{this.state.isLogin && <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#fff', marginRight: 5 }} spin />} />}Login</Button>
                        </div>
                    </Row>
                    <Row style={{ textAlign: 'center' }}>
                        <div style={{
                            width: "100%", color: '#cacaca',
                            fontWeight: 600
                        }}>Other login</div>
                        {/* <DynamicComponentWithNoSSR /> */}
                        <Row style={{ width: "100%" }}>
                            <Col span={12} style={{ cursor: 'pointer' }}>
                                <div>
                                    <GoogleOutlined style={{ color: "#ff4000", fontSize: 50 }} /></div><div style={{
                                        fontWeight: 700,
                                        color: '#756c6c'
                                    }}>Login with Google</div>
                            </Col>
                            <Col span={12} style={{ cursor: 'pointer' }}>
                                <FacebookOutlined style={{ color: "#0B83ED", fontSize: 50 }} /><div style={{
                                    fontWeight: 700,
                                    color: '#756c6c'
                                }}>Login with Facebook</div>
                            </Col>
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
