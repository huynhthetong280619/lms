import React, { Component } from 'react'
import { Button, Col, Row } from 'antd'

import styles from './styles.scss'

class Footers extends Component{
    render(){
        return <>
            <Row style={{color: '#fff', marginBottom: '15px'}}>
                <Col span={10}>
                    <div>Hệ thống học trực tuyến</div>
                    <div>Trường Đại học sư phạm kỹ thuật TP.Hồ Chí Minh</div>
                </Col>
                <Col span={10}>
                    <div>Điều khoản</div>
                    <div>Chính sách</div>
                </Col>
            </Row>
            <Row style={{color: '#fff', marginBottom: '15px'}}>
                <Col span={10}>
                    <i></i>
                    <span>www.itonline.hcmute.edu.vn</span>
                </Col>
                <Col span={10}>
                    <div>Social network</div>
                </Col>
            </Row>
            <Row style={{textAlign:'center', color: '#fff', fontWeight: '700'}}>
                <div>Copyright HCMUTE © 2020</div>
            </Row>
        </>
    }
}

export default Footers
