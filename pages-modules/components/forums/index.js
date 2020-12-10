import React from 'react'
import { Row, Col, Modal, Input, Card } from 'antd'

import discussion from '../../../assets/images/contents/discussion.jpg'
import discusad from '../../../assets/images/contents/discusad.png'
import { withTranslation } from 'react-i18next'
import restClient from '../../../assets/common/core/restClient'
import { get } from 'lodash'
import { AppstoreAddOutlined } from '@ant-design/icons'

const { Meta } = Card;

class Forum extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // isModalVisible: false,
            isModalCreateTopic: false,
            detailForum: [],
            topic_name: '',
            topic_desc: ''
        }
    }

    componentDidMount() {
        this.setState({
            detailForum: get(this.props.forum, 'topics')
        })
    }


    showModal = () => {
        this.setState({ isModalCreateTopic: true });
    };

    handleOk = () => {

        this.createForum()
        this.setState({ isModalCreateTopic: false });
    };

    handleCancel = () => {
        this.setState({ isModalCreateTopic: false });
    };

    createForum = async () => {
        const data = {
            idSubject: 'lthdt01',
            idTimeline: '5f75e682817a140f580937bc',
            idForum: '5fad2f61861b9f1e9c7f275b',
            data: {
                name: this.state.topic_name,
                content: this.state.topic_desc
            }
        }

        await restClient.asyncPost('/topic', data)
            .then(res => {
                console.log(res)

                if (!res.hasError) {
                    this.setState({
                        detailForum: [...this.state.detailForum, get(res, 'data')]
                    })
                }

            })
    }


    render() {

        const { t, forum } = this.props

        console.log(forum)

        return (<>
            <Row style={{
                width: '80%',
                textAlign: 'center',
                background: '#fff',
                borderRadius: '15px',
                minHeight: '20px'
            }}>
                <Modal
                    title={t('new_topic')}
                    visible={this.state.isModalCreateTopic}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Row style={{ margin: "10px 0" }}>
                        <Col span={6}>
                            <label>{t('topic_name')}</label>
                        </Col>
                        <Col span={14}>
                            <Input placeholder={t('please_fill_into_topic_name')} style={{ borderRadius: 20 }} onChange={(e) => this.setState({ topic_name: e.target.value.trim() })} />
                        </Col>
                    </Row>
                    <Row style={{ margin: "10px 0" }}>
                        <Col span={6}>
                            <label>{t('topic_description')}</label>
                        </Col>
                        <Col span={14}>
                            <Input placeholder={t('please_fill_into_topic_description')} style={{ borderRadius: 20 }} onChange={(e) => this.setState({ topic_desc: e.target.value.trim() })} />
                        </Col>
                    </Row>
                </Modal>
                <Row style={{ width: '100%' }}>
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>{get(forum, 'name')}</Col>
                </Row>
                <div style={{ width: '90%' }}>
                    <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                        <span>
                            <img src={discussion} width="80px" />
                        </span>
                        <span style={{ fontWeight: '700' }}>[ {t('discussion_forum')} ] {get(forum, 'name')}</span>
                    </div>
                    <div style={{ width: '100%', minHeight: '150px' }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            marginBottom: "25px",
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px",
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: ' center'
                        }}>
                            {
                                this.state.detailForum.map(({ create, name, description }) => {
                                    return (
                                        <Card
                                            hoverable
                                            style={{
                                                width: 240, margin: '10px',
                                                borderRadius: '25px'
                                            }}
                                            cover={<img alt="example" src={get(create, 'urlAvatar')} />}
                                        >
                                            <Meta title={name} description={description} />
                                        </Card>
                                    )
                                })
                            }

                            <Card
                                hoverable
                                style={{
                                    width: 240, margin: '10px',
                                    borderRadius: '25px'
                                }}
                                onClick={() => this.setState({
                                    isModalCreateTopic: true
                                })}
                            >
                                ADD MORE TOPIC
                                    </Card>

                        </div>
                    </div>
                </div>
            </Row>
        </>)
    }
}


export default withTranslation('translations')(Forum)
