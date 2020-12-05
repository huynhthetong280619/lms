import React from 'react'
import { Row, Col, Button, Table } from 'antd'

import quizTime from '../../../assets/images/contents/quiz-time.png'
import {get} from 'lodash'
import moment from 'moment'

class Quiz extends React.Component {

    transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    render() {

        const dataSource = [
            {
                key: '1',
                name: 'Mike',
                age: 32,
                address: '10 Downing Street',
            },
            {
                key: '2',
                name: 'John',
                age: 42,
                address: '10 Downing Street',
            },
        ];

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
        ];

        const {requirementExam} = this.props;

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
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</Col>
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
                    <div>{get(requirementExam, 'name')}</div>
                            <div>
                    <div><span>Attemp allowed: </span> {get(get(requirementExam, 'setting'), 'attemptCount')}</div>
                    <div><span>Open: </span> {this.transTime(get(requirementExam, 'startTime'))}</div>
                                <div><span>Closed: </span> {this.transTime(get(requirementExam, 'expireTime'))}</div>
                                <div>Status: Opening</div>
                                <div>Grading method: Highest grade</div>
                            </div>
                            <div>
                                <Button type="primary" href='/exams' style={{borderRadius: 20}}>Take quiz</Button>
                            </div>
                        </div>

                        <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            marginBottom: "25px",
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px"

                        }}>
                            <Table dataSource={dataSource} columns={columns} />
                        </div>
                    </div>
                </div>
            </Row>

        </>)
    }
}

export default Quiz
