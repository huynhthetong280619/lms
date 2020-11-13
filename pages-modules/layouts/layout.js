import React from 'react'
import { Layout } from 'antd'
import Headers from '../components/header'
import Footers from '../components/footer'
import Banner from '../components/banner'

const { Header, Content, Footer } = Layout


import styles from './styles.scss'
import './overwrites.css'

const IndexLayout = ({ children }) => {
    return (
        <Layout className={styles.mainLayout}>
            <Header className={styles.header}>
                <Headers />
            </Header>
            <Content className={styles.content}>{ children }</Content>
            <Footer className={styles.footer}>
                <Footers />
            </Footer>
        </Layout>
    )
}

export default IndexLayout
