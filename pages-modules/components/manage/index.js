import { Row, Col, Table, Input, Popconfirm, Button, Form, notification } from 'antd';
import React, { useState } from 'react'
import { get } from 'lodash'
import { withTranslation } from 'react-i18next';
import downloadFile from '../../../assets/common/core/downloadFile.js';
import restClient from '../../../assets/common/core/restClient.js';
import 'antd/dist/antd.css';

const Manage = ({ t, assignment, idAssign, idSubject, idTimeline, token }) => {
    const [form] = Form.useForm();

    const [state, setState] = useState({
        assignment: assignment,
        lstSubmission: assignment.submission,
        editingKey: null,
        isConfirm: false,
    });
    //console.log(assignment);

    const isEditingRow = (record) => {
        return state.editingKey === record._id;
    }
    const editRow = (record) => {
        setState({ ...state, editingKey: record._id });
    }

    const enterGradeVerify = async (idSubmission) => {
        setState({ ...state, isConfirm: true });
        const row = await form.validateFields().then(value => value).catch(error => {
            return null;
        });
        if (!row) { setState({ ...state, isConfirm: false }); return; }
        const data = {
            idSubject: idSubject,
            idTimeline: idTimeline,
            grade: row.grade
        }

        await restClient.asyncPost(`/assignment/${idAssign}/grade/${idSubmission}`, data, token)
            .then(res => {
                setState({ ...state, isConfirm: false });
                console.log('enterGradeVerify', res)
                if (!res.hasError) {
                    notification.success({
                        message: 'Thành công!',
                        description: res.data.message
                    });
                    let newData = state.lstSubmission;
                    const rowIndex = newData.findIndex(value => value._id === idSubmission);
                    console.log('rowIndex', rowIndex);
                    newData[rowIndex].feedBack = res.data.feedBack;
                    setState({ ...state, editingKey: null, lstSubmission: newData });
                } else {
                    notification.error({
                        message: 'Thất bại!',
                        description: res.data.message
                    })
                }
            })
    }

    const columns = [
        {
            title: t('code_student'),
            dataIndex: ['student', 'code'],
            key: 'code',
            sorter: (a, b) => parseInt(b.student.code) - parseInt(a.student.code),
            sortDirections: ['descend'],
            sortOrder: 'descend',
        },
        { title: t('fullName'), dataIndex: 'student', key: 'student', render: data => <span>{get(data, 'surName') + " " + get(data, 'firstName')}</span> },
        {
            title: t('file_submission'), dataIndex: 'file', key: 'file',
            render: data => <a onClick={() => downloadFile(data)}>{data.name}.{data.type}</a>
        },
        {
            title: t('grade'),
            dataIndex: '',
            render: (data) => {
                if (isEditingRow(data)) {
                    return (
                        <Form.Item
                            name="grade"
                            rules={[
                                {
                                    required: true,
                                    message: t('req_grade')
                                },
                                ({ }) => ({
                                    validator(rule, value) {
                                        if (!value) {
                                            return Promise.resolve();
                                        } else if (value < 0) {
                                            return Promise.reject(t('req_grade_min'));
                                        } else if (value > 10) {
                                            return Promise.reject(t('req_grade_max'));
                                        }
                                    },
                                }),
                            ]}>
                            <Input type="number" min='0' max='10' defaultValue={data.feedBack ? data.feedBack.grade : null} />
                        </Form.Item>
                    )
                } else {
                    return <span>{data.feedBack ? data.feedBack.grade : t('not_grade')}</span>
                }
            }
        },
        {
            title: t('action'),
            dataIndex: '',
            render: (data) => {
                if (isEditingRow(data)) {
                    return (
                        <span>
                            <Button
                                onClick={() => enterGradeVerify(data._id)}
                                style={{
                                    marginRight: 8,
                                }}
                                loading={state.isConfirm}
                                type='primary'>{t('submit')}</Button>
                            <Button
                                onClick={() => { setState({ ...state, editingKey: null }) }}
                            >{t('cancel')}</Button>
                        </span>
                    )

                } else {
                    return (
                        <Button
                            onClick={() => editRow(data)}
                        >
                            {t('edit')}
                        </Button>
                    )
                }
            },
        }
    ];


    return (
        <Row id="lms-ws-exam-component" style={{
            width: '85%',
            textAlign: 'center',
            background: '#fff',
            minHeight: '20px',
            justifyContent: 'center',
            margin: '0 auto'
        }}>

            <Row style={{ width: '100%' }}>
                <Col span={24} style={{ padding: '25px', fontSize: '2em' }}>{get(state.assignment, 'name')}</Col>
            </Row>
            <Row style={{ width: '100%', padding: 10 }}>
                <div style={{ width: '100%', border: '1px solid #cacaca' }}>
                    <Form
                        form={form}
                    >
                        <Table
                            columns={columns}
                            scroll={{ y: 240 }}
                            dataSource={state.lstSubmission}
                            rowKey={["student"], ["_id"]}
                            pagination={false}
                            bordered
                        />
                    </Form>
                </div>
            </Row>
        </Row>
    )
}

export default withTranslation('translations')(Manage);
