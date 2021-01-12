import React from 'react'

import surveyImg from '../../../assets/images/contents/survey.png'
import { get } from 'lodash'
import moment from 'moment'
import { Row, Checkbox, Radio, Progress, Col, Tabs, Button } from 'antd'
const { TabPane } = Tabs;
import './overwrite.css'
import '../fontAwesomeIcon'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withTranslation } from 'react-i18next'

class Survey extends React.Component {

    componentDidMount() {
        console.log('this.props.responseSurvey', this.props.replyCurrent)
    }
    transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    render() {
        const { survey, t } = this.props

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        };
        console.log('Survey', survey)
        return <div className="lms-ws-survey-page">
            <Row style={{
                width: '85%',
                textAlign: 'center',
                background: '#fff',
                minHeight: '20px',
                justifyContent: 'center'
            }}>
                <Row style={{ width: '100%' }}>
                    <Col span={24} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject.toUpperCase()}</Col>
                </Row>
                <div style={{ width: '90%' }}>
                    <div style={{ width: '100%', minHeight: '150px' }}>
                        <div style={{ width: '90%', margin: '0 auto' }}>
                            <div style={{ width: '100%', minHeight: '150px' }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '45px',
                                    marginBottom: "25px",
                                    border: "2px solid #c4c4c4",
                                    borderRadius: "20px"

                                }}>
                                    <i>
                                    <FontAwesomeIcon icon="poll" style={{ width: 105, height: 105, color: '#ff4000' }} />
                                    </i>
                                    <div style={{ fontSize: '2em' }}>[ {t('survey')}] {get(survey, 'name')}</div>
                                    <div>
                                        <div><span style={{ fontWeight: 700 }}>{t('close')}: </span> {this.transTime(get(survey, 'expireTime'))}</div>
                                        <div><span style={{ fontWeight: 700 }}>{t('time_remain')}: </span> {moment.utc(get(survey, 'expireTime')).fromNow()}</div>
                                        <div><span style={{ fontWeight: 700 }}>{t('status')}: </span>{get(survey, 'isRemain') ? <span style={{ color: '#44bd32', fontWeight: 900 }}>Opening</span> : <span style={{ color: '#e84118', fontWeight: 900 }}>Closed</span>}</div>
                                    </div>
                                    <div>
                                        {(get(survey, 'isRemain') && get(survey, 'canAttempt')) && <Button type="primary" href={`/surveysTake/${this.props.idSurvey}?idSubject=${this.props.idSubject}&idTimeline=${this.props.idTimeline}`} style={{ marginTop: 25 }}>{t('take_survey')}</Button>}
                                        {(get(survey, 'isRemain') == false) && <div style={{ color: '#ff4000', fontStyle: 'italic', fontWeight: 900 }}>{t('msg_timeup_survey')}</div>}
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
                    padding: '5px 10px 15px 10px'
                }}>
                    <Tabs defaultActiveKey="1" centered style={{ width: "100%" }}>
                        <TabPane tab="Your response" key="1" >

                            {!this.props.replyCurrent.success ? <div>{this.props.replyCurrent.message}</div> :
                                <div>
                                    {
                                        (this.props.replyCurrent.questionnaire).map((q, index) => (
                                            q.typeQuestion == 'choice' ?
                                                (<div style={{ marginBottom: '20px', textAlign: 'left' }} key={q._id}>
                                                    <div style={{ fontWeight: 600 }}><span>{t('question')} {index}: </span>{q.question}</div>
                                                    <div>
                                                        <Radio.Group disabled value={this.props.replyCurrent.response.answerSheet[index].answer}>
                                                            {
                                                                q.answer.map(a => (
                                                                    <Radio style={radioStyle} value={a._id} key={a._id}>
                                                                        {a.content}
                                                                    </Radio>
                                                                ))
                                                            }
                                                        </Radio.Group>
                                                    </div>
                                                </div>) :
                                                (
                                                    q.typeQuestion == 'multiple' ? (<div style={{ textAlign: 'left' }} key={q._id}>
                                                        <div style={{ fontWeight: 600 }}>
                                                            <span>{t('question')} {index}: </span>{q.question}
                                                        </div>
                                                        <div>
                                                            <Checkbox.Group style={{ width: '100%' }} disabled value={this.props.replyCurrent.response.answerSheet[index].answer}>
                                                                <Row>
                                                                    <Col span={12} style={{ textAlign: 'left' }}>
                                                                        <div>
                                                                            {
                                                                                q.answer.map(a => (
                                                                                    <div key={a._id}>
                                                                                        <Checkbox value={a._id}>{a.content}</Checkbox>
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
                                                                <span>{t('question')} {index}: </span>{q.question}
                                                            </div>
                                                            <div>
                                                                <input type="text" value={this.props.replyCurrent.response.answerSheet[index].answer} disabled />
                                                            </div>
                                                        </div>
                                                )
                                        )
                                        )
                                    }
                                </div>
                            }
                        </TabPane>
                        <TabPane tab={`View all response (${this.props.responseSurvey.totalResponses})`} key="2" >
                            {
                                (this.props.responseSurvey.questionnaire).map((q, index) => (
                                    q.typeQuestion == 'choice' ?
                                        (<div style={{ marginBottom: '20px', textAlign: 'left' }} key={q._id}>
                                            <div style={{ fontWeight: 600 }}><span>Question {index}: </span>{q.question}</div>
                                            <Row>
                                                <Col span={12}>
                                                    <Radio.Group style={{ width: "50%" }} disabled>
                                                        {
                                                            q.answer.map(a => (<div style={{ display: 'flex' }}>
                                                                <div style={{ width: '50%' }}>
                                                                    <Radio style={radioStyle} value={a._id} key={a._id}>
                                                                        {a.content}
                                                                    </Radio>
                                                                </div>
                                                            </div>
                                                            ))
                                                        }
                                                    </Radio.Group>
                                                </Col>
                                                <Col span={12}>
                                                    {
                                                        q.answer.map(a => (<div style={{ display: 'flex', height: 30 }}>
                                                            <div style={{ width: '50%' }}>
                                                                <Progress percent={a.percent.split('%')[0]} />
                                                            </div>
                                                        </div>
                                                        ))
                                                    }
                                                </Col>
                                            </Row>
                                        </div>) :
                                        (
                                            q.typeQuestion == 'multiple' ? (<div style={{ marginBottom: '20px', textAlign: 'left' }} key={q._id}>
                                                <div style={{ fontWeight: 600 }}><span>{t('question')} {index}: </span>{q.question}</div>
                                                <Row>
                                                    <Col span={12} >
                                                        <Radio.Group style={{ width: "50%" }} disabled>
                                                            {
                                                                q.answer.map(a => (<div style={{ display: 'flex' }}>
                                                                    <div style={{ width: '50%' }}>
                                                                        <Radio style={radioStyle} value={a._id} key={a._id}>
                                                                            {a.content}
                                                                        </Radio>
                                                                    </div>
                                                                   
                                                                </div>
                                                                ))
                                                            }
                                                        </Radio.Group>
                                                    </Col>
                                                    <Col span={12}>
                                                        {
                                                            q.answer.map(a => (<div style={{ display: 'flex', height: 30 }}>
                                                                <div style={{ width: '50%' }}>
                                                                    <Progress percent={a.percent.split('%')[0]} />
                                                                </div>
                                                            </div>
                                                            ))
                                                        }
                                                    </Col>
                                                </Row>
                                            </div>)

                                                : <div style={{ textAlign: 'left' }} key={q._id}>
                                                    <div style={{ fontWeight: 600 }}>
                                                        <span>{t('question')} {index}: </span>{q.question}
                                                    </div>
                                                    <div>
                                                        <span>{q.answer[0]}</span>
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


export default withTranslation('translations')(Survey)
