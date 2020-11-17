import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import { Row, Col, Tabs, Input, Button, Upload, message  } from 'antd'
import { AlertOutlined, CheckCircleTwoTone, LoadingOutlined ,PlusOutlined } from '@ant-design/icons'
const { TabPane } = Tabs

import profile from '../../assets/images/contents/profileN.png'

import styles from './styles.scss'

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

class ProfilePage extends React.Component {
    state = {
        loading: false,
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    render() {
        const { loading, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );

        return <IndexLayout>
            <Row className={styles.background} style={{ justifyContent: 'center' }}>
                <Col span={12}
                    style={{
                        margin: '10px',
                        background: '#fff',
                        borderRadius: '10px',
                        minHeight: '200px'
                    }}>
                    <div style={{ padding: "10px 0", textAlign: "center" }}>
                        <i>
                            <img src={profile} width="60px" />
                        </i>
                        <span style={{
                            fontWeight: "700",
                            marginLeft: "10px"
                        }}>YOUR DETAIL PROFILE</span>
                    </div>
                    <Row>
                        <Col span={4}>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                        </Col>
                        <Col span={16}>
                            <div>
                                <Input placeholder="Basic usage" />
                            </div>
                            <div>
                                <Input placeholder="Basic usage" />
                            </div>
                            <div>
                                <Input placeholder="Basic usage" />
                            </div>
                            <div>
                                <Input placeholder="Basic usage" />
                            </div>
                            <div>
                                <Input placeholder="Basic usage" />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Button type="primary" danger>
                            Edit profile
                </Button>
                    </Row>
                </Col>
                <Col span={8}
                    style={{
                        margin: '10px',
                        background: '#fff',
                        borderRadius: '10px',
                        minHeight: '200px'
                    }}>
                    <div>
                        <div style={{
                            textAlign: 'center',
                            padding: '10px 0'
                        }}>
                            <i>
                            </i>
                            <span style={{ padding: '25px', fontSize: '2em' }}>UPCOMING DEADLINE</span>
                        </div>
                    </div>
                    <div>
                        {/* Empty */}
                        {/* <div style={{
                            textAlign: 'center',
                            padding: '45px'
                        }}>
                            <i>
                                <img src={deadlineCalcular} />
                            </i>
                            <div style={{ color: '#c4c4c4', fontStyle: 'italic' }}>No upcoming deadline</div>
                        </div> */}
                        {/* Deadline */}
                        <Row style={{ justifyContent: 'center' }}>
                            <Tabs defaultActiveKey="1" centered>
                                <TabPane tab={<span> <AlertOutlined twoToneColor="#ff0000" />Deadline</span>} key="1">
                                    <Row>
                                        <Col span={10}><i>
                                        </i></Col>
                                        <Col span={14}>
                                            <div>Ngôn ngữ lập trình tiên tiến</div>
                                            <div><span>Due to:</span>20/10/2020</div>
                                            <div>Time remaining: 2 hours</div>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab={<span> <CheckCircleTwoTone twoToneColor="#52c41a" />

                    Complete</span>} key="2">
                                    <Row>
                                        <Col span={10}><i>
                                        </i></Col>
                                        <Col span={14}>
                                            <div>Ngôn ngữ lập trình tiên tiến</div>
                                            <div><span>Due to:</span>20/10/2020</div>
                                            <div>Time remaining: 2 hours</div>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </Row>
                    </div>
                </Col>
            </Row>
        </IndexLayout>
    }

}

export default ProfilePage
