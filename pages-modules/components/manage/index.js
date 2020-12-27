import { Row, Col, Table, Input, Popconfirm } from 'antd';
import React from 'react'
import { get } from 'lodash'
import restClient from '../../../assets/common/core/restClient';

class Manage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lstSubmission: [],
            grade: 0
        }
    }

    componentDidMount() {
        this.setState({
            lstSubmission: get(this.props.lstSubmission, 'submission')
        })
    }

    enterGradeVerif = async (idSubmission) => {
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: this.props.idTimeline,
            grade: this.state.grade
        }

        await restClient.asyncPost(`/assignment/${this.props.idAssign}/grade/${idSubmission}`, data, this.props.token)
            .then(res => {
                console.log('enterGradeVerif', res)
            })
    }

    downloadFile = async (idTimeline, idFile) => {
        await restClient.asyncDownLoad(`/timeline/${idTimeline}/download/${idFile}?idSubject=${this.props.idSubject}`)
            .then(res => {
                console.log(res)
            })
    }

    render() {

        console.log(this.props.lstSubmission)

        const columns = [
            { title: 'Họ và tên', dataIndex: 'student', key: 'student', render: data => <span>{get(data, 'surName') + " " + get(data, 'firstName')}</span> },
            {
                title: 'File submission', dataIndex: 'file', key: 'file',
                render: data => <a onClick={() => this.downloadFile(this.props.idTimeline, data._id)}>{data.name}</a>
            },
            {
                title: 'Grade', dataIndex: 'feedBack', key: 'feedBack',
                render: data => <Input type="text" value={get(data, 'grade') || this.state.grade} onChange={(e) => this.setState({ grade: e.target.value })} />
            },
            {
                title: 'Action',
                dataIndex: '',
                key: 'x',
                render: (data) => (
                    <Popconfirm
                        title="Bạn có chắc chắn xác nhận hay không?"
                        onConfirm={() => this.enterGradeVerif(data._id)}
                        onCancel={() => console.log('Cancel')}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a href='#'>Confirm</a>,
                    </Popconfirm>
                )
            },
        ];


        return (
            <Row id="lms-ws-exam-component" style={{
                width: '80%',
                textAlign: 'center',
                background: '#fff',
                borderRadius: '15px',
                minHeight: '20px'
            }}>

                <Row style={{ width: '100%' }}>
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>{get(this.props.lstSubmission, 'name')}</Col>
                </Row>
                <Row style={{width: '100%', padding: 10}}>
                    <div style={{width: '100%', border: '1px solid #cacaca'}}>
                        <Table
                            columns={columns}
                            pagination={{ pageSize: 50 }} scroll={{ y: 240 }}
                            expandable={{
                                expandedRowRender: record => <p style={{ margin: 15 }}>{record.description}</p>,
                                rowExpandable: record => record.name !== 'Not Expandable',
                            }}
                            dataSource={this.state.lstSubmission}
                            rowKey="student"
                            pagination={false}
                        />
                    </div>
                </Row>
            </Row>
        )
    }
}


export default Manage;
