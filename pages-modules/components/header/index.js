import React, { Component } from 'react'
import { Button, Col, Row, Popover, Menu } from 'antd'

import styles from './styles.scss'
import './overwrite.css'

import message from '../../../assets/images/contents/chat.png'
import notification from '../../../assets/images/contents/notification.png'
import profile from '../../../assets/images/contents/profile.png'
import logo from '../../../assets/logo/logo.png'
import {SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
class Headers extends React.Component {

    state = {
        current: 'mail',
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
    };

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
            <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
                <Col xs={4}>
                    <div>
                        <span><a href="/">
                            <img src={logo} width={110} />
                        </a></span>
                    </div>
                </Col>
                <Col span={10}>
                   
                </Col>
                <Col xs={8}>
                    {/* Authentication */}
                    <div className={styles.blockLogin}>
                        <Button className={styles.btnLogin}>Login</Button>
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
