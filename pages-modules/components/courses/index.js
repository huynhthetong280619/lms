import React from 'react'

// import images
import onlineCourse from '../../../assets/images/courses/onlineCourse.png'
import deadline from '../../../assets/images/courses/deadline.png'
import courseEmpty from '../../../assets/images/courses/courseEmpty.png'

import { Row, Col, Card } from 'antd'
const { Meta } = Card;
import styles from './styles.scss'
import './overwrite.css'
import { withTranslation } from 'react-i18next'
import Deadline from '../../components/deadlines'
import HeadPage from '../headPage/headPage.jsx';

class Courses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            deadlines: [],
            dueTo: [],
            isTeacher: false
        }
    }

    componentDidMount() {
        //console.log('isLoadingGlobal, setIsLoadingGlobal', this.props.isLoadingGlobal, this.props.setIsLoadingGlobal)
        this.setState({
            courses: this.props.listCourses || [],
            deadlines: this.props.listDeadline || [],
            dueTo: this.props.listDueAssignment || []
        })

        const usrJson = JSON.stringify(localStorage.getItem('user'))
        const usrObj = JSON.parse(JSON.parse(usrJson));
        //console.log('idPrivilege', usrObj.idPrivilege)


        if (usrObj?.idPrivilege == 'student') {
            this.setState({
                isTeacher: false
            })
        }

        if (usrObj?.idPrivilege == 'teacher') {
            this.setState({
                isTeacher: true
            })
        }

    }

    generateColor = () => {
        return '#' + Math.random().toString(16).substr(-6);
    }
    render() {
        const { t } = this.props
        //console.log(this.state.isTeacher)
        return <>
            <HeadPage title={t('nm_course').toUpperCase()}/>
            <Row className={styles.background} style={{ justifyContent: 'center' }}>
                <Col span={12}
                    style={{
                        margin: '10px',
                        background: '#fff',
                        minHeight: '200px',
                        paddingBottom: '30px'
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

                        {/* Courses */}
                        <Row style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {
                                this.state.courses.length > 0 ? this.state.courses.map(course => (
                                    <a className='ant-col ant-col-6'
                                        href={`/subject/${course._id}`}
                                        key={course._id}
                                        style={{
                                            margin: '10px',
                                            flexGrow: '1',
                                            cursor: 'pointer'
                                        }}>
                                        <Card
                                            hoverable
                                            cover={
                                                <div style={{ height: '150px', background: `${this.generateColor()}` }}>
                                                </div>
                                            }
                                        >
                                            <Meta title={course.name} style={{ textAlign: 'center' }} />
                                        </Card>
                                    </a>
                                )) :
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '45px'
                                    }}>
                                        <i>
                                            <img src={courseEmpty} />
                                        </i>
                                        <div style={{ color: '#c4c4c4', fontStyle: 'italic' }}>No course register</div>
                                    </div>
                            }
                        </Row>
                    </div>
                </Col>

                {
                    this.state.isTeacher ?

                        <Col span={8}
                            style={{
                                margin: '10px',
                                background: '#fff',
                                minHeight: '200px',
                                maxHeight: '768px'
                            }}>
                            <div>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '10px 0'
                                }}>
                                    <i>
                                        <img src={deadline} />
                                    </i>
                                    <span style={{ padding: '25px', fontSize: '2em' }}>{t('mn_subject')}</span>
                                </div>
                            </div>
                        </Col>
                        :
                        (
                            <Col span={8}
                                style={{
                                    margin: '10px',
                                    background: '#fff',
                                    minHeight: '200px',
                                    maxHeight: '553px'
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
                                    <Deadline deadlines={this.state.deadlines} dueTo={this.state.dueTo} />
                                </div>
                            </Col>
                        )
                }

            </Row>
        </>
    }
}

export default withTranslation('translations')(Courses);
