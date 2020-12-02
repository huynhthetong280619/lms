import React, { Component } from 'react'
import { Button, Col, Row, Popover } from 'antd'

import styles from './styles.scss'
import './overwrite.css'

import message from '../../../assets/images/contents/chat.png'
import notification from '../../../assets/images/contents/notification.png'
import profile from '../../../assets/images/contents/profile.png'

class Headers extends Component {

    render() {
        const text = <div>
            <div>Sign in as</div>
            <div>No name</div>
        </div>;
        const content = (
            <div className="popover-login">
                <a href='/profiles'>Your profile</a>
                <div>Sign out</div>
            </div>
        );
        return <Row>
            <Col xs={12}>
                <div>
                    <span><a href="/">LOGO</a></span>
                </div>
            </Col>
            <Col xs={12}>
                {/* Authentication */}
                {/* <div className={styles.blockLogin}>
                    <Button className={styles.btnLogin}>Login</Button>
                </div> */}
                <div style={{ textAlign: 'right' }}>
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
            </Col>
        </Row>
    }
}

export default Headers
