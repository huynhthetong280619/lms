import React, { useState, useEffect } from 'react'
import { Row, Table, Space, Col, Tabs, Button, Select, InputNumber } from 'antd'

import { withTranslation } from 'react-i18next'
import { CSVLink } from "react-csv";
import excel from '../../../../assets/images/contents/excel.png'
import restClient from '../../../../assets/common/core/restClient'
import { notifyError, notifySuccess } from '../../../../assets/common/core/notify'

const TranscriptManage = ({ t, lstClassScore,idSubject,token }) => {

    const [isLoading, setLoading] = useState(false);

    const [transcript, setTranscript] = useState(lstClassScore)

    const setRatio = (obj, ratio) => {
        let target = ratios.find(value => value._id === obj._id);
        target.ratio = ratio / 100;
    }


    const putTotalScore = async () => {
        //console.log('data', ratios)
        setLoading(true);
        await restClient.asyncPut(`/subject/${idSubject}/ratio`, ratios, token)
            .then(res => {
                setLoading(false);
                if (!res.hasError) {
                    setTranscript(res.data);
                    notifySuccess('Thành công', 'Thay đổi hệ số thành công!');
                } else {
                    notifyError('Thất bại!', res.data.message);
                }
            })
    }

    let ratios = []

    useEffect(() => {
        ratios = []
        Object.keys(transcript.fields).map((c, i) => {
            if (i > 2 && i < Object.keys(transcript.fields).length - 1) {
                ratios.push(transcript.ratio[c]);
            }
        })
    }, [transcript])

    let columnsClassScore = []
    if (transcript) {

        columnsClassScore = Object.keys(transcript.fields).map((c, i) => {
            // if (i > 2 && i < Object.keys(transcript.fields).length - 1) {
            //     ratios.push(transcript.ratio[c]);
            // }
            return {
                title: i > 2 && i < Object.keys(transcript.fields).length - 1 ? (<div><span>Hệ số <InputNumber
                    defaultValue={transcript.ratio[c].ratio * 100}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    onChange={(e) => setRatio(transcript.ratio[c], e)}
                    parser={value => value.replace('%', '')}
                /></span> <div>{transcript.fields[c]}</div></div>) : transcript.fields[c],
                dataIndex: c,
                key: c,
                width: 200,
                render: data => data !== null ? data : <span style={{ fontStyle: 'italic', color: '#ff4000' }}>Chưa nộp bài</span>
            }
        })
    }


    const headersClassScoreCSV = Object.keys(transcript.fields).map((c) => {
        return {
            label: transcript.fields[c],
            key: c
        }
    })

    return (<>
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
                        filename={"Bảng điểm lớp học.csv"}
                        data={transcript.data}
                        headers={headersClassScoreCSV}
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
            <Button
                style={{
                    margin: '5px',
                    background: '#ff4000',
                    border: 0,
                    color: '#fff',
                    borderRadius: '20px'
                }}
                loading={isLoading}
                onClick={() => putTotalScore()}>{t('cfrm_table_points')}</Button>
            <Table pagination={false} columns={columnsClassScore} dataSource={transcript.data} style={{ width: '100%' }} scroll={{ y: 240, x: 700 }} />
        </Row>

    </>)
}


export default withTranslation('translations')(TranscriptManage);