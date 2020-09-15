import React from 'react'
import { Layout } from 'antd'

const { Header, Content, Footer } = Layout


import styles from './styles.scss'

const IndexLayout = ({ children }) => {
    return (
        <Layout className={styles.container}>
            <Header className="header--component">
                <div>LAYOUT HEADER</div>
            </Header>
            <Content>{ children }</Content>
            <Footer>
                <div>LAYOUT FOOTER</div>
            </Footer>
        </Layout>
    )
}

export default IndexLayout
