import React from 'react'
import { Row, Col, Button } from 'antd'

import surveyImg from '../../../assets/images/contents/survey.png'
import { get } from 'lodash'
import moment from 'moment'

class Survey extends React.Component {

    componentDidMount() {

    }
    transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    render() {
        const { survey } = this.props
        console.log('Survey', survey)
        return <>
            <Row style={{
                width: '80%',
                textAlign: 'center',
                background: '#fff',
                borderRadius: '15px',
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
            </Row>
        </>
    }
}


export default Survey
