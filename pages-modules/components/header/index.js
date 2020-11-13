import React, { Component } from 'react'
import { Button, Col, Row } from 'antd'

import styles from './styles.scss'

class Headers extends Component{
    render(){
        return <Row>
            <Col xs={12}>
                <div>
                    <span>LOGO</span>
                </div>
            </Col>
            <Col xs={12}>
                <div className={styles.blockLogin}>
                    <Button className={styles.btnLogin}>Login</Button>
                </div>
            </Col>
        </Row>
    }
}

export default Headers
