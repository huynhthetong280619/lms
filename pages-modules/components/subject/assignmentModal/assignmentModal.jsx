import { get } from 'lodash';
import { withTranslation } from 'react-i18next';
import { Row, Input, Modal, Tabs, Button } from 'antd'
const { TextArea } = Input;
const { TabPane } = Tabs;
import restClient from '../../../../assets/common/core/restClient';
import { notifyError, notifyWarning } from '../../../../assets/common/core/notify.js';
import downloadFile from '../../../../assets/common/core/downloadFile.js';
import moment from 'moment'
import file from '../../../../assets/images/contents/file.png'
import word from '../../../../assets/images/contents/word.png'
import rar from '../../../../assets/images/contents/rar.png'
import pdf from '../../../../assets/images/contents/pdf.png'
import Loading from '../../loading/loading.jsx'

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

    handleSubmit = async () => {
        this.props.onSubmitAssignment();
        const idAssignment = this.props.assignment._id;
        if (this.state.fileData) {
            const objectFile = await restClient.asyncUploadFile(this.state.fileData);
            if (objectFile) {
                this.props.submitAssignment({ file: objectFile, idAssignment: idAssignment });
            } else {
                this.props.onCancelSubmitAssignment();
                notifyError("Thất bại", 'Gặp lỗi khi tải file vui lòng thử lại');
            }
        } else {
            this.props.onCancelSubmitAssignment();
            notifyWarning("Chú ý", 'Vui lòng chọn file trước khi nộp bài');
        }

    }
    commentFeedback = () => {
        const idAssignment = this.props.assignment._id;
        this.props.commentAssignmentGrade({ comment: this.state.comment, idAssignment: idAssignment });
    }

    handleCancel = () => {
        this.setState({ fileData: null, comment: '' });
        this.props.handleCancelModal();
    }



    render() {
        const { t } = this.props;
        return <Modal
            title={`[ Assignment ] ${this.props.assignment ? this.props.assignment.name : ' '}`}
            visible={this.props.visible}
            onCancel={() => this.handleCancel()}
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
                                            <a>
                                                <span onClick={() => downloadFile(get(this.props.assignment.submission, 'file'))}>
                                                    {get(this.props.assignment.submission, 'file')?.name}.{get(this.props.assignment.submission, 'file')?.type}
                                                </span>
                                            </a>
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
                                            {f.type.includes('doc')
                                                ? <img src={word} width={20} /> : <img src={pdf} width={20} />}
                                            <a style={{ marginLeft: 10 }}>
                                                <span onClick={() => downloadFile(f)}>{f.name}.{f.type}</span>
                                            </a>
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
                <Loading />
            }
        </Modal>
    }
}


export default withTranslation('translations')(AssignmentModal)
