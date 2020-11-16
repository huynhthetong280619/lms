import React from 'react'
import { Layout, Row, Col, Tabs } from 'antd'
import { CheckCircleTwoTone, AlertOutlined } from '@ant-design/icons'
import styles from './styles.scss'
import './overwrite.css'
import IndexLayout from '../../pages-modules/layouts/layout'


// import images
import onlineCourse from '../../assets/images/courses/onlineCourse.png'
import courseEmpty from '../../assets/images/courses/courseEmpty.png'
import deadlineCalcular from '../../assets/images/courses/deadlineCalcular.png'
import fastTime from '../../assets/images/courses/fastTime.png'
import deadline from '../../assets/images/courses/deadline.png'

const { TabPane } = Tabs;

const PageCourse = () => {
    const [courses, setCourse] = React.useState([{
        backgroundColor: 'red',
        title: 'English'
    },
    {
        backgroundColor: 'red',
        title: 'English'
    },
    {
        backgroundColor: 'red',
        title: 'English'
    },
    {
        backgroundColor: 'red',
        title: 'English'
    },
    {
        backgroundColor: 'red',
        title: 'English'
    },
    {
        backgroundColor: 'red',
        title: 'English'
    },
    {
        backgroundColor: 'red',
        title: 'English'
    },])

    return (
        <IndexLayout>
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
                            <span style={{ padding: '25px', fontSize: '2em' }}>COURSE</span>
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
                                courses.map(course => (
                                    <Col span={6} style={{
                                        margin: '15px',
                                        flexGrow: '1'
                                    }}>
                                        <div style={{ height: '250px', background: `${course.backgroundColor}` }}></div>
                                        <div>{course.title}</div>
                                    </Col>
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
                            <span style={{ padding: '25px', fontSize: '2em' }}>UPCOMING DEADLINE</span>
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
                        <Row style={{justifyContent: 'center'}}>
                        <Tabs defaultActiveKey="1" centered>
                            <TabPane tab={<span> <AlertOutlined twoToneColor="#ff0000"/>Deadline</span>} key="1">
                            Content of Tab Pane 1
                            </TabPane>
                            <TabPane tab={<span> <CheckCircleTwoTone twoToneColor="#52c41a" />
  
                    Complete</span>} key="2">
                            Content of Tab Pane 2
                            </TabPane>
                        </Tabs>
                        </Row>
                    </div>
                </Col>
            </Row>
        </IndexLayout>
    )
}

export default PageCourse
