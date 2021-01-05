import React from 'react'
import deadlineCalcular from '../../../assets/images/courses/deadlineCalcular.png'
import fastTime from '../../../assets/images/courses/fastTime.png'
import { AlertOutlined, CheckCircleTwoTone, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { withTranslation } from 'react-i18next'
import { Row, Col, Tabs, Input, Button, Upload, message } from 'antd'
const { TabPane } = Tabs


class Deadline extends React.Component {

    transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    render() {
        const {deadlines, t, dueTo} = this.props
        return (
            <Row style={{ justifyContent: 'center', padding: "5px 0" }}>
                <Tabs defaultActiveKey="1" centered>
                    <TabPane tab={<span> <AlertOutlined twoToneColor="#ff0000" />{t('dl')}</span>} key="1">
                        <div style={{
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            {deadlines.length > 0 ? deadlines.map(dl => (
                                <Row key={dl._id} style={{
                                    marginBottom: 5, border: "2px solid #cacaca",
                                    padding: "10px 0"
                                }}>
                                    <Col span={10} style={{ textAlign: "center", alignSelf: "center" }}><i>
                                        <img src={fastTime} width="36px" />
                                    </i></Col>
                                    <Col span={10} >
                                        <div>{dl.name}</div>
                                        <div>
                                            <span style={{ fontWeight: 600 }}>Due to: </span>{this.transTime(get(dl, 'expireTime'))}
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 600 }}>Time remaining:</span> {moment.utc(get(dl, 'expireTime')).fromNow()}
                                        </div>
                                    </Col>
                                </Row>
                            )) : <Row>
                                    <img src={deadlineCalcular} />
                                    <div style={{ width: "100%", color: '#cacaca', textAlign: 'center' }}>No upcoming deadline</div>
                                </Row>}
                        </div>
                    </TabPane>
                    <TabPane tab={
                        <span><CheckCircleTwoTone twoToneColor="#52c41a" />
                            {t('complt')}
                        </span>} key="2">
                        <div style={{
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            {dueTo.map(dt => (
                                <Row key={dt._id} style={{
                                    marginBottom: 5, color: "#2ecc71", border: "2px solid #cacaca",
                                    padding: "10px 0"
                                }}>
                                    <Col span={10} style={{ textAlign: "center", alignSelf: "center" }}><i>
                                        <img src={fastTime} width="36px" />
                                    </i></Col>
                                    <Col span={10} >
                                        <div>{dt.name}</div>
                                        <div>
                                            <span style={{ fontWeight: 600 }}>Due to: </span>{this.transTime(get(dt, 'expireTime'))}
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 600 }}>Time remaining:</span> {moment.utc(get(dt, 'expireTime')).fromNow()}
                                        </div>
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    </TabPane>
                </Tabs>
            </Row>
        )
    }
}

export default withTranslation('translations')(Deadline)