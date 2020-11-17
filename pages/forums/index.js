import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import { Row, Col } from 'antd'

import discussion from '../../assets/images/contents/discussion.jpg'
import discusad from '../../assets/images/contents/discusad.png'

const ForumPage = () => {
    return <IndexLayout>
        <Row style={{
            width: '80%',
            textAlign: 'center',
            background: '#fff',
            borderRadius: '15px',
            minHeight: '20px'
        }}>
            <Row style={{ width: '100%' }}>
                <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</Col>
            </Row>
            <div style={{ width: '90%' }}>
                <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                    <span>
                        <img src={discussion} width="80px" />
                    </span>
                    <span style={{fontWeight: '700'}}>[ DISCUSSION FORUM ] PART 1: BASIC PYTHON</span>
                </div>
                <div style={{ width: '100%', minHeight: '150px' }}>
                      <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            marginBottom: "25px",
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px"
                        
                        }}>
                            <i>
                                <img src={discusad} width="110px"/>
                            </i>
                        </div> 
                </div>
            </div>
        </Row>
    </IndexLayout>
}

export default ForumPage
