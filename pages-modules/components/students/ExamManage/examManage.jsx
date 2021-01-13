import React, { useState } from 'react'
import { Row, Table, Select } from 'antd'

import { withTranslation } from 'react-i18next'
import { get } from 'lodash'
import { CSVLink } from "react-csv";
import excel from '../../../../assets/images/contents/excel.png';

const ExamManage = ({ t, lstSubmissionCore }) => {


    const [test, setTest] = useState(lstSubmissionCore[0])

    const handleSelectTest = (e) => {
        console.log('idTest', e);
        const result = lstSubmissionCore.find(item => get(item, '_id') === e);
        setTest(result);
    }

    const columns = [
        {
            title: t('code_student'),
            dataIndex: "student",
            key: "student",
            render: data => <span>{data.code}</span>
        },
        {
            title: t('grade'),
            dataIndex: "grade",
            key: '',
            render: (text, data) => data.grade !== null ? data.grade : (
                data.status === 'notSubmit' ? <span style={{ color: '#ff4000', fontStyle: 'italic' }}>Chưa nộp bài</span>
                    : <span style={{ color: '#ff4000', fontStyle: 'italic' }}>Chưa chấm điểm</span>

            )
        }
    ]

    const headersCSV = [
        { label: t('code_student'), key: 'student.code' },
        { label: t('surName'), key: 'student.surName' },
        { label: t('firstName'), key: 'student.firstName' },
        { label: t('grade'), key: 'grade' }
    ]

    return (<>
        <Row style={{ marginBottom: 20 }}>
            <Select defaultValue={test._id} style={{ width: 200 }} onChange={e => handleSelectTest(e)}>
                {
                    (lstSubmissionCore || []).map(q => (<Option value={q._id} key={q._id} style={{ width: '100%' }}>{q.name}</Option>))
                }
            </Select>
        </Row>
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
                        filename={test.name + ".csv"}
                        data={test.submissions}
                        headers={headersCSV}
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
            </div>

        </Row>
        <Row style={{ border: '2px solid #cacaca' }}>
            <Table pagination={false} columns={columns} dataSource={test.submissions} style={{ width: '100%' }} />
        </Row>
    </>)
}

export default withTranslation('translations')(ExamManage);