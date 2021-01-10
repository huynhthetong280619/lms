import React from 'react'
import { Row, Col, Modal, Input, Card, notification, Button, Tooltip, Badge } from 'antd'

import discussion from '../../../assets/images/contents/discussion.jpg'
import { withTranslation } from 'react-i18next'
import restClient from '../../../assets/common/core/restClient'
import { get } from 'lodash'

import './overwrite.css'

const { Meta } = Card;

class Forum extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // isModalVisible: false,
            isModalCreateTopic: false,
            detailForum: [],
            topic_name: '',
            topic_desc: '',
            isLoading: false
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
    };

    handleCancel = () => {
        this.setState({ isModalCreateTopic: false });
    };

    createForum = async () => {

        const data = {
            idSubject: this.props.idSubject,
            idTimeline: this.props.idTimeline,
            idForum: this.props.idForum,
            data: {
                name: this.state.topic_name,
                content: this.state.topic_desc
            }
        }
        this.setState({
            isLoading: true
        })

        await restClient.asyncPost('/topic', data, this.props.token)
            .then(res => {
                console.log('Create topic', res)
                this.setState({
                    isLoading: false
                })
                if (!res.hasError) {
                    this.notifySuccess('Thành công!', 'Tạo chủ đề thành công')
                    this.setState({
                        isLoading: false
                    })
                    this.setState({
                        detailForum: [...this.state.detailForum, get(res, 'data').topic]
                    })
                    this.setState({ isModalCreateTopic: false });
                } else {
                    this.notifyError('Thất bại!', res.data.message);
                }

            })
    }

    notifySuccess = (message, description) => {
        notification.success({
            message,
            description,
            placement: 'bottomRight'
        });
    };

    notifyWarning = (message, description) => {
        notification.warning({
            message,
            description,
            placement: 'bottomRight'
        });
    };


    notifyError = (message, description) => {
        notification.error({
            message,
            description,
            placement: 'bottomRight'
        });
    };


    render() {

        const { t, forum } = this.props

        console.log(forum)

        return (<>
            <Row style={{
                width: '85%',
                textAlign: 'center',
                background: '#fff',
                minHeight: '20px', justifyContent: 'center',
                margin: '0 auto'
            }}>
                <Modal
                    title={t('new_topic')}
                    visible={this.state.isModalCreateTopic}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.isLoading}
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
                    <Col span={24} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject.toUpperCase()}</Col>
                </Row>
                <div style={{ width: '90%' }}>
                    <Row style={{ textAlign: 'left', padding: '10px 0' }}>
                        <Col span={12}>
                            <span>
                                <img src={discussion} width="80px" />
                            </span>
                            <span style={{ fontWeight: '700' }}>[ {t('discussion_forum')} ] {get(forum, 'name')}</span>
                        </Col>
                        <Col span={12} style={{ textAlign: 'end', alignSelf: 'center' }}>
                            <Button type="primary" onClick={() => this.setState({
                                isModalCreateTopic: true
                            })}>Tạo topic</Button>
                        </Col>
                    </Row>


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
                                this.state.detailForum.map(({ _id, create, name, description, replies }) => {
                                    return (
                                        <a href={`/forums/disscuss/${_id}?idSubject=${this.props.idSubject}&idTimeline=${this.props.idTimeline}&idForum=${this.props.idForum}`} key={_id}>
                                            <Badge.Ribbon text={`Replies in topic: ${replies}`}
                                            >

                                                <Card

                                                    hoverable
                                                    style={{
                                                        width: 150, margin: '10px',
                                                        borderRadius: '25px'
                                                    }}
                                                    cover={<img alt="example" src={get(create, 'urlAvatar')} />}
                                                >

                                                    <Tooltip title={name}>
                                                        <Meta title={name} description={description} />
                                                    </Tooltip>
                                                </Card>
                                            </Badge.Ribbon>

                                        </a>
                                    )
                                })
                            }
                        </div>
                    </div>

                </div>
            </Row>
        </>)
    }
}


export default withTranslation('translations')(Forum)
