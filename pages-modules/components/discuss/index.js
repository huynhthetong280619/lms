import React from 'react'
import { withTranslation } from 'react-i18next'

import { Row, Col, Avatar, Form, Button, List, Input, Tooltip, Comment } from 'antd'
import moment from 'moment';

const { TextArea } = Input;
import { UserOutlined } from '@ant-design/icons'
import discussion from '../../../assets/images/contents/discussion.jpg'
import discusad from '../../../assets/images/contents/discusad.png'
import TextField from '@material-ui/core/TextField'
import restClient from '../../../assets/common/core/restClient'
import { get } from 'lodash'

import './overwrite.css'
const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment author={<a>{get(get(props, 'create'), 'surName') + get(get(props, 'create'), 'firstName')}</a>}
            avatar={
                <Avatar
                    src={get(get(props, 'create'), 'urlAvatar')}
                    alt="Han Solo"
                />
            }

            content={
                <p>
                    {get(props, 'content')}
                </p>
            }

            datetime={
                <Tooltip title={moment.utc(get(props, 'time')).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment().from(moment.utc(get(props, 'time')))}</span>
                </Tooltip>
            }
        />}


    />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
        </Button>
        </Form.Item>
    </>
);

class Discussion extends React.Component {

    state = {
        comments: [],
        submitting: false,
        value: '',
    };


    componentDidMount() {
        console.log('detailTopic', this.props.detailTopic)
        this.setState({
            comments: this.props.lstDiscussion
        })
    }

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        setTimeout(async () => {

            const data = {
                idSubject: this.props.idSubject,
                idTimeline: this.props.idTimeline,
                idForum: this.props.idForum,
                idTopic: this.props.idTopic,
                data: {
                    content: this.state.value
                }
            }

            await restClient.asyncPost(`/discussion`, data)
                .then(res => {
                    console.log('discussion', res)

                    if (!res.hasError) {
                        this.setState({
                            submitting: false,
                            value: '',
                            comments: [
                                get(res, 'data'),
                                ...this.state.comments,
                            ],
                        });
                    }
                })

        }, 1000);
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    render() {
        const { comments, submitting, value, lstDiscussion } = this.state;

        console.log('lstDiscussion', lstDiscussion)
        return (
            <>
                <Row id="lms-ws-discussion-page" style={{
                    width: '80%',
                    textAlign: 'center',
                    background: '#fff',
                    borderRadius: '15px',
                    minHeight: '20px'
                }}>
                    <Row style={{ width: '100%' }}>
                        <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject}</Col>
                    </Row>
                    <div style={{ width: '90%' }}>
                        <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                            <span>
                                <img src={discussion} width="80px" />
                            </span>
                            <span style={{ fontWeight: '700' }}>[ TOPIC ] {get(this.props.detailTopic, 'name').toUpperCase()}</span>
                        </div>
                        <div style={{ width: '100%', minHeight: '150px' }}>
                            <div style={{
                                textAlign: 'left',
                                padding: '45px',
                                marginBottom: "25px",
                                border: "2px solid #c4c4c4",
                                borderRadius: "20px"

                            }}>
                                <div style={{
                                    display: "inline-flex",
                                    textAlign: "left"
                                }}>
                                    <div>
                                        <Avatar size={64} icon={<img src={get(get(this.props.detailTopic, 'create'), 'urlAvatar')} />} />
                                    </div>
                                    <div style={{ paddingLeft: "10px" }}>
                                        <div>{get(get(this.props.detailTopic, 'create'), 'surName') + " " + get(get(this.props.detailTopic, 'create'), 'firstName')}  • <span>{moment().from(moment.utc(get(this.props.detailTopic, 'time')))}</span></div>
                                        <div>@{get(get(this.props.detailTopic, 'create'), 'code')}</div>
                                    </div>
                                </div>
                                <div style={{ paddingLeft: "70px" }}>
                                    {get(this.props.detailTopic, 'content')}
                                </div>
                            </div>
                            {comments.length > 0 && <CommentList comments={comments} />}
                            <Comment
                                avatar={
                                    <Avatar
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                        alt="Han Solo"
                                    />
                                }
                                content={
                                    <Editor
                                        onChange={this.handleChange}
                                        onSubmit={this.handleSubmit}
                                        submitting={submitting}
                                        value={value}
                                    />
                                }
                            />
                        </div>
                    </div>
                </Row>
            </>
        )
    }
}

export default withTranslation('translations')(Discussion)
