import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import { Row, Col, Button } from 'antd'

import survey from '../../assets/images/contents/surveylogo.png'

const SurveyPage = () => {
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
                        <img src={survey} width="80px" />
                    </span>
                    <span style={{fontWeight: '700'}}>[ SURVEY ] PART 1: CONSOLATE KNOWLEDGE</span>
                </div>
                <div style={{ width: '100%', minHeight: '150px' }}>
                      <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            marginBottom: "25px",
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px"
                        
                        }}>
                            <Button type="primary">Take survey</Button>
                        </div> 
                </div>
            </div>
        </Row>
    </IndexLayout>
}

export default SurveyPage
