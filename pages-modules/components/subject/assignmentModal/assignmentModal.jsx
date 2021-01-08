import { get, head } from 'lodash';
import { withTranslation } from 'react-i18next';
import { Row, Input, Modal, Tabs, Button, notification, Spin, Alert } from 'antd'
const { TextArea } = Input;
const { TabPane } = Tabs;
import moment from 'moment'
import file from '../../../../assets/images/contents/file.png'
import word from '../../../../assets/images/contents/word.png'
import rar from '../../../../assets/images/contents/rar.png'

class AssignmentModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileData: null,
            isLoading: false,
            comment: ''
        }
    }


    transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    handleProcessFile = (e) => {
        this.setState({
            fileData: e.target.files[0]
        })
    }

    handleUpload = async () => {
        this.props.onSubmitAssignment();
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
            .catch(err => {
                console.log('Upload attachment', err);
                return null;
            });
    }

    handleSubmit = async () => {
        this.props.onSubmitAssignment();
        const idAssignment = this.props.assignment._id;
        if (this.state.fileData) {
            const objectFile = await this.handleUpload();
            if (objectFile) {
                this.props.submitAssignment({ file: objectFile, idAssignment: idAssignment });
            } else {
                this.props.onCancelSubmitAssignment();
                notification.error({ message: "Thất bại", description: 'Gặp lỗi khi tải file vui lòng thử lại' });
            }
        } else {
            this.props.onCancelSubmitAssignment();
            notification.warning({ message: "Chú ý", description: 'Vui lòng chọn file trước khi nộp bài' });
        }

    }
    commentFeedback = () => {
        const idAssignment = this.props.assignment._id;
        this.props.commentAssignmentGrade({ comment: this.state.comment, idAssignment: idAssignment });
    }



    render() {
        const { t } = this.props;
        return <Modal
            title={`[ Assignment ] ${this.props.assignment ? this.props.assignment.name : ' '}`}
            visible={this.props.visible}
            onCancel={this.props.handleCancelModal}
            footer={null}
        >
            {this.props.assignment ?
                (
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="Submission" key="1">
                            <div>
                                <div>{t('sbmit_stat')}</div>
                                <div style={{ margin: '10px 0' }}>
                                    <span style={{ fontWeight: 600 }}>Due date: </span>
                                    <span>{this.transTime(get(this.props.assignment, 'setting')?.expireTime)}</span>
                                </div>
                                <div style={{ margin: '10px 0' }}>
                                    <span style={{ fontWeight: 600 }}>Time remaining: </span>
                                    <span>{get(this.props.assignment, 'timingRemain')}</span>
                                </div>
                                {this.props.assignment.submission && (<div style={{ margin: '10px 0' }}>
                                    <span style={{ fontWeight: 600 }}>Last modified: </span>
                                    <span>{this.transTime(get(this.props.assignment, 'submission').submitTime)}</span>
                                </div>)}
                                {get(this.props.assignment, 'isCanSubmit') && (<div style={{ margin: '10px 0' }} >
                                    <span style={{ fontWeight: 600 }}>File submissions: </span>
                                    <Input type="file" onChange={e => this.handleProcessFile(e)} style={{ width: 200, borderRadius: 20, overflow: 'hidden' }} />
                                </div>)}
                                {
                                    (this.props.assignment.submission !== null) && <div style={{ margin: '10px 0' }}>
                                        <div style={{
                                            border: '1px dashed #cacaca',
                                            padding: '5px 20px',
                                            textAlign: 'center'
                                        }}>
                                            <img src={get(this.props.assignment.submission, 'file')?.type.includes('doc') ? word : get(this.props.assignment.submission, 'file')?.type == 'rar' ? rar : file} />
                                            <div>{get(this.props.assignment.submission, 'file')?.name}</div>
                                        </div>
                                    </div>
                                }


                            </div>
                            {
                                get(this.props.assignment, 'isCanSubmit') &&
                                <Row style={{ marginTop: 10 }}>
                                    <div>
                                        <Button type="primary" loading={this.props.isSubmitAssignment} onClick={this.handleSubmit} style={{ borderRadius: 20 }}>{t('submit_assign')}</Button>
                                    </div>
                                </Row>
                            }

                        </TabPane>
                        <TabPane tab="Requirement" key="2">
                            <div style={{ fontWeight: "700" }}>[Content requirement]</div>
                            <div dangerouslySetInnerHTML={{ __html: get(this.props.assignment, 'content') }} />
                            {/* <div>
                    {get(this.props.assignment, 'content')}
                </div> */}
                            <div style={{ fontWeight: "700" }}>File attachment</div>
                            <div style={{ height: 50 }}>
                                {
                                    (get(this.props.assignment, 'attachments') || []).map(f => {
                                        return <span style={{
                                            verticalAlign: '-webkit-baseline-middle',
                                            border: '1px dashed #cacaca',
                                            padding: '3px 10px',
                                            borderRadius: '20px',
                                        }}>
                                            {f.type.includes('doc') ? <img src={word} width={20} /> : <img src={pdf} width={20} />}<a href={f.path} style={{ marginLeft: 10 }}>{f.name}</a>
                                        </span>
                                    })
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="Grade" key="3">
                            {
                                get(this.props.assignment, 'gradeStatus') ? (<>
                                    <div>Grade status</div>
                                    <div>
                                        <span style={{ fontWeight: 600 }}>Grade: </span>
                                        <span>{get(get(this.props.assignment, 'submission')?.feedBack, 'grade')}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 600 }}>Grade on: </span>
                                        <span>{this.transTime(get(get(this.props.assignment, 'submission')?.feedBack, 'gradeOn'))}</span>
                                    </div>
                                    {
                                        (this.props.assignment.submission.feedBack.comment) ?
                                            (
                                                <div>
                                                    <span style={{ fontWeight: 600 }}>Comment: </span>
                                                    <span>{this.props.assignment.submission.feedBack.comment}</span>
                                                </div>
                                            )
                                            : (
                                                <>
                                                    <div>
                                                        <div style={{ marginBottom: 10 }}>Feedback comment</div>
                                                        <TextArea rows={2}
                                                            placeholder="Comment about grade..."
                                                            autoSize={{ minRows: 2, maxRows: 5 }}
                                                            showCount
                                                            onChange={e => {
                                                                this.setState({ comment: e.target.value })
                                                            }}
                                                        />
                                                    </div>
                                                    <Row style={{ marginTop: 10 }}>
                                                        <div>
                                                            <Button type="primary" loading={this.props.isCommentAssignment} onClick={this.commentFeedback} style={{ borderRadius: 20 }}>Send</Button>
                                                        </div>
                                                    </Row>
                                                </>
                                            )
                                    }
                                </>
                                )
                                    :
                                    (
                                        <div style={{ color: '#ff4000', fontStyle: 'italic' }}>Chưa chấm điểm</div>
                                    )
                            }
                        </TabPane>
                    </Tabs>
                ) :
                <Spin spinning>
                    <Alert
                        message="Lấy dữ liệu từ server"
                        description="Hoạt động có thể chậm do mạng..."
                        type="info"
                    />
                </Spin>
            }
        </Modal>
    }
}


export default withTranslation('translations')(AssignmentModal)
