import React from 'react'
import { Row, Col, Modal, Input, Card, notification, Button, Tooltip, Badge, Form } from 'antd'

import discussion from '../../../assets/images/contents/discussion.jpg'
import { withTranslation } from 'react-i18next'
import restClient from '../../../assets/common/core/restClient'
import { get } from 'lodash'
import HeadPage from '../headPage/headPage.jsx';
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

    handleCancel = () => {
        this.setState({ isModalCreateTopic: false });
    };

    createTopic = async ({ topic }) => {

        const data = {
            idSubject: this.props.idSubject,
            idTimeline: this.props.idTimeline,
            idForum: this.props.idForum,
            data: {
                name: topic.name,
                content: topic.content
            }
        }
        this.setState({
            isLoading: true
        })

        await restClient.asyncPost('/topic', data, this.props.token)
            .then(res => {
                //console.log('Create topic', res)
                this.setState({
                    isLoading: false
                })
                if (!res.hasError) {
                    this.notifySuccess(this.props.t('success'), this.props.t('add_topic_success'))
                    this.setState({
                        isLoading: false
                    })
                    this.setState({
                        detailForum: [...this.state.detailForum, get(res, 'data').topic]
                    })
                    this.setState({ isModalCreateTopic: false });
                } else {
                    this.notifyError(this.props.t('failure'), res.data.message);
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
    onFinish = (values) => {
        //console.log(values);

        this.createTopic({ topic: values });
    }


    render() {

        const { t, forum } = this.props

        //console.log(forum)

        const layout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            }
        };

        return (<>
            <HeadPage title={`${this.props.nameSubject}: ${forum.name}`} />
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
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.isLoading}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            {t('cancel')}
                        </Button>,
                        <Button key="submit" form="frm_add_topic" htmlType="submit" type="primary" loading={this.state.isLoading}>
                            {t('save')}
                        </Button>,
                    ]}
                >
                    <Form
                        {...layout}
                        name='frm_add_topic'
                        id='frm_add_topic'
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name='name'
                            label={t('name')}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_topic_name')
                                }
                            ]}
                        >
                            <Input placeholder={t('topic_name')} style={{ borderRadius: 20 }} />
                        </Form.Item>
                        <Form.Item
                            name='content'
                            label={t('content')}
                            rules={[
                                {
                                    required: true,
                                    message: t('req_topic_content')
                                }
                            ]}
                        >
                            <Input placeholder={t('topic_content')} style={{ borderRadius: 20 }} />
                        </Form.Item>
                    </Form>
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
                            })}>{t('new_topic')}</Button>
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
                                            <Badge.Ribbon text={`${t('replies_in_topic')}${replies ? replies : 0}`}
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
