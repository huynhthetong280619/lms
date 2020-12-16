import React from 'react'
import { Row, Col, Badge, Radio, Button } from 'antd'

import '../overwrite.css'
import glb_sv from '../../assets/global/global.service'
import survey from '../../../../assets/images/contents/surveylogo.png'

class SurveyExecute extends React.Component{

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
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>{glb_sv.nameSubject}</Col>
                </Row>
                <div style={{ width: '90%' }}>
                    <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                        <span>
                            <img src={survey} width="80px" />
                        </span>
                        <span style={{ fontWeight: '700' }}>[ SURVEY ] PART 1: CONSOLATE KNOWLEDGE</span>
                    </div>
                    <div style={{ width: '100%', minHeight: '150px' }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px"

                        }}>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <Badge count={1} className="site-badge-count-4" />
                                    <div style={{
                                        display: "inline-block",
                                        marginLeft: "5px"
                                    }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                </div>
                                <div className="ant-row">
                                    <Radio.Group name="radiogroup" defaultValue={1} style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-around"
                                    }}>
                                        <Radio value={1}>Đầy đủ và rất tốt</Radio>
                                        <Radio value={2}>Đầy đủ và tốt</Radio>
                                        <Radio value={3}>Bình thường</Radio>
                                        <Radio value={4}>Không đầy đủ </Radio>
                                    </Radio.Group>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <Badge count={2} className="site-badge-count-4" />
                                    <div style={{
                                        display: "inline-block",
                                        marginLeft: "5px"
                                    }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                </div>
                                <div className="ant-row">
                                    <Radio.Group name="radiogroup" defaultValue={1} style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-around"
                                    }}>
                                        <Radio value={1}>Đầy đủ và rất tốt</Radio>
                                        <Radio value={2}>Đầy đủ và tốt</Radio>
                                        <Radio value={3}>Bình thường</Radio>
                                        <Radio value={4}>Không đầy đủ </Radio>
                                    </Radio.Group>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <Badge count={3} className="site-badge-count-4" />
                                    <div style={{
                                        display: "inline-block",
                                        marginLeft: "5px"
                                    }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                </div>
                                <div className="ant-row">
                                    <Radio.Group name="radiogroup" defaultValue={1} style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-around"
                                    }}>
                                        <Radio value={1}>Đầy đủ và rất tốt</Radio>
                                        <Radio value={2}>Đầy đủ và tốt</Radio>
                                        <Radio value={3}>Bình thường</Radio>
                                        <Radio value={4}>Không đầy đủ </Radio>
                                    </Radio.Group>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <Badge count={4} className="site-badge-count-4" />
                                    <div style={{
                                        display: "inline-block",
                                        marginLeft: "5px"
                                    }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                </div>
                                <div className="ant-row">
                                    <Radio.Group name="radiogroup" defaultValue={1} style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-around"
                                    }}>
                                        <Radio value={1}>Đầy đủ và rất tốt</Radio>
                                        <Radio value={2}>Đầy đủ và tốt</Radio>
                                        <Radio value={3}>Bình thường</Radio>
                                        <Radio value={4}>Không đầy đủ </Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                            
                        </div>
                        <Row style={{padding: "25px"}}>
                            <div>
                            <Button type="primary" style={{borderRadius: 20}}>Submit survey</Button>
                            </div>
                        </Row>
                    </div>
                </div>
            </Row>
        
        </>
    }
}

export default SurveyExecute
