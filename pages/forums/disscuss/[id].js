import React from 'react'
import IndexLayout from '../../../pages-modules/layouts/layout'
import { Row, Col, Avatar, Comment, Form, Button, List, Input  } from 'antd'

import moment from 'moment';

const { TextArea } = Input;
import { UserOutlined } from '@ant-design/icons'
import discussion from '../../../assets/images/contents/discussion.jpg'
import discusad from '../../../assets/images/contents/discusad.png'

const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
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

class ForumPage extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
    };

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    {
                        author: 'Han Solo',
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content: <p>{this.state.value}</p>,
                        datetime: moment().fromNow(),
                    },
                    ...this.state.comments,
                ],
            });
        }, 1000);
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    render() {
        const { comments, submitting, value } = this.state;

        return <IndexLayout>
            <Row style={{
                width: '80%',
                textAlign: 'center',
                background: '#fff',
                borderRadius: '15px',
                minHeight: '20px'
            }}>
                <Row style={{ width: '100%' }}>
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</Col>
                </Row>
                <div style={{ width: '90%' }}>
                    <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                        <span>
                            <img src={discussion} width="80px" />
                        </span>
                        <span style={{ fontWeight: '700' }}>[ DISCUSSION FORUM ] PART 1: BASIC PYTHON</span>
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
                                    <Avatar size={64} icon={<UserOutlined />} />
                                </div>
                                <div style={{ paddingLeft: "10px" }}>
                                    <div>Huỳnh Thế Tông  • 20h</div>
                                    <div>@17110384</div>
                                </div>
                            </div>
                            <div style={{ paddingLeft: "70px" }}>
                                Ever go to type your password, and your hands just aren't playing, and you feel like you just slapped the keyboard a couple of times. But then you think "fuck it" and hit enter anyway, and omg "PASSWORD ACCEPTED", and you punch the air in celebration?
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
        </IndexLayout>
    }
}

export default ForumPage
