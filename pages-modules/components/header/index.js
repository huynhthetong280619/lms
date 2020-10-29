import React, { Component } from 'react'
import { Button, Col, Row } from 'antd'


class Headers extends Component{
    render(){
        return <Row>
            <Col>
                <div>LOGO</div>
            </Col>
            <Col>
                <Button>Login</Button>
            </Col>
        </Row>
    }
}

export default Headers
