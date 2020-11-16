import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import {Row, Col, Tabs} from 'antd'
import {AlertOutlined, CheckCircleTwoTone  } from '@ant-design/icons'
const {TabPane} = Tabs

import styles from './styles.scss'
const ProfilePage = () => {
    return <IndexLayout>
        <Row className={styles.background} style={{ justifyContent: 'center' }}>
                <Col span={12}
                    style={{
                        margin: '10px',
                        background: '#fff',
                        borderRadius: '10px',
                        minHeight: '200px'
                    }}>
                    
                </Col>
                <Col span={8}
                    style={{
                        margin: '10px',
                        background: '#fff',
                        borderRadius: '10px',
                        minHeight: '200px'
                    }}>
                    <div>
                        <div style={{
                            textAlign: 'center',
                            padding: '10px 0'
                        }}>
                            <i>
                            </i>
                            <span style={{ padding: '25px', fontSize: '2em' }}>UPCOMING DEADLINE</span>
                        </div>
                    </div>
                    <div>
                        {/* Empty */}
                        {/* <div style={{
                            textAlign: 'center',
                            padding: '45px'
                        }}>
                            <i>
                                <img src={deadlineCalcular} />
                            </i>
                            <div style={{ color: '#c4c4c4', fontStyle: 'italic' }}>No upcoming deadline</div>
                        </div> */}
                        {/* Deadline */}
                        <Row style={{justifyContent: 'center'}}>
                        <Tabs defaultActiveKey="1" centered>
                            <TabPane tab={<span> <AlertOutlined twoToneColor="#ff0000"/>Deadline</span>} key="1">
                                <Row>
                                    <Col span={10}><i>
                                        </i></Col>
                                    <Col span={14}>
                                        <div>Ngôn ngữ lập trình tiên tiến</div>
                                        <div><span>Due to:</span>20/10/2020</div>
                                        <div>Time remaining: 2 hours</div>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab={<span> <CheckCircleTwoTone twoToneColor="#52c41a" />
  
                    Complete</span>} key="2">
                    <Row>
                                    <Col span={10}><i>
                                        </i></Col>
                                    <Col span={14}>
                                        <div>Ngôn ngữ lập trình tiên tiến</div>
                                        <div><span>Due to:</span>20/10/2020</div>
                                        <div>Time remaining: 2 hours</div>
                                    </Col>
                                </Row>  
                            </TabPane>
                        </Tabs>
                        </Row>
                    </div>
                </Col>
            </Row>
    </IndexLayout>
}

export default ProfilePage
