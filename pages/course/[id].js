import React from 'react'
import { useRouter } from 'next/router'
import IndexLayout from '../../pages-modules/layouts/layout'
import { Row, Col } from 'antd'

import styles from './styles.scss'
import './overwrite.css'

const CourseDetail = () => {
    const router = useRouter()

    return <IndexLayout>
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
                            </i>
                            <span style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</span>
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
                        
                    </div>
                </Col>
                <Col span={8}
                    style={{
                        margin: '10px',
                        background: '#fff',
                        borderRadius: '10px',
                        minHeight: '200px'
                    }}>
                </Col>
            </Row>
    </IndexLayout>
}

export default CourseDetail
