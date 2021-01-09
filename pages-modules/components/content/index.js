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
import { withTranslation } from 'react-i18next'


const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

class IndexContent extends Component {

    render() {
        const {t} = this.props
        return <>
            <Row className="lms_ws_content" style={{background: '#fff',     display: 'flex',
    justifyContent: 'center'}}>
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
                    <div className={styles.titleContent}>{t('our')}</div>
                    <div className={styles.titleContent}>{t('top')}</div>
                    <div className={styles.titleContent}>{t('instructor')}</div>
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
                    }}>{t('faculties')}</div>
                <Row className={styles.fullWidth}>
                    <Col className={styles.facilityItem} span={7}>
                        <i>
                            <img src={ckm} />
                        </i>
                <span style={{ paddingLeft: '6px' }}>{t('mechanical_engineering')}</span>
                    </Col>
                    <Col className={styles.facilityItem} span={7}>
                        <i>
                            <img src={clc} />
                        </i>
                        <span style={{ paddingLeft: '6px' }}>{t('high_quality_training')}</span>
                    </Col>
                    <Col className={styles.facilityItem} span={7}>
                        <i>
                            <img src={cnhhtp} />
                        </i>
                <span style={{ paddingLeft: '6px' }}>{t('chemical_food_technology')}</span>
                    </Col>
                </Row>
                <Row className={styles.fullWidth}>
                    <Col className={styles.facilityItem} span={7}>
                        <i>
                            <img src={cnmtt} />
                        </i>
                <span style={{ paddingLeft: '6px' }}>{t('garment_techonolog_fashion_design')}</span>
                    </Col>
                    <Col className={styles.facilityItem} span={7}>
                        <i>
                            <img src={ddt} />
                        </i>
                <span style={{ paddingLeft: '6px' }}>{t('electrical_electronic_enginering')}</span>
                    </Col>
                    <Col className={styles.facilityItem} span={7}>
                        <i>
                            <img src={khud} />
                        </i>
                <span style={{ paddingLeft: '6px' }}>{t('applied_science')}</span>
                    </Col>
                </Row>
                <Row className={styles.fullWidth}>
                    <Col className={styles.facilityItem} span={7}>
                        <i>
                            <img src={kt} />
                        </i>
                <span style={{ paddingLeft: '6px' }}>{t('economics')}</span>
                    </Col>
                    <Col className={styles.facilityItem} span={7}>
                        <i>
                            <img src={maxresdefault} />
                        </i>
                <span style={{ paddingLeft: '6px' }}>{t('vehicle_energy_engineering')}</span>
                    </Col>
                    <Col className={styles.facilityItem} span={7}>
                        <i>
                            <img src={nn} />
                        </i>
                <span style={{ paddingLeft: '6px' }}>{t('foreign_language')}</span>
                    </Col>
                </Row>
                <Row className={styles.fullWidth}>
                    <Col className={styles.facilityItem} span={7}>
                        <i>
                            <img src={xd} />
                        </i>
                         <span style={{ paddingLeft: '6px' }}>{t('civil_engineering')}</span>
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
                    }}>{t('course_learn_free')}
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


export default withTranslation('translations')(IndexContent)
