import React from 'react'
import { Row, Col, Tabs } from 'antd'

import { withTranslation } from 'react-i18next'
const { TabPane } = Tabs;
import './overwrite.css'
import StudentManage from './StudentManage/studentManage.jsx'
import ExamManage from './ExamManage/examManage'
import TranscriptManage from './TranscriptManage/transcriptManage.jsx'


class Student extends React.Component {

    state = {
        lstSubmissionCore: [],
        lstClassScore: null,
    }


    componentDidMount() {
        this.setState({
            lstSubmissionCore: this.props.lstSubmissionCore,
            lstClassScore: this.props.lstClassScore
        })
    }

    render() {

        const { t } = this.props

        return (
            <div class="lms-ws-student-page">
                <Row style={{
                    width: '85%',
                    textAlign: 'center',
                    background: '#fff',
                    minHeight: '20px',
                    justifyContent: 'center',
                    margin: '0 auto'
                }}>
                    <Row style={{ width: '100%' }}>
                        <Col span={24} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject.toUpperCase()}</Col>
                    </Row>

                    <Row style={{ width: '90%', marginBottom: 30 }}>
                        <Tabs defaultActiveKey="1" centered style={{ width: "100%" }}>
                            <TabPane tab={t('class')} key="1">
                                <StudentManage lstStudents={this.props.listStudent} idSubject={this.props.idSubject} token={this.props.token} />
                            </TabPane>
                            <TabPane tab={t('test')} key="2">
                                <ExamManage lstSubmissionCore={this.state.lstSubmissionCore} />
                            </TabPane>
                            <TabPane tab={t('transcript')} key="3">
                                <TranscriptManage lstClassScore={this.state.lstClassScore} idSubject={this.props.idSubject} token={this.props.token} />
                            </TabPane>
                        </Tabs>
                    </Row>

                </Row>

            </div>
        )
    }
}
export default withTranslation('translations')(Student)
