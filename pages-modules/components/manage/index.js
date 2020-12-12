import { Row, Col, Table, Input } from 'antd';
import React from 'react'
import {get} from 'lodash'

class Manage extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            lstSubmission: []
        }
    }

    componentDidMount(){
        this.setState({
            lstSubmission: get(this.props.lstSubmission,'submission')
        })
    }

    render() {

        console.log(get(this.props.lstSubmission))

        const columns = [
            { title: 'Họ và tên', dataIndex: 'student', key: 'student', render: data => <span>{get(data, 'surName') + " "+ get(data,'firstName')}</span> },
            {
                title: 'File submission', dataIndex: 'file', key: 'file',
                render: data => <a>{data.name}</a>
            },
            {
                title: 'Grade', dataIndex: 'grade', key: 'grade',
                render: data => <Input type="text" value={data} />
            },
            {
                title: 'Action',
                dataIndex: '',
                key: 'x',
                render: () => <a>Confirm</a>,
            },
        ];

        const data = [
            {
                key: 1,
                name: 'Huỳnh Thế Tông',
                file: '17110384.rar',
                grade: 10,
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                key: 2,
                name: 'Nguyễn Anh Quân',
                file: '17110354.rar',
                grade: 10,
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                key: 3,
                name: 'Huỳnh Thế Tông',
                file: '17110384.rar',
                grade: 10,
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                key: 4,
                name: 'Nguyễn Anh Quân',
                file: '17110354.rar',
                grade: 10,
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                key: 5,
                name: 'Huỳnh Thế Tông',
                file: '17110384.rar',
                grade: 10,
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                key: 6,
                name: 'Nguyễn Anh Quân',
                file: '17110354.rar',
                grade: 10,
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                key: 7,
                name: 'Huỳnh Thế Tông',
                file: '17110384.rar',
                grade: 10,
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                key: 8,
                name: 'Nguyễn Anh Quân',
                file: '17110354.rar',
                grade: 10,
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            }
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
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</Col>
                </Row>
                <Row>
                    <Table
                        columns={columns}
                        pagination={{ pageSize: 50 }} scroll={{ y: 240 }}
                        expandable={{
                            expandedRowRender: record => <p style={{ margin: 15 }}>{record.description}</p>,
                            rowExpandable: record => record.name !== 'Not Expandable',
                        }}
                        dataSource={this.state.lstSubmission}
                    />
                </Row>
            </Row>
        )
    }
}


export default Manage;
