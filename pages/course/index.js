import React from 'react'
import { Layout, Row } from 'antd'

import styles from './styles.scss'
import './overwrite.css'

const PageCourse = () => {
    return (
        <Layout>
            <Row className="wrapper-container">
                <div className={styles.container}>Hello world</div>
            </Row>
        </Layout>
    )
}

export default PageCourse
