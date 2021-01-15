import React from 'react'
import { Row, Col, Button, Table, Tag, Typography } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import quizTime from '../../../assets/images/contents/quiz-time.png'
import { get } from 'lodash'
import moment from 'moment'
import restClient from '../../../assets/common/core/restClient'
import { withTranslation } from 'react-i18next'
import HeadPage from '../headPage/headPage.jsx';
const { Text } = Typography;

import './overwrite.css'

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTeacherPrivilege: false,
            submissions: [],
        }
    }


    transTime = (time) => {
        //console.log('transTime', time)
        return moment(time, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }

    // joinExam = async () => {
    //     await restClient.asyncGet(`/exam/${this.props.idExam}/attempt?idSubject=lthdt01&idTimeline=${this.props.idTimeline}`, this.props.token)
    //         .then(res => {
    //             console.log(res)
    //         })
    // }
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
    }

    render() {

        const { requirementExam, t } = this.props;

        const { isTeacherPrivilege } = this.state;

        let columns = []

        if (isTeacherPrivilege) {
            columns = [
                {
                    title: t('student'),
                    dataIndex: 'student',
                    key: 'student',
                    render: (data) => {
                        //console.log(data);
                        return (<span> {get(data, 'surName') + " " + get(data, 'firstName')}</span>)
                    }
                },
                {
                    title: t('grade'),
                    dataIndex: 'grade',
                    key: 'grade',
                    render: (data) => (
                        data ? <Text type='success'>{data}</Text> : <Text type='danger'>{t('not_do')}</Text>
                    )
                },
                {
                    title: t('review'),
                    dataIndex: 'review',
                    key: 'review',
                    render: () => <a>{t('review')}</a>
                },
            ]
        } else {
            columns = [
                {
                    title: t('time_attempt'),
                    dataIndex: 'time',
                    key: 'time',
                    render: data => <span> {data}</span>
                },
                {
                    title: t('grade'),
                    dataIndex: 'grade',
                    key: 'grade',
                },
                {
                    title: t('status'),
                    dataIndex: 'isContinue',
                    key: 'isContinue',
                    render: (data) => data ? <Tag icon={<SyncOutlined spin />} color="processing" >{this.props.t('doing')}</Tag> : <Tag color="success">{t('completed')}</Tag>
                },
                {
                    dataIndex: 'isContinue',
                    key: 'isContinue',
                    render: (data) => data ? <a href={`/exams/${this.props.idExam}?idSubject=${this.props.idSubject}&idTimeline=${this.props.idTimeline}`}>{t('continue')}</a> : null
                }
            ]
        }

        //console.log('requirementExam', requirementExam)

        return (
            <>
                <HeadPage title={`${this.props.nameSubject}: ${requirementExam.name}`} />
                <div className="lms-ws-quizzes-page">
                    <Row style={{
                        width: '85%',
                        textAlign: 'center',
                        background: '#fff',
                        minHeight: '20px',
                        margin: '0 auto',
                        justifyContent: 'center'
                    }}>
                        <Row style={{ width: '100%' }}>
                            <Col span={24} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject.toUpperCase()}</Col>
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
                                        <div><span style={{ fontWeight: 700 }}>{t('attempt_allowed')} </span> {get(get(requirementExam, 'setting'), 'attemptCount')}</div>
                                        {!this.state.isTeacherPrivilege && (<div><span style={{ fontWeight: 700 }}>{t('attempt_available')}</span> {get(requirementExam, 'attemptAvailable')}</div>)}
                                        <div><span style={{ fontWeight: 700 }}>{t('quiz_open')}</span> {this.transTime(get(requirementExam, 'startTime'))}</div>
                                        <div><span style={{ fontWeight: 700 }}>{t('quiz_close')}</span> {this.transTime(get(requirementExam, 'expireTime'))}</div>
                                        <div><span style={{ fontWeight: 700 }}>{t('quiz_time_remaining')}</span> {get(requirementExam, 'timingRemain')}</div>
                                        <div><span style={{ fontWeight: 700 }}>{t('quiz_status')}</span>{get(requirementExam, 'isOpen') ? <span style={{ color: '#44bd32', fontWeight: 900 }}>{t('opening')}</span> : <span style={{ color: '#e84118', fontWeight: 900 }}>{t('closed')}</span>}</div>
                                        <div><span style={{ fontWeight: 700 }}>{t('quiz_grade_method')}</span>{t('quiz_highest_grade')}</div>
                                    </div>
                                    {!this.state.isTeacherPrivilege && (<div>
                                        {(get(requirementExam, 'attemptAvailable') > 0 && get(requirementExam, 'isAttempt') == true) && <Button type="primary" href={`/exams/${this.props.idExam}?idSubject=${this.props.idSubject}&idTimeline=${this.props.idTimeline}`} style={{ marginTop: 25 }}>{t('take_quiz')}</Button>}
                                        {(get(requirementExam, 'attemptAvailable') == 0) && <div style={{ color: '#ff4000', fontStyle: 'italic', fontWeight: 900 }}>{t('quiz_join_run_out')}</div>}
                                        {(!get(requirementExam, 'isOpen')) && (get(requirementExam, 'isRemain')) && <div style={{ color: '#ff4000', fontStyle: 'italic', fontWeight: 900 }}>{t('quiz_not_time')}</div>}
                                    </div>)}
                                </div>

                                <div style={{
                                    textAlign: 'center',
                                    padding: '45px',
                                    marginBottom: "25px",
                                    border: "2px solid #c4c4c4",
                                    borderRadius: "20px"

                                }}>
                                    <Table pagination={false} columns={columns} dataSource={this.state.submissions} rowKey='key' scroll={{ y: 240 }} />
                                </div>
                            </div>
                        </div>
                    </Row>

                </div>
            </>)
    }
}

export default withTranslation('translations')(Quiz);
