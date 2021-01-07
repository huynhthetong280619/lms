import React from 'react'
import { Row, Col, Button, Table } from 'antd'

import quizTime from '../../../assets/images/contents/quiz-time.png'
import { get } from 'lodash'
import moment from 'moment'
import restClient from '../../../assets/common/core/restClient'

import './overwrite.css'

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTeacherPrivilege: false,
            submissions: [],
            columns: [],
        }
    }


    transTime = (time) => {
        console.log('transTime', time)
        return moment(time, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }

    joinExam = async () => {
        await restClient.asyncGet(`/exam/${this.props.idExam}/attempt?idSubject=lthdt01&idTimeline=${this.props.idTimeline}`, this.props.token)
            .then(res => {
                console.log(res)
            })
    }
    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.idPrivilege == 'student') {
            this.setState({
                isTeacherPrivilege: false,
            })
        }

        if (user?.idPrivilege == 'teacher') {
            this.setState({
                isTeacherPrivilege: true
            })
        }
        this.setState({
            submissions: get(this.props.requirementExam, 'submissions')
        })


        if (user?.idPrivilege == 'teacher') {
            this.setState({
                columns: [
                    {
                        title: 'Student',
                        dataIndex: 'student',
                        key: 'student',
                        render: (data) => {
                            console.log(data);
                            return (<span> {get(data, 'surName') + " " + get(data, 'firstName')}</span>)
                        }
                    },
                    {
                        title: 'Grade',
                        dataIndex: 'grade',
                        key: 'grade',
                        render: (data) => (
                            data ? <span>{data}</span> : <span>Chưa làm bài</span>
                        )
                    },
                    {
                        title: 'Review',
                        dataIndex: 'review',
                        key: 'review',
                        render: () => <a>Review</a>
                    },
                ]
            });
        } else {
            this.setState({
                columns: [
                    {
                        title: 'Attempt',
                        dataIndex: 'time',
                        key: 'time',
                        render: data => <span> {data}</span>
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
                ]
            })
        }
    }

    render() {

        const { requirementExam } = this.props;

        console.log('requirementExam', requirementExam)

        return (<>
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
                            <div style={{ fontSize: '2em' }}>{get(requirementExam, 'name')}</div>
                            <div>
                                <div><span style={{ fontWeight: 700 }}>Attemp allowed: </span> {get(get(requirementExam, 'setting'), 'attemptCount')}</div>
                                {!this.state.isTeacherPrivilege && (<div><span style={{ fontWeight: 700 }}>Attemp available: </span> {get(requirementExam, 'attemptAvailable')}</div>)}
                                <div><span style={{ fontWeight: 700 }}>Open: </span> {this.transTime(get(requirementExam, 'startTime'))}</div>
                                <div><span style={{ fontWeight: 700 }}>Closed: </span> {this.transTime(get(requirementExam, 'expireTime'))}</div>
                                <div><span style={{ fontWeight: 700 }}>Time remaining: </span> {get(requirementExam, 'timingRemain')}</div>
                                <div><span style={{ fontWeight: 700 }}>Status: </span>{get(requirementExam, 'isOpen') ? <span style={{ color: '#44bd32', fontWeight: 900 }}>Opening</span> : <span style={{ color: '#e84118', fontWeight: 900 }}>Closed</span>}</div>
                                <div><span style={{ fontWeight: 700 }}>Grading method: </span>Highest grade</div>
                            </div>
                            {!this.state.isTeacherPrivilege && (<div>
                                {(get(requirementExam, 'attemptAvailable') > 0 && get(requirementExam, 'isAttempt') == true) && <Button type="primary" href={`/exams/${this.props.idExam}?idSubject=${this.props.idSubject}&idTimeline=${this.props.idTimeline}`} style={{ borderRadius: 20 }} onClick={() => this.joinExam()}>Take quiz</Button>}
                                {(get(requirementExam, 'attemptAvailable') == 0) && <div style={{ color: '#ff4000', fontStyle: 'italic', fontWeight: 900 }}>Hết số lần cho phép làm bài quiz</div>}
                                {(!get(requirementExam, 'isOpen')) && (get(requirementExam, 'isRemain')) && <div style={{ color: '#ff4000', fontStyle: 'italic', fontWeight: 900 }}>Chưa đến thời gian làm bài quiz</div>}
                            </div>)}
                        </div>

                        <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            marginBottom: "25px",
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px"

                        }}>
                            <Table pagination={false} dataSource={this.state.submissions} columns={this.state.columns} rowKey='key' scroll={{ y: 240 }} />
                        </div>
                    </div>
                </div>
            </Row>

        </>)
    }
}

export default Quiz
