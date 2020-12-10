import { Button, Row } from 'antd'
import React, { Component } from 'react'

import styles from './styles.scss'
class Banner extends Component {

    render() {
        return <>
        <Row className={styles.bannerLayout}>
            <div className="media-banner">
                
            </div>
            <div className={styles.contentBanner}>
                <h1 className={styles.bannerHeader}>HCM UNIVERSITY OF TECHNOLOGY & EDUCATION</h1>
                <h1 className={styles.bannerHeader}>UTEx ONLINE TRAINING SYSTEM</h1>
                <h2 className={styles.bannerdescript}>
                    Shorten the distance, save time, high efficiency, support anytime, anywhere, ...
                </h2>
                <a className={styles.buttonView} href="/courses">VIEW COURSE</a>
            </div>
        </Row>
        <Row className={styles.skewTop}></Row>
        </>
    }
}

export default Banner
