import React from 'react'
import deadlineCalcular from '../../../assets/images/courses/deadlineCalcular.png'
import fastTime from '../../../assets/images/courses/fastTime.png'
import { AlertOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import { withTranslation } from 'react-i18next'
import { Row, Col, Tabs } from 'antd'
const { TabPane } = Tabs
import { get } from 'lodash';
import moment from 'moment';


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

const DeadlineItem = ({ deadline }) => (
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
                    { fontWeight: 600 }} > Due to: </span>{transTime(get(deadline, 'expireTime'))} </div>
            <div>
                <span style={{ fontWeight: 600 }} > Time remaining: </span> {moment.utc(get(deadline, 'expireTime')).fromNow()} </div>
            {deadline.subject && (<a href={`/subject/${deadline.subject._id}`} ><span > {deadline.subject.name} </span></a>)}
        </Col>

    </Row>
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
                            ? deadlines.map(dl => (<DeadlineItem deadline={dl} />))
                            : <Row >
                                <img src={deadlineCalcular} />
                                < div style={{ width: "100%", color: '#cacaca', textAlign: 'center' }} > No upcoming deadline </div>
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
                        {dueTo.map(dt => (<DeadlineItem deadline={dt} />))}
                    </div>
                </TabPane>
            </Tabs>
        </Row>
        )
    }
}

export default withTranslation('translations')(Deadline)