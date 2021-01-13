import React from 'react'
import deadlineCalcular from '../../../assets/images/courses/deadlineCalcular.png'
import fastTime from '../../../assets/images/courses/fastTime.png'
import { AlertOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import { withTranslation } from 'react-i18next'
import { Row, Col, Tabs, Badge } from 'antd'
const { TabPane } = Tabs
import { get } from 'lodash';
import moment from 'moment';
import './overwrite.css'

const transTime = (time) => {
    return moment(time).format('MMM DD h:mm A')
}

const getType = (type) => {
    switch (type) {
        case 'exam':
            return 'Exam';
        case 'assignment':
            return 'Assignment';
        case 'survey':
            return 'Survey';
        default:
            return 'Exam';
    }
}

const checkUrgentDay = (end) => {
    const startDate = moment.utc();
    const endDate = moment.utc(end);

    const duration = moment.duration(endDate.diff(startDate));

    if (duration.days() < 2) {
        return true
    }
    return false
}

const DeadlineItem = ({ t, deadline, flag }) => (
    <Badge.Ribbon placement="left" text={flag ? t('completed') : checkUrgentDay(get(deadline, 'expireTime')) ? t('urgent_upcoming_deadline') : t('not_done')} color={flag ? '#4cd137' : checkUrgentDay(get(deadline, 'expireTime')) ? '#e84118' : '#00a8ff'}
    >
        <Row key={deadline._id}
            style={{
                marginBottom: 5,
                border: "2px solid #cacaca",
                padding: "10px 0"
            }}
        >
            <Col span={10} style={{ textAlign: "center", alignSelf: "center" }}>
                <i>
                    <img src={fastTime} width="36px" />
                </i>
            </Col >
            <Col span={10} >
                <div> [{getType(deadline.type)}] {deadline.name} </div>
                <div>
                    <span style={
                        { fontWeight: 600 }} > {t('dueTo')} </span>{transTime(get(deadline, 'expireTime'))} </div>
                <div>
                    <span style={{ fontWeight: 600 }} > {t('time_remain')} </span> {moment.utc(get(deadline, 'expireTime')).fromNow()} </div>
                {deadline.subject && (<a href={`/subject/${deadline.subject._id}`} ><span > {deadline.subject.name} </span></a>)}
            </Col>

        </Row>
    </Badge.Ribbon>
);

class Deadline extends React.Component {
    render() {
        const { deadlines, t, dueTo } = this.props
        return (<Row style={
            { justifyContent: 'center', padding: "5px 0" }} >
            <Tabs defaultActiveKey="1" centered >
                <TabPane tab={<span > <AlertOutlined twoToneColor="#ff0000" /> {t('dl')} </span>} key="1">
                    <div style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }} >
                        {deadlines.length > 0
                            ? deadlines.map(dl => (<DeadlineItem t={t} deadline={dl} flag={false} />))
                            : <Row >
                                <img src={deadlineCalcular} />
                                < div style={{ width: "100%", color: '#cacaca', textAlign: 'center' }} >{t('no_upcoming_deadline')} </div>
                            </Row>
                        }
                    </div>
                </TabPane>
                <TabPane tab={<span > <CheckCircleTwoTone twoToneColor="#52c41a" /> {t('complt')} </span>} key="2">
                    <div style={
                        {
                            maxHeight: '400px',
                            overflowY: 'auto',
                            overflowX: 'hidden'
                        }}
                    >
                        {dueTo.map(dt => (<DeadlineItem t={t} deadline={dt} flag={true} />))}
                    </div>
                </TabPane>
            </Tabs>
        </Row>
        )
    }
}

export default withTranslation('translations')(Deadline)