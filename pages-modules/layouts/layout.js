import React from 'react'
import { Layout } from 'antd'
import Headers from '../components/header'
import Footers from '../components/footer'
import Banner from '../components/banner'

const { Header, Content, Footer } = Layout

import styles from './styles.scss'
import './overwrites.css'
import { withTranslation } from 'react-i18next';
import i18n from '../../i18n';
const IndexLayout = ({ children }) => {
    const change_language = (lang) => {
        i18n.changeLanguage(lang)
    }
    return (
        <Layout className={styles.mainLayout}>
            <Header className={styles.header}>
                <Headers />
            </Header>
            <Content className={styles.content}>{ children }</Content>
            <Footer className={styles.footer}>
                <Footers />
            </Footer>
            <button onClick={(e)=>change_language('vi')}>VI</button>
            <button onClick={(e)=>change_language('en')}>EN</button>
        </Layout>
    )
}

export default withTranslation('translations')(IndexLayout)
