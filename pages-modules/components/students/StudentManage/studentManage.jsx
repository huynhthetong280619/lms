import React, { useState } from 'react'
import { Drawer, Row, Table, Space, Form, Input, Button } from 'antd'

import { withTranslation } from 'react-i18next'
import { CSVLink } from "react-csv";
import excel from '../../../../assets/images/contents/excel.png'
import restClient from '../../../../assets/common/core/restClient';
import { notifyError, notifySuccess } from '../../../../assets/common/core/notify.js';

const StudentManage = ({ t, lstStudents, idSubject, token }) => {

    const [list, setList] = useState(lstStudents);

    const [visibleDrawer, setVisible] = useState(false);


    const [form] = Form.useForm();

    const [isLoadingDelete, setLoadingDelete] = useState(false);
    const [idCurrentStudent, setIdStudent] = useState(null);

    const [isLoadingAdd, setLoadingAdd] = useState(false);

    const handleDeleteStudent = async (record) => {
        setLoadingDelete(true);
        setIdStudent(record._id)
        await restClient.asyncDelete(`/subject/${idSubject}/remove-student`, {
            idStudent: record.code
        }, token)
            .then(res => {
                setLoadingDelete(false);
                setIdStudent(null);
                //console.log('delete', res)
                if (!res.hasError) {
                    setList(res.data.students);
                } else {
                    notifyError('Thất bại!', res.data.message);
                }
            })
    }

    const onCloseDrawer = () => {
        setVisible(false);
        form.resetFields();
    }

    const showDrawer = () => {
        setVisible(true);
    }

    const addStudentToClass = async (codeStudent) => {
        setLoadingAdd(true);
        await restClient.asyncPost(`/subject/${idSubject}/add-student`,
            { idStudent: codeStudent }, token)
            .then(res => {
                setLoadingAdd(false);
                if (!res.hasError) {
                    notifySuccess('Thành công!', res.data.message);
                    setList(res.data.students);
                    onCloseDrawer();
                } else {
                    notifyError('Thất bại!', res.data.message);
                }
            })
    }


    const onFinish = (values) => {
        addStudentToClass(values.codeStudent);
    }

    const isFocusDelete = (idFocus) => {
        return idFocus === idCurrentStudent;
    }


    const columns = [
        {
            title: t('avatar'),
            dataIndex: 'urlAvatar',
            key: 'urlAvatar',
            render: (data) => <img src={data} width="102px" />
        },
        {
            title: t('code_student'),
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: t('email_address'),
            dataIndex: 'emailAddress',
            key: 'emailAddress'
        },
        {
            title: t('surName'),
            dataIndex: 'surName',
            key: 'surName',
        },
        {
            title: t('firstName'),
            dataIndex: 'firstName',
            key: 'firstName',
        },


        {
            title: t('action'),
            key: 'action',
            render: (text, record) => (
                <Button
                    type='primary'
                    danger
                    loading={isLoadingDelete && isFocusDelete(record._id)}
                    onClick={() => handleDeleteStudent(record)}
                >{t('delete')}</Button>
            ),
        },
    ];

    const headersCSVClass = [
        { label: t('code_student'), key: 'code' },
        { label: t('Email'), key: 'emailAddress' },
        { label: t('surName'), key: 'surName' },
        { label: t('firstName'), key: 'firstName' },
    ]
    return (
        <>
            <Drawer
                title={t('add_student')}
                placement="right"
                closable={false}
                onClose={() => onCloseDrawer()}
                width={440}
                visible={visibleDrawer}
            >
                <Form onFinish={onFinish}
                    form={form}>
                    <Form.Item label={t('code_student')} name="codeStudent" rules={[
                        {
                            required: true,
                            message: t('req_code_student'),
                        },
                    ]}>
                        <Input type="text" placeholder="Student code..." style={{
                            marginBottom: 10
                        }} />
                    </Form.Item>
                    <Form.Item>
                        <Button loading={isLoadingAdd} type="primary" htmlType="submit" > {t('add_student')} </Button>
                    </Form.Item>
                </Form>

            </Drawer>
            <div style={{ width: '90%' }}>
                <Row style={{ marginBottom: 10 }}>
                    <div style={{ width: "100%", textAlign: 'left' }}>
                        <div style={{
                            display: 'inline',
                            padding: '5px 10px',
                            border: '1px solid #cacaca',
                            borderRadius: '20px',
                        }}>
                            <span>{t('export_excel')}</span>
                            <CSVLink
                                filename={"Danh Sách lớp.csv"}
                                data={list}
                                headers={headersCSVClass}
                                target="_blank"
                                style={{ color: "inherit", marginLeft: 5 }}
                            >
                                <span
                                    id="Tooltip_history_csv"
                                    className="left5"
                                    placement="top"
                                    style={{ padding: 0, marginTop: 3 }}
                                >
                                    <img src={excel} width={20} />
                                </span>
                            </CSVLink>
                        </div>
                        <Button type="primary" style={{ marginLeft: 10 }} onClick={() => showDrawer()}>{t('add_student')}</Button>
                    </div>

                </Row>
                <Row style={{ width: '100%' }}>
                    <Table columns={columns} dataSource={list} style={{ width: '100%' }} pagination={false} />
                </Row>
            </div>
        </>
    )
}

export default withTranslation('translations')(StudentManage);