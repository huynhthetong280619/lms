import React from 'react'

import surveyImg from '../../../assets/images/contents/survey.png'
import { get } from 'lodash'
import moment from 'moment'
import { Drawer, Row, Checkbox, Radio, Progress, Col, Popover, Modal, Tabs, Input, DatePicker, Upload, message, Button, Select, InputNumber } from 'antd'
const { TabPane } = Tabs;
import './overwrite.css'

class Survey extends React.Component {

    componentDidMount() {
        console.log('this.props.responseSurvey', this.props.responseSurvey)
    }
    transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    render() {
        const { survey } = this.props
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        };
        console.log('Survey', survey)
        return <div className="lms-ws-survey-page">
            <Row style={{
                width: '80%',
                textAlign: 'center',
                background: '#fff',
                minHeight: '20px'
            }}>
                <Row style={{ width: '100%' }}>
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject}</Col>
                </Row>
                <div style={{ width: '90%' }}>
                    <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                        <span>
                            <img src={surveyImg} width="80px" />
                        </span>
                        <span style={{ fontWeight: '700' }}>[ SURVEY ] PART 1: CONSOLATE KNOWLEDGE</span>
                    </div>
                    <div style={{ width: '100%', minHeight: '150px' }}>
                        {/* <Row style={{ width: '100%' }}>
                            <Col span={20} style={{ padding: '25px', fontSize: '2em' }}></Col>
                        </Row> */}
                        <div style={{ width: '90%' }}>
                            <div style={{ width: '100%', minHeight: '150px' }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '45px',
                                    marginBottom: "25px",
                                    border: "2px solid #c4c4c4",
                                    borderRadius: "20px"

                                }}>
                                    <i>
                                        <img src={surveyImg} />
                                    </i>
                                    <div style={{ fontSize: '2em' }}>{get(survey, 'name')}</div>
                                    <div>
                                        <div><span style={{ fontWeight: 700 }}>Closed: </span> {this.transTime(get(survey, 'expireTime'))}</div>
                                        <div><span style={{ fontWeight: 700 }}>Time remaining: </span> {moment(get(survey, 'timeRemain')).fromNow()}</div>
                                        <div><span style={{ fontWeight: 700 }}>Status: </span>{get(survey, 'isRemain') ? <span style={{ color: '#44bd32', fontWeight: 900 }}>Opening</span> : <span style={{ color: '#e84118', fontWeight: 900 }}>Closed</span>}</div>
                                    </div>
                                    <div>
                                        {(get(survey, 'isRemain') && get(survey, 'canAttempt')) && <Button type="primary" href={`/surveysTake/${this.props.idSurvey}?idSubject=${this.props.idSubject}&idTimeline=${this.props.idTimeline}`} style={{ borderRadius: 20 }}>Take survey</Button>}
                                        {(get(survey, 'isRemain') == false) && <div style={{ color: '#ff4000', fontStyle: 'italic', fontWeight: 900 }}>Hết hạn làm khảo sát</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Row style={{
                    width: '81%',
                    marginBottom: '30px',
                    border: '2px solid #cacaca',
                    borderRadius: '20px',
                    padding: '5px 10px',
                }}>
                    <Tabs defaultActiveKey="1" centered style={{ width: "100%" }}>
                        <TabPane tab="Your response" key="1" >


                        </TabPane>
                        <TabPane tab="View all response" key="2" >
                            {
                                (this.props.responseSurvey.questionnaire).map((q, index) => (
                                    q.typeQuestion == 'choice' ?
                                        (<div style={{ marginBottom: '20px', textAlign: 'left' }} key={q._id}>
                                            <div style={{ fontWeight: 600 }}><span>Question {index}: </span>{q.question}</div>
                                            <div >
                                                <Radio.Group style={{ width: "100%" }}>
                                                    {
                                                        q.answer.map(a => (<div style={{ display: 'flex' }}>
                                                            <div>
                                                                <Radio style={radioStyle} value={a._id} key={a._id}>
                                                                    {a.content}
                                                                </Radio>
                                                            </div>
                                                            <div style={{ width: '50%' }}>
                                                                <Progress percent={a.percent.split('%')[0]} />
                                                            </div>
                                                        </div>
                                                        ))
                                                    }
                                                </Radio.Group>
                                            </div>
                                        </div>) :
                                        (
                                            q.typeQuestion == 'multiple' ? (<div style={{ textAlign: 'left' }} key={q._id}>
                                                <div style={{ fontWeight: 600 }}>
                                                    <span>Question {index}: </span>{q.question}
                                                </div>
                                                <div>
                                                    <Checkbox.Group style={{ width: '100%' }}>
                                                        <Row>
                                                            <Col span={12} style={{ textAlign: 'left' }}>
                                                                <div>
                                                                    {
                                                                        q.answer.map(a => (<div style={{ display: 'flex' }}>
                                                                            <div>
                                                                                <Checkbox value={a._id} key={a._id}>
                                                                                    {a.content}
                                                                                </Checkbox>
                                                                            </div>
                                                                            <div style={{ width: '50%' }}>
                                                                                <Progress percent={a.percent.split('%')[0]} />
                                                                            </div>
                                                                        </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </Col>
                                                            <Col span={12}>
                                                            </Col>
                                                        </Row>
                                                    </Checkbox.Group>
                                                </div>
                                            </div>
                                            )

                                                : <div style={{ textAlign: 'left' }} key={q._id}>
                                                    <div style={{ fontWeight: 600 }}>
                                                        <span>Question {index}: </span>{q.question}
                                                    </div>
                                                    <div>
                                                        <input type="text" onChange={(e) => this.onFill(e, q._id)} />
                                                    </div>
                                                </div>
                                        )
                                )
                                )
                            }
                        </TabPane>
                    </Tabs>
                </Row>
            </Row>

        </div>
    }
}


export default Survey
