import React from 'react'
import { Row, Col, Button } from 'antd'

import survey from '../../../assets/images/contents/surveylogo.png'

class Survey extends React.Component{

    render(){
        return <>
            <Row style={{
            width: '80%',
            textAlign: 'center',
            background: '#fff',
            borderRadius: '15px',
            minHeight: '20px'
        }}>
            <Row style={{ width: '100%' }}>
                <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>''</Col>
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
                            <Button style={{borderRadius: 20}} type="primary" href="/surveys/3">Take survey</Button>
                        </div> 
                </div>
            </div>
        </Row>
    
        </>
    }
}


export default Survey
