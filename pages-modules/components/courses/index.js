import React from 'react'

// import images
import onlineCourse from '../../../assets/images/courses/onlineCourse.png'
import courseEmpty from '../../../assets/images/courses/courseEmpty.png'
import deadlineCalcular from '../../../assets/images/courses/deadlineCalcular.png'
import fastTime from '../../../assets/images/courses/fastTime.png'
import deadline from '../../../assets/images/courses/deadline.png'

import Link from 'next/link'
import { Layout, Row, Col, Tabs } from 'antd'
import { CheckCircleTwoTone, AlertOutlined } from '@ant-design/icons'
import styles from './styles.scss'
import './overwrite.css'
import { get, isEmpty, split, includes, omit } from 'lodash';
import { withTranslation } from 'react-i18next'


const { TabPane } = Tabs;
class Courses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            deadlines: [],
            dueTo: []
        }
    }

    componentDidMount() {
        this.setState({
            courses: this.props.listCourses,
            deadlines: this.props.listDeadline,
            dueTo: this.props.listDueAssginment
        })
    }

    generateColor = () => {
        return '#' + Math.random().toString(16).substr(-6);
    }

    render() {
        const { listCourses, listDeadline, t } = this.props;

        return <>
            <Row className={styles.background} style={{ justifyContent: 'center' }}>
                <Col span={12}
                    style={{
                        margin: '10px',
                        background: '#fff',
                        borderRadius: '10px',
                        minHeight: '200px'
                    }}>
                    <div>
                        <div style={{
                            textAlign: 'center',
                            padding: '10px 0'
                        }}>
                            <i>
                                <img src={onlineCourse} />
                            </i>
                            <span style={{ padding: '25px', fontSize: '2em' }}>{t('nm_course')}</span>
                        </div>
                    </div>
                    <div className={styles.listCourses}>
                        {/* empty course */}
                        {/* <div style={{
                            textAlign: 'center',
                            padding: '45px'
                        }}>
                            <i>
                                <img src={courseEmpty} />
                            </i>
                            <div style={{color: '#c4c4c4', fontStyle: 'italic'}}>No course register</div>
                        </div> */}
                        {/* Courses */}
                        <Row style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {
                                this.state.courses.map(course => (
                                    <Link href={`/subject/${course._id}`} key={course._id}>
                                        <Col span={6} style={{
                                            margin: '15px',
                                            flexGrow: '1',
                                            cursor: 'pointer'
                                        }}>
                                            <div style={{ height: '250px', background: `${this.generateColor()}` }}>
                                            </div>
                                            <div style={{
                                                textAlign: "center",
                                                fontWeight: "600",
                                                marginTop: 10
                                            }}>{course.name}</div>
                                        </Col>
                                    </Link>
                                ))
                            }
                        </Row>
                    </div>
                </Col>
                <Col span={8}
                    style={{
                        margin: '10px',
                        background: '#fff',
                        borderRadius: '10px',
                        minHeight: '200px'
                    }}>
                    <div>
                        <div style={{
                            textAlign: 'center',
                            padding: '10px 0'
                        }}>
                            <i>
                                <img src={deadline} />
                            </i>
                            <span style={{ padding: '25px', fontSize: '2em' }}>{t('upcm_dl')}</span>
                        </div>
                    </div>
                    <div>
                        {/* Empty */}
                        {/* <div style={{
                            textAlign: 'center',
                            padding: '45px'
                        }}>
                            <i>
                                <img src={deadlineCalcular} />
                            </i>
                            <div style={{ color: '#c4c4c4', fontStyle: 'italic' }}>No upcoming deadline</div>
                        </div> */}
                        {/* Deadline */}
                        <Row style={{ justifyContent: 'center' }}>
                            <Tabs defaultActiveKey="1" centered>
                                <TabPane tab={<span> <AlertOutlined twoToneColor="#ff0000" />{t('dl')}</span>} key="1">
                                    {this.state.deadlines.map(dl => (
                                        <Row key={dl._id} style={{marginBottom: 5}}>
                                            <Col span={10} style={{textAlign: "center"}}><i>
                                                <img src={fastTime} />
                                            </i></Col>
                                            <Col span={14} style={{paddingLeft: 30}}>
                                                <div>{dl.name}</div>
                                                <div>
                                                    <span>Due to: </span>{dl.expireTime}</div>
                                                <div>Time remaining: 2 hours</div>
                                            </Col>
                                        </Row>
                                    ))}
                                </TabPane>
                                <TabPane tab={
                                    <span><CheckCircleTwoTone twoToneColor="#52c41a" />
                                        {t('complt')}
                                    </span>} key="2">
                                    <div>
                                    {this.state.dueTo.map(dt => (
                                        <Row key={dt._id} style={{marginBottom: 5}}>
                                            <Col span={10} style={{textAlign: "center"}}><i>
                                                <img src={fastTime} />
                                            </i></Col>
                                            <Col span={14} style={{paddingLeft: 30}}>
                                                <div>{dt.name}</div>
                                                <div>
                                                    <span>Due to: </span>{dt.expireTime}</div>
                                                <div>Time remaining: 2 hours</div>
                                            </Col>
                                        </Row>
                                    ))}
                                    </div>
                                </TabPane>
                            </Tabs>
                        </Row>
                    </div>
                </Col>
            </Row>
        </>
    }
}

export default withTranslation('translations')(Courses);
