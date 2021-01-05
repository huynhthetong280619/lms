import React from 'react'
import { Layout } from 'antd'
import Headers from '../components/header'
import Footers from '../components/footer'
import Banner from '../components/banner'

const { Header, Content, Footer } = Layout

import styles from './styles.scss'
import './overwrites.css'

import i18n from '../../i18n'
import { I18nextProvider } from "react-i18next";
import Head from 'next/head'

const IndexLayout = ({ children }) => {
    
    return (
        <I18nextProvider i18n={i18n}>
            <Layout className={styles.mainLayout}>
                <Head>
                    <script
                        src="https://widget.Cloudinary.com/v2.0/global/all.js"
                        type="text/javascript"
                    ></script>
                </Head>
                <Header className={styles.header}>
                    <Headers />
                </Header>
                <Content className={styles.content} >{children}</Content>
                <Footer className={styles.footer}>
                    <Footers />
                </Footer>
            </Layout>
        </I18nextProvider>
    )
}

export default IndexLayout
