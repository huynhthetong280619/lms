import { Col, Row, Carousel } from 'antd'
import {PlayCircleOutlined, RocketTwoTone } from '@ant-design/icons'
import React, { Component } from 'react'
import styles from './styles.scss'
import './overwrite.css'

// import images png
import ckm from '../../../assets/images/contents/ckm.png'
import clc from '../../../assets/images/contents/clc.png'
import cnhhtp from '../../../assets/images/contents/cnhhtp.png'
import cnmtt from '../../../assets/images/contents/cnmtt.png'
import ddt from '../../../assets/images/contents/ddt.png'
import khud from '../../../assets/images/contents/khud.png'
import kt from '../../../assets/images/contents/kt.png'
import maxresdefault from '../../../assets/images/contents/maxresdefault.png'
import nn from '../../../assets/images/contents/nn.png'
import xd from '../../../assets/images/contents/xd.png'


const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

class IndexContent extends Component {

    render() {
        return <>
            <Row className="lms_ws_content">
                <Col className={styles.carouselIntro} span={10}>
                    <div>
                        <Carousel>
                            <div>
                                <h3 style={contentStyle}>2</h3>
                            </div>
                            <div>
                                <h3 style={contentStyle}>3</h3>
                            </div>
                            <div>
                                <h3 style={contentStyle}>4</h3>
                            </div>
                        </Carousel>
                    </div>
                </Col>
                <Col span={10} style={{alignSelf: 'center'}}>
                    <div className={styles.titleContent}>OUR</div>
                    <div className={styles.titleContent}>TOP</div>
                    <div className={styles.titleContent}>INSTRUCTORS</div>
                </Col>
            </Row>
            <Row className={styles.skewBottom}></Row>
            <Row className={styles.background}>
                <div
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '48px',
                        color: '#fff'
                    }}>FACULTIES</div>
                <Row className={styles.fullWidth}>
                    <Col className={styles.facilityItem}>
                        <i>
                            <img src={ckm} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>Mechanical Engineering</span>
                    </Col>
                    <Col className={styles.facilityItem}>
                        <i>
                            <img src={clc} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>Mechanical Engineering</span>
                    </Col>
                    <Col className={styles.facilityItem}>
                        <i>
                            <img src={cnhhtp} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>Mechanical Engineering</span>
                    </Col>
                </Row>
                <Row className={styles.fullWidth}>
                    <Col className={styles.facilityItem}>
                        <i>
                            <img src={cnmtt} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>Mechanical Engineering</span>
                    </Col>
                    <Col className={styles.facilityItem}>
                        <i>
                            <img src={ddt} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>Mechanical Engineering</span>
                    </Col>
                    <Col className={styles.facilityItem}>
                        <i>
                            <img src={khud} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>Mechanical Engineering</span>
                    </Col>
                </Row>
                <Row className={styles.fullWidth}>
                    <Col className={styles.facilityItem}>
                        <i>
                            <img src={kt} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>Mechanical Engineering</span>
                    </Col>
                    <Col className={styles.facilityItem}>
                        <i>
                            <img src={maxresdefault} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>Mechanical Engineering</span>
                    </Col>
                    <Col className={styles.facilityItem}>
                        <i>
                            <img src={nn} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>Mechanical Engineering</span>
                    </Col>
                </Row>
                <Row>
                    <Col className={styles.facilityItem}>
                        <i>
                            <img src={xd} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>Mechanical Engineering</span>
                    </Col>
                </Row>
            </Row>
            <Row className={styles.background} style={{paddingTop: '30px'}}>
                <div
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '48px',
                        color: '#fff'
                    }}>COURSE LEARN FREE
                </div>
                <Row className={styles.fullWidth}>
                    <Col span={8}>
                        <div style={{
                            textAlign: 'center',
                            background: '#C4C4C4',
                            height: '200px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                left: '39%',
                                top: '10%',
                               
                                fontSize: '7em'
                            }}>
                                <PlayCircleOutlined />
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{
                            textAlign: 'center',
                            background: '#C4C4C4',
                            height: '200px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                left: '39%',
                                top: '10%',
                                fontSize: '7em'
                            }}>
                                <PlayCircleOutlined />
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className={styles.fullWidth}>
                    <Col span={8}>
                        <div style={{
                            textAlign: 'center',
                            background: '#C4C4C4',
                            height: '200px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                left: '39%',
                                top: '10%',
                                fontSize: '7em'
                            }}>
                                <PlayCircleOutlined />
                            </div>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{
                            textAlign: 'center',
                            background: '#C4C4C4',
                            height: '200px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                left: '39%',
                                top: '10%',
                                fontSize: '7em'
                            }}>
                                <PlayCircleOutlined />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Row>
        </>
    }
}


export default IndexContent
