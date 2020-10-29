import React from 'react'
import { Layout } from 'antd'
import Headers from '../components/header'

const { Header, Content, Footer } = Layout


import styles from './styles.scss'
import './overwrites.css'

const IndexLayout = ({ children }) => {
    return (
        <Layout>
            <Header className="background-header">
                <Headers />
            </Header>
            <Content>{ children }</Content>
            <Footer>
                <div>LAYOUT FOOTER</div>
            </Footer>
        </Layout>
    )
}

export default IndexLayout
