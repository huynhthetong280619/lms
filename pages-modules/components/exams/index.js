import React from 'react';
import { Row, Col, Button, Radio, Input, Checkbox } from 'antd'

import survey from '../../../assets/images/contents/surveylogo.png'
import { get } from 'lodash'
import './overwrite.css'
import Countdown from "react-countdown";
import restClient from '../../../assets/common/core/restClient';
import { Redirect } from 'react-router'

class Exams extends React.Component {

    state = {
        answer: {},
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
            callBackRepsonse: false
        })

    }

    onChoice = (questionAns, questionsId) => {
        console.log('onChange', { ...this.state.answer, [questionsId]: questionAns.target.value })
        this.setState({
            answer: { ...this.state.answer, [questionsId]: questionAns.target.value }
        });
    };

    onChangeMultipleChoice = (questionAns, questionsId) => {
        console.log('checked = ', questionAns, questionsId);
        this.setState({
            answer: { ...this.state.answer, [questionsId]: questionAns }
        });
    }

    submitExam = async () => {
        const questionId = Object.keys(this.state.answer)

        let convert = []
        questionId.map(key => {
            convert.push({
                ['questionId']: key,
                ['answerId']: this.state.answer[key]
            })
        })

        

        // Push up to server
        console.log(convert)
        const data = {
            idSubject: 'lthdt01',
            idTimeline: '5f75e682817a140f580937bc',
            data: convert
        }
        await restClient.asyncPut(`/exam/5fc5faf66d1c0c08dca71b82/submit`, data)
        .then(res => {
            if(!res.hasError){
                console.log('Rest client', get(res, 'data'));
            }
            this.setState({
                callBackRepsonse: true
            })
            console.log(res)
        })
    }


    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        };

        const { examQuestion } = this.props;

        console.log(examQuestion)

        const renderer = ({ hours, minutes, seconds, completed }) => {
            if (completed) {
              // Render a completed state
              return <div>Hello</div>;
            } else {
              // Render a countdown
              return <span>{hours} hours {minutes} minutes {seconds} seconds</span>;
            }
          };

        if(this.state.callBackRepsonse){
            return <Redirect to="/quizzis" />
        }

        return <>
            
            <Row id="lms-ws-exam-component" style={{
                width: '80%',
                textAlign: 'center',
                background: '#fff',
                borderRadius: '15px',
                minHeight: '20px'
            }}>
                
                <Row style={{ width: '100%' }}>
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</Col>
                </Row>
                <Row>
                    <Countdown date={Date.now() + get(examQuestion, 'timeToDo')} renderer={renderer}/>
                </Row>
                <div style={{ width: '90%' }}>
                    <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                        <span>
                            <img src={survey} width="80px" />
                        </span>
                        <span style={{ fontWeight: '700' }}>[ EXAM ] {get(examQuestion, 'name')}</span>
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
                                            <div className="ant-row" style={{marginBottom: 10}}>
                                                <Col span={10} style={{ textAlign: 'left' }}>
                                                    <div style={{fontWeight: 600}}><span>Question {index}: </span>{q.question}</div>
                                                    <div>
                                                        <Checkbox.Group style={{ width: '100%' }} onChange={e => this.onChangeMultipleChoice(e, q._id)}>
                                                            <Row>
                                                                <Col span={12} style={{ textAlign: 'left' }}>
                                                                    <div>
                                                                    {
                                                                        q.answers.map(a => (
                                                                            <div>
                                                                                <Checkbox value={a._id}>{a.answer}</Checkbox>
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
                                        (<div className="ant-row" style={{marginBottom: 10}}>
                                            <Col span={10} style={{ textAlign: 'left' }}>
                                                <div style={{fontWeight: 600}}><span>Question {index}: </span>{q.question}</div>
                                                <div>
                                                    <Radio.Group onChange={e => this.onChoice(e, q._id)} value={get(this.state.answer, q._id)}>
                                                        {
                                                            q.answers.map(a => (
                                                                <Radio style={radioStyle} value={a._id}>
                                                                    {a.answer}
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
                        <div style={{ marginBottom: 10 }}>
                            <Button type="primary" style={{ borderRadius: 20 }} onClick={() => this.submitExam()}>Submit</Button>
                        </div>
                    </div>
                </div>
            </Row>
        </>
    }
}

export default Exams
