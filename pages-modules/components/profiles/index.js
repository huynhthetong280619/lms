import React, { useState, useEffect } from 'react'
import { Row, Col, Tabs, Input, Button, Upload, message } from 'antd'
import { Form, Divider, Tag } from 'antd'
import {
    FacebookOutlined,
    DisconnectOutlined
} from '@ant-design/icons'
import { withTranslation } from 'react-i18next'

import profileImg from '../../../assets/images/contents/profileN.png'

import restClient from '../../../assets/common/core/restClient'
import { getCookie } from '../../../assets/common/core/localStorage'
import { FACEBOOK_CLIENT_ID } from '../../../assets/constants/const'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import 'antd/dist/antd.css';
import './overwrite.css';
import { LocalDiningSharp } from '@material-ui/icons'

const fileTypes = [
    "image/jpeg",
    "image/png"
];

const SectionDescription = ({ title, content }) => (
    <div>
        <p className="section-description-title">{title}:</p>
        <p className="section-description-content">{content}</p>
    </div>
);

function getBase64(img, callback) {
    console.log(img);
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

const Profile = ({ token }) => {

    const [state, setState] = useState({
        loading: false,
        fileData: null,
        connectFacebook: false,
        disconnectFacebook: false,
        submitProfile: false,
        submitPassword: false,
    });
    const [formProfile] = Form.useForm();
    const [formPassword] = Form.useForm();
    const [, forceUpdate] = useState(); // To disable submit button at the beginning.

    const [profile, setProfile] = useState({});

    useEffect(() => {
        forceUpdate({});
        const usrObj = JSON.parse(localStorage.getItem('user'))

        setState({...state,
            imageUrl: usrObj.urlAvatar,
        });
        setProfile(usrObj);

        formProfile.setFieldsValue({
            emailAddress: usrObj.emailAddress,
            surName: usrObj.surName,
            firstName: usrObj.firstName,
            code: usrObj.code
        });

    }, []);

    const { loading, imageUrl, connectFacebook, disconnectFacebook,
        submitPassword, submitProfile } = state;

    const updateProfile = async (values) => {
        console.log('profile', values);
        console.log('image', imageUrl);
        setState({...state, submitProfile: true });
        const tokenCookies = getCookie('token');
        await restClient.asyncPut(`/user/`, {
            surName: values.surName,
            firstName: values.firstName,
            urlAvatar: imageUrl,
        }, tokenCookies)
            .then(res => {
                setState({...state, submitProfile: false });
                console.log('resLink', res)
                // localStorage.removeItem('user');
                if (!res.hasError) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    setProfile(res.data.user);
                    message.success(res.data.message);
                } else {
                    message.error(res.data.message);
                }
            })
    }

    const updatePassword = async (values) => {
        console.log('password', values);
        setState({...state, submitPassword: true });
        const tokenCookies = getCookie('token');
        await restClient.asyncPut(`/user/password`, {
            password: values.current,
            newPassword: values.new
        }, tokenCookies)
            .then(res => {
                setState({...state, submitPassword: false });
                console.log('resLink', res)
                // localStorage.removeItem('user');
                if (!res.hasError) {
                    formPassword.resetFields();
                    message.success(res.data.message);
                } else {
                    message.error(res.data.message);
                }
            })
    }


    const handleImageUpload = (info, onSuccess) => {
        setState({...state,
            loading: true,
        });
        const formData = new FormData();
        getBase64(info.file, (async (data) => {
            formData.append('file', data)
            // replace this with your upload preset name
            formData.append('upload_preset', 'gmttm4bo');
            const options = {
                method: 'POST',
                body: formData,
                header: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Accept',
                    mode: 'no-cors'
                }
            };

            // replace cloudname with your Cloudinary cloud_name
            await fetch('https://api.Cloudinary.com/v1_1/dkepvw2rz/upload', options)
                .then(res => res.json())
                .then(res => {
                    console.log('url', res.url);
                    setState({...state,
                        imageUrl: res.url,
                        loading: false
                    });
                })
                .catch(err => {
                    console.log(err)
                    setState({...state,
                        loading: false
                    });
                });
        }));
    }

    const linkSocial = async (data) => {
        setState({...state, connectFacebook: true });
        const tokenCookies = getCookie('token');
        await restClient.asyncPut(`/user/auth/facebook/link`, data, tokenCookies)
            .then(res => {
                console.log('resLink', res)
                setState({...state, connectFacebook: false });
                // localStorage.removeItem('user');
                if (!res.hasError) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    setProfile(res.data.user);
                    message.success(res.data.message);
                } else {
                    message.error(res.data.message);
                }
            })
    }

    const unlinkSocial = async () => {
        setState({...state, disconnectFacebook: true });
        const tokenCookies = getCookie('token');
        await restClient.asyncPut(`/user/auth/facebook/unlink`, {
            token: tokenCookies
        }, tokenCookies)
            .then(res => {
                setState({...state, disconnectFacebook: false });
                console.log('resLink unlink', res)
                if (!res.hasError) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    setProfile(res.data.user);
                    message.success(res.data.message);
                } else {
                    message.error(res.data.message);
                }
            })
    }

    const responseFacebook = async (response) => {
        console.log('responseFacebook', response);
        const token = response.accessToken;
        console.log('responseFacebook', token);
        const data = {
            token: token
        }

        linkSocial(data)
    }

    return (
        <Row style={{
            margin: '10px 20px 10px 20px',
            background: '#fff',
            minHeight: '200px',
            paddingBottom: '30px'
        }}>
            <div style={{ padding: "10px 0", textAlign: "center" }}>
                <i>
                    <img src={profileImg} width="60px" />
                </i>
                <span style={{
                    fontWeight: "700",
                    marginLeft: "10px"
                }}>YOUR DETAIL PROFILE</span>
            </div>
            <Divider />
            <Row>
                <Col span={8}>
                    <SectionDescription title="Profile" content="Your email address is your identity on LMS and is used to log in." />
                </Col>
                <Col span={2}>
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        customRequest={handleImageUpload}
                        accept={fileTypes}
                        loading={loading}
                    >

                        <img src={imageUrl ? imageUrl : profile.urlAvatar} alt="avatar" style={{ width: '100%' }} />

                    </Upload>
                </Col>
                <Col span={8}>
                    <Form
                        id="form-profile"
                        name="form-profile"
                        form={formProfile}
                        layout="vertical"
                        className="form-profile"
                        requiredMark='optional'
                        onFinish={updateProfile}
                    >
                        <Form.Item
                            label="Code"
                            name={"code"}>
                            <Input readOnly disabled />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name={"emailAddress"}>
                            <Input readOnly disabled />
                        </Form.Item>
                        <Form.Item
                            label="Surname"
                            name={"surName"}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Surname!',
                                }
                            ]}>
                            <Input placeholder="Your surname..." />
                        </Form.Item>
                        <Form.Item
                            label="First name"
                            name={"firstName"}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your First name!',
                                }
                            ]}>
                            <Input placeholder="Your first name..." />
                        </Form.Item>
                        <Form.Item
                            style={{ textAlign: 'center' }}>
                            <Button style={{ marginTop: 8 }}
                                type="primary"
                                htmlType="submit"
                                form="form-profile"
                                size='large'
                                loading={submitProfile}
                            >Save</Button>

                        </Form.Item>
                    </Form>

                    <Divider>Social Network</Divider>
                    {!profile.facebookId ? (<FacebookLogin
                        appId={`${FACEBOOK_CLIENT_ID}`}
                        autoLoad={false}
                        callback={responseFacebook}
                        render={(renderProps) => (
                            <Button
                                style={{ color: '#131394' }}
                                loading={connectFacebook}
                                onClick={renderProps.onClick}
                                icon={<FacebookOutlined />}
                            >
                                Connect to Facebook
                            </Button>
                        )}
                    />) : (<Row>
                        <Tag icon={<FacebookOutlined />} color="#3b5999">Facebook</Tag>
                        <Tag color="purple">ID: {profile.facebookId}</Tag>
                        <Button
                            size={"small"}
                            style={{ marginLeft: 8 }}
                            type={"primary"}
                            danger
                            icon={<DisconnectOutlined />}
                            loading={disconnectFacebook}
                            onClick={unlinkSocial}
                        >
                            Unlink Facebook
                        </Button>
                    </Row>)}
                </Col>
            </Row>

            <Divider />
            <Row>
                <Col span={8}>
                    <SectionDescription title="Password" content="Changing your password will also required your current password" />
                </Col>
                <Col span={2} />
                <Col span={10}>
                    <Form
                        onFinish={updatePassword}
                        name="password"
                        id='form-password'
                        form={formPassword}
                        layout="vertical"
                        className="form-password"
                        requiredMark={"optional"}
                    >
                        <Form.Item
                            label="Current password"
                            name="current"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your current password!',
                                }
                            ]}
                            hasFeedback>
                            <Input.Password placeholder="enter your current password" />
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="New password"
                            name="new"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your new password!',
                                },
                                {
                                    min: 8,
                                    message: 'Password must be 8 or more characters.'
                                }
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                placeholder="enter a new password" />
                        </Form.Item>
                        <Form.Item
                            name="confirm"
                            dependencies={['new']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('new') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject('The two passwords that you entered do not match!');
                                    },
                                }),
                            ]}
                            label="Confirm New Password">
                            <Input.Password placeholder="enter the password again" />
                        </Form.Item>
                        <Form.Item shouldUpdate={true}>
                            {() => (
                                <Button style={{ marginTop: 8 }}
                                    loading={submitPassword}
                                    htmlType="submit"
                                    form='form-password'
                                    disabled={
                                        !formPassword.isFieldsTouched(true) ||
                                        formPassword.getFieldsError().filter(({ errors }) => errors.length).length
                                    }
                                >Update password</Button>
                            )}
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Row>
    )
}

export default withTranslation('translations')(Profile)
