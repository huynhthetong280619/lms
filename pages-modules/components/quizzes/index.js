import React from 'react'
import { Row, Col, Button, Table } from 'antd'

import quizTime from '../../../assets/images/contents/quiz-time.png'
import { get } from 'lodash'
import moment from 'moment'
import restClient from '../../../assets/common/core/restClient'

class Quiz extends React.Component {

    transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    joinExam = async () => {
        await restClient.asyncGet(`/exam/${this.props.idExam}/attempt?idSubject=lthdt01&idTimeline=${this.props.idTimeline}`)
            .then(res => {
                console.log(res)
            })
    }

    render() {



        const columns = [
            {
                title: 'Student',
                dataIndex: 'student',
                key: 'student',
                render: data => <span> {get(data, 'surName') + " " + get(data, 'firstName')}</span>
            },
            {
                title: 'Grade',
                dataIndex: 'grade',
                key: 'grade',
            },
            {
                title: 'Review',
                dataIndex: 'review',
                key: 'review',
                render: () => <a>Review</a>
            },
        ];

        const { requirementExam } = this.props;

        console.log(requirementExam)

        return (<>
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
                    <div style={{ width: '100%', minHeight: '150px' }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            marginBottom: "25px",
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px"

                        }}>
                            <i>
                                <img src={quizTime} />
                            </i>
                            <div style={{fontSize: '2em'}}>{get(requirementExam, 'name')}</div>
                            <div>
                                <div><span style={{fontWeight: 700}}>Attemp allowed: </span> {get(get(requirementExam, 'setting'), 'attemptCount')}</div>
                                <div><span style={{fontWeight: 700}}>Attemp available: </span> {get(requirementExam, 'attemptAvailable')}</div>
                                <div><span style={{fontWeight: 700}}>Open: </span> {this.transTime(get(requirementExam, 'startTime'))}</div>
                                <div><span style={{fontWeight: 700}}>Closed: </span> {this.transTime(get(requirementExam, 'expireTime'))}</div>
                                <div><span style={{fontWeight: 700}}>Time remaining: </span> {get(requirementExam, 'timingRemain')}</div>
                                <div><span style={{fontWeight: 700}}>Status: </span>{get(requirementExam, 'isAttempt')  ? <span style={{color: '#44bd32', fontWeight: 900}}>Opening</span> : <span style={{color: '#e84118', fontWeight: 900}}>Closed</span>}</div>
                                <div><span style={{fontWeight: 700}}>Grading method: </span>Highest grade</div>
                            </div>
                            <div>
                                {(get(requirementExam,  'attemptAvailable') > 0 && get(requirementExam, 'isAttempt') == true) && <Button type="primary" href={`/exams/${this.props.idExam}/${this.props.idTimeline}`} style={{ borderRadius: 20 }} onClick={() => this.joinExam()}>Take quiz</Button>}
                                {(get(requirementExam,  'attemptAvailable') == 0) && <div style={{color: '#ff4000', fontStyle: 'italic', fontWeight: 900}}>Hết số lần cho phép làm bài quiz</div>}
                            </div>
                        </div>

                        <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            marginBottom: "25px",
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px"

                        }}>
                            <Table pagination={false} dataSource={get(requirementExam, 'submissions')} columns={columns} rowKey="_id" scroll={{ y: 240 }}/>
                        </div>
                    </div>
                </div>
            </Row>

        </>)
    }
}

export default Quiz
