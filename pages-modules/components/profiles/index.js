import React from 'react'
import { Row, Col, Tabs, Input, Button, Upload, message } from 'antd'
import { AlertOutlined, CheckCircleTwoTone, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { withTranslation } from 'react-i18next'
import { get } from 'lodash'
const { TabPane } = Tabs

import profile from '../../../assets/images/contents/profileN.png'
import facebook from '../../../assets/images/contents/facebook.png'
import styles from './styles.scss'
import restClient from '../../../assets/common/core/restClient'
import { getCookie } from '../../../assets/common/core/localStorage'
import { FACEBOOK_CLIENT_ID } from '../../../assets/constants/const'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import deadline from '../../../assets/images/courses/deadline.png'
import moment from 'moment'
import Deadline from '../../components/deadlines'

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

class Profile extends React.Component {

    state = {
        loading: false,
        profile: {},
        isEdit: true,
        infoUpdate: {
            firstName: '',
            surName: '',
            urlAvatar: ''
        },
        fileData: null,
        deadlines: [],
        dueTo: []
    };

    componentDidMount() {


        const usrJson = JSON.stringify(localStorage.getItem('user'))
        const usrObj = JSON.parse(JSON.parse(usrJson));
        console.log('idPrivilege', usrObj.idPrivilege)


        if (usrObj?.idPrivilege == 'student') {
            this.setState({
                isTeacher: false
            })
        }

        if (usrObj?.idPrivilege == 'teacher') {
            this.setState({
                isTeacher: true
            })
        }


        this.setState({
            profile: usrObj,
            deadlines: this.props.listDeadline || [],
            dueTo: this.props.listDueAssginment || []
        })

    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }

        console.log('handleChange', info)

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                console.log('imageUrl', imageUrl)
                return this.setState({
                    imageUrl,
                    loading: false,
                    fileData: info.file
                })
            }
            );
        }
    };

    updateProfile = async () => {

        const objResult = await this.handleImageUpload();

        console.log('objectResult', objResult)
        this.setState({ isEdit: true })
    }
    handleImageUpload = async () => {
        const formData = new FormData();
        formData.append('file', this.state.fileData)
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
        return await fetch('https://api.Cloudinary.com/v1_1/dkepvw2rz/upload', options)
            .then(res => res.json())
            .then(res => {

                console.log('Response', res)
                return {
                    name: res.original_filename,
                    path: res.url,
                    type: res.format || res.public_id.split('.')[1]
                }
            })
            .catch(err => console.log(err));
    }

    linkSocial = async (data) => {
        const tokenCookies = getCookie('token');
        await restClient.asyncPut(`/user/auth/facebook/link`, data, tokenCookies)
            .then(res => {
                console.log('resLink', res)
                // localStorage.removeItem('user');
                if (!res.hasError) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));

                    this.setState({
                        profile: res.data.user
                    })
                }

            })
    }

    unlinkSocial = async () => {
        const tokenCookies = getCookie('token');
        await restClient.asyncPut(`/user/auth/facebook/unlink`, {
            token: tokenCookies
        }, tokenCookies)
            .then(res => {
                console.log('resLink unlink', res)
                console.log
                // localStorage.removeItem('user');
                localStorage.setItem('user', JSON.stringify(res.data.user));

                this.setState({
                    profile: res.data.user
                })
            })
    }

    responseFacebook = async (response) => {
        console.log('responseFacebook', response);
        const token = response.accessToken;
        console.log('responseFacebook', token);
        const data = {
            token: token
        }

        this.linkSocial(data)
    }

    transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    render() {
        console.log('profile', this.state.profile)
        const { loading, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );

        const { t } = this.props
        return <>
            (
            <Row className={styles.background} style={{ justifyContent: 'center' }}>
                <Col span={12}
                    style={{
                        margin: '10px',
                        background: '#fff',
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
                                disabled={this.state.isEdit}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : <img src={get(this.state.profile, 'urlAvatar')} alt="avatar" style={{ width: '100%' }} />}
                                {/* <img src={this.state.profile.urlAvatar} width={102} height={102}/> */}
                            </Upload>
                            <div>
                                {
                                    ((get(this.state.profile, 'facebookId') != null) ? <><img src={facebook} width={20} /> <a onClick={() => this.unlinkSocial()}>Unlink</a></> : (<>
                                        <FacebookLogin
                                            appId={FACEBOOK_CLIENT_ID}
                                            callback={this.responseFacebook}
                                            render={renderProps => (<>
                                                <img src={facebook} width={20} /> <a onClick={renderProps.onClick}>Link</a>
                                            </>
                                            )}
                                        />
                                    </>))
                                }

                            </div>
                        </Col>
                        <Col span={16}>
                            <div>
                                <Input placeholder="Your first name..." value={get(this.state.profile, 'firstName')} style={{
                                    borderRadius: '20px',
                                    marginBottom: '10px'
                                }} disabled={this.state.isEdit} onChange={e => this.setState({
                                    infoUpdate: { ...this.state.infoUpdate, firstName: e.target.value.trim() }
                                })} />
                            </div>
                            <div>
                                <Input placeholder="Your sure name..." value={get(this.state.profile, 'surName')} style={{
                                    borderRadius: '20px',
                                    marginBottom: '10px'
                                }} disabled={this.state.isEdit} onChange={e => this.setState({
                                    infoUpdate: { ...this.state.infoUpdate, surName: e.target.value.trim() }
                                })} />
                            </div>
                            <div>
                                <Input placeholder="Your email..." value={get(this.state.profile, 'emailAddress')} style={{
                                    borderRadius: '20px',
                                    marginBottom: '10px'
                                }} disabled={true} />
                            </div>
                            <div>
                                <Input placeholder="Your code..." value={get(this.state.profile, 'code')} style={{
                                    borderRadius: '20px',
                                    marginBottom: '10px'
                                }} disabled={true} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ textAlign: 'center' }}>
                        <div>
                            {
                                this.state.isEdit ? <Button type="primary" danger style={{
                                    borderRadius: '20px',
                                    margin: '10px 0'
                                }} onClick={() => this.setState({ isEdit: false })}>
                                    Edit profile
                                </Button>
                                    :
                                    <Button type="primary" primary style={{
                                        borderRadius: '20px',
                                        margin: '10px 0'
                                    }} onClick={() => this.updateProfile()}>
                                        Save profile
                                </Button>
                            }

                        </div>
                    </Row>
                </Col>
                {
                    this.state.isTeacher ?

                        <Col span={8}
                            style={{
                                margin: '10px',
                                background: '#fff',
                                minHeight: '200px',
                                maxHeight: "768px"
                            }}>
                            <div>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '10px 0'
                                }}>
                                    <i>
                                        <img src={deadline} />
                                    </i>
                                    <span style={{ padding: '25px', fontSize: '2em' }}>{t('mn_subject')}</span>
                                </div>
                            </div>
                        </Col>
                        :
                        (
                            <Col span={8}
                                style={{
                                    margin: '10px',
                                    background: '#fff',
                                    minHeight: '200px',
                                    maxHeight: "553px"
                                }}>
                                <div>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '10px 0'
                                    }}>
                                        <i>
                                            <img src={deadline} />
                                        </i>
                                        <span style={{ padding: '25px', fontSize: '2em' }}>{t('upcm_dl')}</span>
                                    </div>
                                </div>
                                <div>
                                    <Deadline deadlines={this.state.deadlines} dueTo={this.state.dueTo} />
                                </div>
                            </Col>
                        )
                }
            </Row>
        )
        </>
    }
}

export default withTranslation('translations')(Profile)
