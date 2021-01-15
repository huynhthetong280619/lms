import React from 'react';
import { Row, Col, Button, Radio, Checkbox, notification, Tooltip } from 'antd'

import survey from '../../../assets/images/contents/surveylogo.png'
import { get } from 'lodash'
import './overwrite.css'
import Countdown from "react-countdown";
import restClient from '../../../assets/common/core/restClient';
import { notifyError, notifySuccess } from '../../../assets/common/core/notify';
import Router from 'next/router'
import CountDownTest from '../countDown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withTranslation } from 'react-i18next'
import '../fontAwesomeIcon'
import HeadPage from '../headPage/headPage.jsx';

class Exams extends React.Component {

    state = {
        answer: {},
        loading: false,
    };

    componentDidMount() {

        const obj = {};

        if (this.props.examQuestion != null) {
            this.props.examQuestion.questions.map(q => {
                obj[q._id] = null
            })
        }


        this.setState({
            answer: obj,
            callBackResponse: false
        })

    }

    onChoice = (questionAns, questionsId) => {
        //console.log('onChange', { ...this.state.answer, [questionsId]: questionAns.target.value })
        this.setState({
            answer: { ...this.state.answer, [questionsId]: questionAns.target.value }
        });
    };

    onChangeMultipleChoice = (questionAns, questionsId) => {
        //console.log('checked = ', questionAns, questionsId);
        this.setState({
            answer: { ...this.state.answer, [questionsId]: questionAns }
        });
    }

    submitExam = async () => {
        this.setState({ loading: true });
        const questionId = Object.keys(this.state.answer)

        let convert = []
        questionId.map(key => {
            convert.push({
                ['questionId']: key,
                ['answerId']: this.state.answer[key]
            })
        })



        // Push up to server
        //console.log(convert)
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: this.props.idTimeline,
            data: convert
        }
        await restClient.asyncPost(`/exam/${this.props.idExam}/submit`, data, this.props.token)
            .then(res => {
                if (!res.hasError) {
                    notification.success({
                        message: res.data.message,
                        placement: 'topRight'
                    });
                    //console.log('Rest client', get(res, 'data'));
                    Router.push(`/quizzis/${this.props.idExam}?idSubject=${this.props.idSubject}&idTimeline=${this.props.idTimeline}`)
                } else {
                    this.setState({ loading: false });
                    notifyError(this.props.t('failure'), res.data.message);
                }
            })
    }


    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        };

        const { examQuestion, t } = this.props;

        //console.log(examQuestion)

        const renderer = ({ hours, minutes, seconds, completed }) => {
            if (completed) {
                // Render a completed state
                return <div>{t('time_out')}</div>;
            } else {
                // Render a countdown
                return <CountDownTest hours={hours} minutes={minutes} seconds={seconds} />
                // return <span>{hours} hours {minutes} minutes {seconds} seconds</span>;
            }
        };

        return <>
            <HeadPage title={`${this.props.nameSubject}: ${examQuestion.name}`} />
            <Row id="lms-ws-exam-component" style={{
                width: '85%',
                textAlign: 'center',
                background: '#fff',
                minHeight: '20px', margin: '0 auto',
                justifyContent: 'center'
            }}>

                <Row style={{ width: '100%' }}>
                    <Col span={24} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject.toUpperCase()}</Col>
                </Row>
                <Row style={{
                    width: '100%', position: 'fixed',
                    top: 0,
                    left: '42%'
                }}>
                    <Countdown date={Date.now() + get(examQuestion, 'timeToDo')} renderer={renderer} />
                </Row>
                <div style={{ width: '90%' }}>
                    <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                        <span>
                            <FontAwesomeIcon icon="spell-check" style={{ width: 60, height: 60, color: '#F79F1F' }} />
                        </span>
                        <span style={{ fontWeight: '700' }}>{get(examQuestion, 'name').toUpperCase()}</span>
                    </div>
                    <div style={{ width: '100%', minHeight: '150px' }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            marginBottom: "25px",
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px"

                        }}>
                            {
                                (get(examQuestion, 'questions') || []).map((q, index) => (
                                    q.typeQuestion === "multiple" ?
                                        (
                                            <div className="ant-row" style={{ marginBottom: 10 }}>
                                                <Col span={10} style={{ textAlign: 'left' }}>
                                                    <div style={{ fontWeight: 600 }}><span>{t('question')} {index + 1}: </span>{q.question}</div>
                                                    <div>
                                                        <Checkbox.Group style={{ width: '100%' }} onChange={e => this.onChangeMultipleChoice(e, q._id)}>
                                                            <Row>
                                                                <Col span={12} style={{ textAlign: 'left' }}>
                                                                    <div>
                                                                        {
                                                                            q.answers.map(a => (
                                                                                <div>
                                                                                    <Tooltip title={a.answer}><Checkbox value={a._id}>{a.answer}</Checkbox></Tooltip>
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
                                                </Col>
                                                <Col span={12} >
                                                </Col>
                                            </div>
                                        )
                                        :
                                        (<div className="ant-row" style={{ marginBottom: 10 }}>
                                            <Col span={10} style={{ textAlign: 'left' }}>
                                                <div style={{ fontWeight: 600 }}><span>{t('question')} {index + 1}: </span>{q.question}</div>
                                                <div>
                                                    <Radio.Group onChange={e => this.onChoice(e, q._id)} value={get(this.state.answer, q._id)}>
                                                        {
                                                            q.answers.map(a => (
                                                                <Radio style={radioStyle} value={a._id}>
                                                                    <Tooltip title={a.answer}>{a.answer.length > 150 ? a.answer.slice(0, 150) + '...' : a.answer}</Tooltip>
                                                                </Radio>
                                                            ))
                                                        }
                                                    </Radio.Group>
                                                </div>
                                            </Col>
                                            <Col span={12} >
                                            </Col>
                                        </div>)
                                ))
                            }
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <Button type="primary" loading={this.state.loading} onClick={() => this.submitExam()}>{t('quiz_submit')}</Button>
                        </div>
                    </div>
                </div>
            </Row>
        </>
    }
}

export default withTranslation('translations')(Exams);
