import React from 'react'
import { Row, Col, Tooltip, Timeline, Drawer, Button } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import styles from './styles.scss'
import './overwrite.css'
import { get, pick, head } from 'lodash';
import forum from '../../../assets/images/contents/forum.png'
import manageScore from '../../../assets/images/contents/manage-score.png'
import { withTranslation } from 'react-i18next';
import restClient from '../../../assets/common/core/restClient';
import { MoreOutlined } from '@ant-design/icons'
require('isomorphic-fetch');
import 'react-day-picker/lib/style.css';
import newInfo from '../../../assets/images/contents/new.png';
import deadline from '../../../assets/images/courses/deadline.png'
import { NotificationManager } from 'react-notifications';
import Deadline from '../../components/deadlines'
import Widget from '../widget';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../fontAwesomeIcon'
import AddQuiz from './addQuiz/addQuiz.jsx';
import AddSurvey from './addSurvey/addSurvey.jsx';
import AddAssignment from './addAssignment/addAssignment.jsx';
import AddInformation from './addInformation/addInformation.jsx';
import AddTimeline from './addTimeline/addTimeline.jsx'
import AddFile from './addFile/addFile.jsx'
import AddForum from './addForum/addForum.jsx'
import AssignmentModal from './assignmentModal/assignmentModal.jsx';
import ImportSubject from './importSubject/importSubject.jsx';
import ExportSubject from './exportSubject/exportSubject.jsx';
import downloadFile from '../../../assets/common/core/downloadFile.js';
import {
    ExportOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { notifyError, notifySuccess } from '../../../assets/common/core/notify';

import HeadPage from '../headPage/headPage.jsx';

class Subject extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            timelines: [],
            updateTimelines: [],
            isTeacher: false,
            assignmentRequirement: null,
            lstTimelines: [],
            lstQuizzes: [],
            lstSurveys: [],
            isFocusInformation: false,
            isFocusFile: false,
            isFocusTimeline: false,
            isFocusAssignment: false,
            isFocusQuiz: false,
            isFocusSurvey: false,
            isFocusForum: false,
            isImportSubject: false,
            deadlines: [],
            dueTo: [],
            idTimelineRequired: null,
            orderTl: false,
            isLoading: false,
            isSubmitAssignment: false,
            isCommentAssignment: false,
            isExe: false,
            isTeacherPrivilege: false,
            isOpenDrawerCreate: false,
            isOpenDrawerContent: false,
            titleDrawCreate: this.props.t('add_content').toUpperCase(),
            isOnMovement: false,
            isOnEdit: false,
            idInformationFocus: null,
            idTimelineFocus: null,
            idSurveyFocus: null,
            idAssignmentFocus: null,
            idExamFocus: null,
            idForumFocus: null,
            idFileFocus: null,
            isExportSubject: false,
        }
    }

    async componentDidMount() {
        //console.log('componentDidMount', this.props.subject, this.props.lstQuizzes, this.props.lstTimeline);

        const user = JSON.parse(localStorage.getItem('user'));

        if (user?.idPrivilege == 'student') {
            this.setState({
                isTeacherPrivilege: false,
                deadlines: this.props.lstDeadline,
                dueTo: this.props.lstDueTo
            })
        }

        if (user?.idPrivilege == 'teacher') {
            this.setState({
                isTeacherPrivilege: true
            })
        }

        this.setState({
            lstTimelines: this.props.lstTimeline,
        })



        this.setState({
            lstQuizzes: this.props.lstQuizzes
        })

        this.setState({
            lstSurveys: this.props.lstSurveys
        })


        this.setState({
            timelines: get(this.props.subject, 'timelines'),

        })

    }

    handleCancelModal = () => {
        this.setState({ visible: false, assignmentRequirement: null })
    };

    handleOnDragEnd = async (result) => {
        //console.log('handleOnDragEnd', result)
        if (!result.destination) return;

        const items = Array.from(this.state.timelines);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        this.setState({
            timelines: items
        });

        let uptTimelines = [];
        uptTimelines = items.map(item => pick(item, ['_id', 'index']));

        const cv = uptTimelines.map((item, index) => {
            return {
                ...item,
                index: index + 1,
                //name: `Tuần ${index < 10 ? 0 : ''}` + (index + 1)
            }
        })

        //console.log('cv', cv)
        this.setState({ updateTimelines: cv });
        //console.log('items', items, cv);
    }

    updateTimelinesIndex = async () => {
        await restClient.asyncPost(`/subject/${this.props.idSubject}/index`, this.state.updateTimelines, this.props.token)
            .then(res => {
                if (!res.hasError) {
                    notifySuccess(this.props.t('success'), get(res, 'data').message);
                    this.setState({
                        timelines: get(res, 'data').timelines
                    })
                    return true;
                }
                return false
            })


    }

    deleteExercise = async () => {

    }

    deleteQuiz = async () => {

    }

    deleteForum = async () => {

    }

    onSubmitAssignment = () => {
        this.setState({ isSubmitAssignment: true });
    }
    onCancelSubmitAssignment = () => {
        this.setState({ isSubmitAssignment: false });
    }

    getRequirementAssignment = async ({ idAssignment, idTimeline }) => {
        this.setState({
            visible: true
        });
        await restClient.asyncGet(`/assignment/${idAssignment}?idSubject=${this.props.idSubject}&idTimeline=${idTimeline}`, this.props.token)
            .then(res => {
                if (!res.hasError) {
                    //console.log('getRequirementAssignment', res);

                    this.setState({
                        assignmentRequirement: get(res, 'data').assignment,
                        idTimelineRequired: idTimeline
                    });
                } else {
                    notifyError(this.props.t('failure'), res.data.message);
                }
            })

    }

    submissionFile = async ({ file, idAssignment }) => {
        await restClient.asyncPost(`/assignment/${idAssignment}/submit`, { idSubject: this.props.idSubject, idTimeline: this.state.idTimelineRequired, file: file }, this.props.token)
            .then(res => {
                this.setState({ isSubmitAssignment: false });
                if (!res.hasError) {
                    notifySuccess(this.props.t('success'), this.props.t('submit_success'))
                    //console.log('Notification', res)
                    let submission = res.data.submission;
                    //console.log('OLD-ASSIGNMENT', this.state.assignmentRequirement);
                    this.setState({ assignmentRequirement: { ...this.state.assignmentRequirement, submission: submission } }
                        , () => {
                            //console.log('New-ASSIGNMENT', this.state.assignmentRequirement);
                        });
                } else {
                    notifyError(this.props.t('failure'), res.data.message);
                }
            })
    }

    commentAssignmentGrade = async ({ comment, idAssignment }) => {
        this.setState({ isCommentAssignment: true });
        await restClient.asyncPost(`/assignment/${idAssignment}/comment`, { idSubject: this.props.idSubject, idTimeline: this.state.idTimelineRequired, comment: comment }, this.props.token)
            .then(res => {
                this.setState({ isCommentAssignment: false });
                if (!res.hasError) {
                    notifySuccess(this.props.t('success'), res.data.message)
                    //console.log('Notification', res)
                    let submission = res.data.submission;
                    //console.log('OLD-ASSIGNMENT', this.state.assignmentRequirement);
                    this.setState({ assignmentRequirement: { ...this.state.assignmentRequirement, submission: submission } }
                        , () => {
                            //console.log('New-ASSIGNMENT', this.state.assignmentRequirement);
                        });
                } else {
                    notifyError(this.props.t('failure'), res.data.message);
                }
            })
    }

    createFile = ({ file, idTimeline }) => {

        notifySuccess(this.props.t('success'), this.props.t('add_document_success'))

        let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)

        head(timelineUpdate).files.push(file)

        //console.log(timelineUpdate)

        this.setState({
            timelines: [...this.state.timelines],
        }, () => {
            //console.log(this.state.timelines)
            this.closeDrawerCreate();
        })
    }

    updateFile = ({ file, idTimeline }) => {
        notifySuccess(this.props.t('success'), this.props.t('update_document_success'))
        let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)
        let target = head(timelineUpdate).files.find(({ _id }) => _id === file._id);
        //console.log('targetFile', target);
        let index = head(timelineUpdate).files.indexOf(target);
        head(timelineUpdate).files.splice(index, 1, file);
        this.setState({
            timelines: [...this.state.timelines],
        }, () => {
            //console.log(this.state.timelines)
            this.closeDrawerCreate();
        })
    }

    createQuiz = ({ exam, idTimeline }) => {

        notifySuccess(this.props.t('success'), this.props.t('add_quiz_success'))
        let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        head(timelineUpdate).exams.push(exam)


        //console.log(timelineUpdate)

        this.setState({
            timelines: [...this.state.timelines],
        }, () => {
            //console.log(this.state.timelines)
            this.closeDrawerCreate();
        })
    }

    updateQuiz = ({ exam, idTimeline }) => {
        notifySuccess(this.props.t('success'), this.props.t('update_quiz_success'))
        let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        //console.log('updateExam', exam);
        let target = head(timelineUpdate).exams.find(({ _id }) => _id === exam._id);
        //console.log('targetExam', target);
        let index = head(timelineUpdate).exams.indexOf(target);

        head(timelineUpdate).exams.splice(index, 1, exam);

        this.setState({
            timelines: [...this.state.timelines],
        }, () => {
            //console.log(this.state.timelines)
            this.closeDrawerCreate();
        })
    }

    onUploadFile = () => {
        this.setState({
            isLoading: true
        })
    }
    onCancelUploadFile = () => {
        this.setState({
            isLoading: false
        })
    }

    createAssignment = async ({ assignment, idTimeline }) => {
        notifySuccess(this.props.t('success'), this.props.t('add_quiz_assign'))
        let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)
        head(timelineUpdate).assignments.push(assignment)


        //console.log(timelineUpdate)

        this.setState({
            timelines: [...this.state.timelines],
        }, () => {
            //console.log(this.state.timelines)
            this.closeDrawerCreate();
        })
    }

    updateAssignment = ({ assignment, idTimeline }) => {
        notifySuccess(this.props.t('success'), this.props.t('update_assign_success'))
        let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        let target = head(timelineUpdate).assignments.find(({ _id }) => _id === assignment._id);
        //console.log('targetAssignment', target);
        let index = head(timelineUpdate).assignments.indexOf(target);

        head(timelineUpdate).assignments.splice(index, 1, assignment);

        this.setState({
            timelines: [...this.state.timelines],
        }, () => {
            //console.log(this.state.timelines)
            this.closeDrawerCreate();
        })
    }

    createSurvey = ({ survey, idTimeline }) => {

        notifySuccess(this.props.t('success'), this.props.t('add_quiz_survey'))
        let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        head(timelineUpdate).surveys.push(survey)


        //console.log(timelineUpdate)

        this.setState({
            timelines: [...this.state.timelines],
        }, () => {
            //console.log(this.state.timelines)
            this.closeDrawerCreate();
        })

    }
    updateSurvey = ({ survey, idTimeline }) => {

        notifySuccess(this.props.t('success'), this.props.t('add_quiz_survey'))
        let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)

        //console.log('timelineUpdate', timelineUpdate)
        let target = head(timelineUpdate).surveys.find(({ _id }) => _id === survey._id);
        //console.log('targetSurvey', target);
        let index = head(timelineUpdate).surveys.indexOf(target);

        head(timelineUpdate).surveys.splice(index, 1, survey);


        //console.log(timelineUpdate)

        this.setState({
            timelines: [...this.state.timelines],
        }, () => {
            //console.log(this.state.timelines)
            this.closeDrawerCreate();
        })
    }

    createInformation = async ({ information, idTimeline }) => {
        this.setState({ isLoading: true });
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: idTimeline,
            data: information
        }
        //console.log('createInformation', data);
        await restClient.asyncPost('/information', data, this.props.token)
            .then(res => {
                this.setState({ isLoading: false });
                if (!res.hasError) {
                    notifySuccess(this.props.t('success'), this.props.t('add_quiz_information'))
                    //console.log('information', res)
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)
                    head(timelineUpdate).information.push(res.data.information)
                    this.setState({
                        timelines: [...this.state.timelines],
                        isOpenDrawerCreate: false
                    })
                } else {
                    notifyError(this.props.t('failure'), res.data.message);
                }
            })
    }

    createForum = async ({ forum, idTimeline }) => {
        notifySuccess(this.props.t('success'), this.props.t('add_forum_timeline'))

        let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)

        head(timelineUpdate).forums.push(forum)

        this.setState({
            timelines: [...this.state.timelines],
        }, () => {
            this.closeDrawerCreate();
        })
    }

    updateForum = ({ forum, idTimeline }) => {

        notifySuccess(this.props.t('success'), this.props.t('update_forum_success'))
        let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)

        let target = head(timelineUpdate).forums.find(({ _id }) => _id === forum._id);
        //console.log('targetForum', target);
        let index = head(timelineUpdate).forums.indexOf(target);

        head(timelineUpdate).forums.splice(index, 1, forum);

        //console.log(timelineUpdate)

        this.setState({
            timelines: [...this.state.timelines],
        }, () => {
            //console.log(this.state.timelines)
            this.closeDrawerCreate();
        })
    }

    createTimeline = async (timeline) => {
        this.setState({
            isLoading: true
        })

        const data = {
            idSubject: this.props.idSubject,
            data: timeline
        }

        await restClient.asyncPost('/timeline', data, this.props.token)
            .then(res => {
                //console.log('Timeline', res)
                this.setState({ isLoading: false });
                if (!res.hasError) {
                    notifySuccess(this.props.t('success'), this.props.t('add_quiz_timeline'))
                    this.setState({
                        timelines: [...this.state.timelines, get(res, 'data').timeline],
                        lstTimelines: [...this.state.lstTimelines, {
                            _id: get(res, 'data').timeline._id,
                            isDeleted: get(res, 'data').timeline.isDeleted,
                            name: get(res, 'data').timeline.name,
                            description: get(res, 'data').timeline.description
                        }],
                        isOpenDrawerCreate: false
                    })

                } else {
                    notifyError(this.props.t('failure'), res.data.message);
                }
            })
    }


    focusFile = (idFile, idTimeline) => {
        this.setState({
            isFocusFile: true,
            idFileFocus: idFile,
            idTimelineRequired: idTimeline
        })
    }

    focusInformation = (idInformation) => {
        //console.log('Add information', idInformation)
        this.setState({
            isFocusInformation: true,
            idInformationFocus: idInformation
        })
    }

    focusTimeline = (idTimeline) => {
        this.setState({
            isFocusTimeline: true,
            idTimelineFocus: idTimeline,
        })
    }

    focusAssignment = (idAssignment, idTimeline) => {
        this.setState({
            isFocusAssignment: true,
            idTimelineRequired: idTimeline,
            idAssignmentFocus: idAssignment
        })
    }

    focusQuiz = (idExam, idTimeline) => {
        this.setState({
            isFocusQuiz: true,
            idTimelineRequired: idTimeline,
            idExamFocus: idExam,
        })
    }

    focusSurvey = (idSurvey, idTimeline) => {
        //console.log('idTimeline', idTimeline)
        this.setState({
            isFocusSurvey: true,
            idSurveyFocus: idSurvey,
            idTimelineRequired: idTimeline
        })
    }


    focusForum = (idForum, idTimeline) => {
        this.setState({
            isFocusForum: true,
            idForumFocus: idForum,
            idTimelineRequired: idTimeline
        })
    }

    importSubject = () => {
        this.setState({
            isImportSubject: true
        })
    }

    exportSubject = () => {
        this.setState({
            isExportSubject: true
        })
    }

    onExe = (status) => {
        this.setState({
            isExe: status
        })
    }

    turnOnOffEditMode = () => {
        this.setState({
            isOnEdit: !this.state.isOnEdit
        })
    }

    edit = (id) => {
        //console.log('Edit', id)
    }

    lock = async (url) => {

        await restClient.asyncPut(url, this.props.token)
            .then(res => {
                //console.log('Lock', res)

            })
    }

    unlock = async (url) => {

        await restClient.asyncPut(url, this.props.token)
            .then(res => {
                //console.log('Lock', res)
            })

    }

    openDrawerContent = () => {
        this.setState({
            isOpenDrawerContent: true
        })
    }

    closeDrawerContent = () => {
        this.setState({
            isOpenDrawerContent: false
        })
    }


    openDrawerCreate = (title) => {
        this.setState({
            isOpenDrawerCreate: true,
            titleDrawCreate: title
        })
    }

    closeDrawerCreate = () => {
        this.setState({
            isOpenDrawerCreate: false,
            isFocusInformation: false,
            isFocusFile: false,
            isFocusTimeline: false,
            isFocusAssignment: false,
            isFocusQuiz: false,
            isFocusSurvey: false,
            isFocusForum: false,
            isImportSubject: false,
            isExportSubject: false,
            isLoading: false,
            idInformationFocus: null,
            idSurveyFocus: null,
            idAssignmentFocus: null,
            idTimelineFocus: null,
            idTimelineRequired: null,
            idExamFocus: null,
            idForumFocus: null,
            idFileFocus: null,
        })
    }

    handleImportSubject = async (data) => {
        this.setState({ isLoading: true });
        await restClient.asyncPost(`/subject/${this.props.idSubject}/import-teacher`, data, this.props.token)
            .then(res => {
                this.setState({ isLoading: false });
                //console.log('res', res);
                if (!res.hasError) {
                    this.setState({
                        lstTimelines: res.data.timelines.map(value => { return { _id: value._id, name: value.name } }),
                        lstSurveys: res.data.surveyBank,
                        lstQuizzes: res.data.quizBank,
                        timelines: res.data.timelines
                    });
                    notifySuccess(this.props.t('success'), res.data.message);
                    this.closeDrawerCreate();
                } else {
                    notifyError(this.props.t('failure'), res.data.message);
                }
            });
    }



    render() {

        const { t } = this.props;

        const timelineTemplate = (idTimeline, index, name, description, assignments, exams, forums, information, files, surveys, flagMove) => (
            <div style={{ margin: '0 10px 10px 10px', border: `${flagMove ? '1px dashed #d9d9d9' : '2px solid #cacaca'}` }}>
                <div style={{ position: 'relative' }}>
                    <Row
                        style={{
                            padding: 10,
                            background: "#cacaca",
                            marginBottom: 30,
                            fontWeight: 600,
                            cursor: this.state.isTeacher && 'all-scroll'
                        }}
                    >
                        <Col span={10}>
                            {
                                // name.toUpperCase()
                                `${t('week')} ${index < 9 ? ('0' + (index + 1)) : (index + 1)}: ${name}`
                            }
                        </Col>
                        <Col span={10}>
                            {
                                // description.toUpperCase()
                                description
                            }
                        </Col>
                        {/* <Col span={12} style={{ textAlign: 'right' }}>
                            {
                                this.state.isTeacher ? <MoreOutlined /> : null
                            }
                        </Col> */}
                    </Row>
                    {

                        information != null ? (
                            <Row style={{ paddingLeft: 23 }}>
                                <Timeline>
                                    {information.map(info => {
                                        return (
                                            <Timeline.Item key={info._id} dot={info.isNew && <><img src={newInfo} style={{
                                                width: "66px",
                                                position: "absolute",
                                                top: "-15px",
                                                left: "-20px"
                                            }} /></>} >
                                                <div style={{
                                                    fontSize: "18px",
                                                    fontWeight: 600
                                                }}>{info.name}</div>
                                                <div style={{
                                                    fontStyle: 'italic',
                                                    paddingLeft: '18px',
                                                    color: '#2ecc71',
                                                    fontWeight: 400

                                                }}>{info.content}</div>
                                            </Timeline.Item>
                                        )
                                    })}
                                </Timeline>
                            </Row>
                        ) : null
                    }

                    {
                        surveys != null ? (
                            surveys.map(survey => {
                                return (
                                    <Row style={{ marginBottom: 10 }} key={survey._id} >
                                        <Col span={2} style={{
                                            textAlign: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <i>
                                                <FontAwesomeIcon icon="poll" style={{ width: 40, height: 40, color: '#ff4000' }} />
                                            </i>
                                        </Col>
                                        <Col span={18} style={{
                                            fontSize: '20px',
                                            alignSelf: 'center',
                                            marginLeft: '10px'
                                        }}>
                                            <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} href={`/surveys/${survey._id}?idSubject=${this.props.idSubject}&idTimeline=${idTimeline}`}>{survey.name}</a>

                                        </Col>
                                        <Col span={2} style={{
                                            fontSize: '20px',
                                            alignSelf: 'center',
                                            marginLeft: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-evenly'
                                        }}>
                                            {this.state.isOnEdit && (<Tooltip title={t('edit_survey')}>
                                                <a>
                                                    <FontAwesomeIcon icon="edit" onClick={() => { this.focusSurvey(survey._id, idTimeline); this.openDrawerCreate(t('edit_survey').toUpperCase()) }} />
                                                </a>
                                            </Tooltip>)}
                                            {this.state.isTeacherPrivilege && (!survey.isDeleted ? <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} /> : <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />)}
                                        </Col>
                                    </Row>
                                )
                            })

                        ) : null
                    }
                    {
                        files != null ? (
                            files.map(f => {
                                return (
                                    <Row style={{ marginBottom: 10 }} key={f._id} >
                                        <Col span={2} style={{
                                            textAlign: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <i>
                                                <FontAwesomeIcon icon={`${f.type == 'webm' ? 'file-video' : 'file-alt'}`} style={{ width: 40, height: 40, color: '#273c75' }} />
                                            </i>
                                        </Col>
                                        <Col span={18} style={{
                                            fontSize: '20px',
                                            alignSelf: 'center',
                                            marginLeft: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} >
                                                <span onClick={() => downloadFile(f)}>{f.name}.{f.type}</span>
                                            </a>

                                        </Col>
                                        <Col span={2} style={{
                                            fontSize: '20px',
                                            alignSelf: 'center',
                                            marginLeft: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-evenly'
                                        }}>
                                            <Tooltip title={t('view_online')}>
                                                <a href={`/view?idSubject=${this.props.idSubject}&idTimeline=${idTimeline}&idFile=${f._id}`} target='_blank'>
                                                    <FontAwesomeIcon icon="external-link-alt" />
                                                </a>
                                            </Tooltip>
                                            {this.state.isOnEdit && (<Tooltip title={t('edit_file')}>
                                                <a>
                                                    <FontAwesomeIcon icon="edit" onClick={() => { this.focusFile(f._id, idTimeline); this.openDrawerCreate(t('edit_file').toUpperCase()) }} />
                                                </a>
                                            </Tooltip>)}

                                            {this.state.isTeacherPrivilege && (!f.isDeleted ? <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} /> : <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />)}
                                        </Col>
                                    </Row>
                                )
                            })

                        ) : null
                    }


                    {
                        assignments != null ? (
                            assignments.map(assign => (
                                !this.state.isTeacherPrivilege ?
                                    <Row style={{ marginBottom: 10, position: 'relative', cursor: 'pointer' }} onClick={() => {
                                        this.getRequirementAssignment({ idAssignment: assign._id, idTimeline: idTimeline });
                                    }} key={assign._id}>

                                        <Col span={2} style={{
                                            textAlign: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <i>
                                                <FontAwesomeIcon icon="tasks" style={{ width: 40, height: 40, color: '#009432' }} />
                                            </i>
                                        </Col>
                                        <Col span={20} style={{
                                            fontSize: '20px',
                                            alignSelf: 'center',
                                            marginLeft: '10px'

                                        }}>
                                            <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} >{assign.name}</a>
                                        </Col>
                                    </Row>
                                    :

                                    <Row style={{ marginBottom: 10 }} key={assign._id}>
                                        <Col span={2} style={{
                                            textAlign: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <i>
                                                <FontAwesomeIcon icon="tasks" style={{ width: 40, height: 40, color: '#009432' }} />
                                            </i>
                                        </Col>
                                        <Col span={18} style={{
                                            fontSize: '20px',
                                            alignSelf: 'center',
                                            marginLeft: '10px'
                                        }}>
                                            <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} href={`/manage/${assign._id}?idSubject=${this.props.idSubject}&idTimeline=${idTimeline}`}>{assign.name}</a>

                                        </Col>
                                        <Col span={2} style={{
                                            fontSize: '20px',
                                            alignSelf: 'center',
                                            marginLeft: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-evenly'
                                        }}>
                                            {this.state.isOnEdit && (<Tooltip title={t('edit_assignment')}>
                                                <a>
                                                    <FontAwesomeIcon icon="edit" onClick={() => { this.focusAssignment(assign._id, idTimeline); this.openDrawerCreate(t('edit_assignment').toUpperCase()) }} />
                                                </a>
                                            </Tooltip>)}

                                            {this.state.isTeacherPrivilege && (!assign.isDeleted ? <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} /> : <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />)}
                                        </Col>
                                    </Row>
                            ))

                        ) : null
                    }

                    {
                        forums != null ? (
                            forums.map(fr => (
                                <Row style={{ marginBottom: 10, }} key={fr._id}>
                                    <Col span={2} style={{
                                        textAlign: 'center',
                                        alignSelf: 'center'
                                    }}>
                                        <i>
                                            <img src={forum} width={36} />
                                        </i>
                                    </Col>
                                    <Col span={18} style={{
                                        fontSize: '20px',
                                        alignSelf: 'center',
                                        marginLeft: '10px'
                                    }}>
                                        <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} href={`/forums/${fr._id}?idSubject=${this.props.idSubject}&idTimeline=${idTimeline}`}>{fr.name}</a>

                                    </Col>
                                    <Col span={2} style={{
                                        fontSize: '20px',
                                        alignSelf: 'center',
                                        marginLeft: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-evenly'
                                    }}>
                                        {this.state.isOnEdit && (<Tooltip title={t('edit_forum')}>
                                            <a>
                                                <FontAwesomeIcon icon="edit" onClick={() => { this.focusForum(fr._id, idTimeline); this.openDrawerCreate(t('edit_forum').toUpperCase()) }} />
                                            </a>
                                        </Tooltip>)}
                                        {this.state.isTeacherPrivilege && (!fr.isDeleted ? <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} /> : <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />)}
                                    </Col>

                                </Row>
                            ))

                        ) : null
                    }

                    {
                        exams != null ? (
                            exams.map(ex => (
                                <Row style={{ marginBottom: 10 }} key={ex._id}>
                                    <Col span={2} style={{
                                        textAlign: 'center',
                                        alignSelf: 'center'
                                    }}>
                                        <i>
                                            <FontAwesomeIcon icon="spell-check" style={{ width: 40, height: 40, color: '#F79F1F' }} />
                                        </i>
                                    </Col>
                                    <Col span={18} style={{
                                        fontSize: '20px',
                                        alignSelf: 'center',
                                        marginLeft: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} href={`/quizzis/${ex._id}?idSubject=${this.props.idSubject}&idTimeline=${idTimeline}`}>{ex.name}</a>
                                    </Col>

                                    <Col span={2} style={{
                                        fontSize: '20px',
                                        alignSelf: 'center',
                                        marginLeft: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-evenly'
                                    }}>
                                        {this.state.isOnEdit && (<Tooltip title={t('edit_exam')}>
                                            <a>
                                                <FontAwesomeIcon icon="edit" style={{ color: '#3498db' }} onClick={() => { this.focusQuiz(ex._id, idTimeline); this.openDrawerCreate(t('edit_exam').toUpperCase()) }} />
                                            </a>
                                        </Tooltip>)}

                                        {this.state.isTeacherPrivilege && ((!ex.isDeleted) ? <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} /> : <FontAwesomeIcon icon="lock" style={{ color: '#e84118' }} />)}
                                    </Col>
                                    {/* <Col span={2} style={{
                                        fontSize: '20px',
                                        alignSelf: 'center',
                                        marginLeft: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        {this.state.isOnEdit && <Tooltip title="Edit Mode"><FontAwesomeIcon icon="edit" style={{ color: '#3498db' }} /></Tooltip>}
                                        {this.state.isOnEdit && <Tooltip title="Lock Mode"><FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} /></Tooltip>}</Col> */}
                                </Row>
                            ))

                        ) : null
                    }

                </div>

            </div >
        );

        const contentMovement = (
            <DragDropContext onDragEnd={this.handleOnDragEnd}>
                <Droppable droppableId="characters">
                    {(provided) => (
                        <Col span={this.state.isTeacherPrivilege ? 21 : 12}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
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
                                    <span style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject.toUpperCase()}</span>
                                </div>

                            </div>

                            {
                                this.state.timelines.map(({ _id, name, description, assignments, exams, forums, information, files, surveys }, index) => {
                                    //console.log('assignment', assignments, exams, forums, information, surveys)
                                    return (
                                        <Draggable key={_id} draggableId={_id} index={index} >
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {timelineTemplate(_id, index, name, description, assignments, exams, forums, information, files, surveys, true)}
                                                </div>
                                            )}
                                        </Draggable>)
                                })
                            }
                        </Col>
                    )}
                </Droppable>
            </DragDropContext>

        )

        const contentNormal = (
            <Col span={this.state.isTeacherPrivilege ? 21 : 12}
                style={{
                    margin: '10px',
                    background: '#fff',
                    minHeight: '200px'
                }}>

                <div>
                    <div style={{
                        textAlign: 'center',
                        padding: '10px 0'
                    }}>
                        <i>
                        </i>
                        <span style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject.toUpperCase()}</span>
                    </div>

                </div>
                {
                    this.state.isTeacherPrivilege ? <Row style={{ marginBottom: 10, marginLeft: 10 }} >
                        <Col span={6} style={{
                            fontSize: '20px',
                        }}>
                            <a href={`/students?idSubject=${this.props.idSubject}`}><i style={{ marginRight: 10 }}>
                                <FontAwesomeIcon icon="user-secret" style={{ width: 40, height: 40 }} />
                            </i>{t('manage_student')}</a>
                        </Col>
                    </Row>

                        :

                        <Row style={{ marginBottom: 10 }} >
                            <Col span={2} style={{
                                textAlign: 'center',
                                alignSelf: 'center'
                            }}>
                                <i>
                                    <img src={manageScore} width={60} />
                                </i>
                            </Col>
                            <Col span={20} style={{
                                fontSize: '20px',
                                alignSelf: 'center',
                                marginLeft: '10px'
                            }}>
                                <a href={`/points/${this.props.idSubject}`}>{t('manage_point')}</a>
                            </Col>
                        </Row>

                }

                {
                    this.state.timelines.map(({ _id, name, description, assignments, exams, forums, information, files, surveys }, index) => (
                        <div key={_id}>
                            {timelineTemplate(_id, index, name, description, assignments, exams, forums, information, files, surveys, false)}
                        </div>
                    )
                    )
                }
            </Col>
        )

        //console.log('attachments', get(this.state.assignmentRequirement, 'attachments'))
        return (
            <>
                <HeadPage title={this.props.nameSubject} />
                <Drawer
                    title={t('manage_content')}
                    placement="right"
                    closable={false}
                    onClose={this.closeDrawerContent}
                    visible={this.state.isOpenDrawerContent}
                    key="right"
                    width={540}
                    style={{ textAlign: 'center' }}
                >

                    <Row style={{ justifyContent: 'space-around' }}>
                        <Col span={6} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#192a56',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => {
                            this.openDrawerCreate(this.props.t('create_information').toUpperCase());
                            this.focusInformation()
                        }}>
                            {t('information')}
                        </Col>
                        <Col span={6} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#44bd32',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }}
                            onClick={() => {
                                this.openDrawerCreate(this.props.t('create_document').toUpperCase());
                                this.focusFile()
                            }}>
                            {t('document')}
                        </Col>
                        <Col span={6} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#e84118',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => {
                            this.openDrawerCreate(this.props.t('create_assign').toUpperCase());
                            this.focusAssignment();
                        }}>
                            {t('exercise')}
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: 'space-around', marginTop: '10px' }}>
                        <Col span={6} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#7f8fa6',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => {
                            this.openDrawerCreate(this.props.t('create_quiz').toUpperCase());
                            this.focusQuiz();
                        }}>
                            {t('quiz')}
                        </Col>
                        <Col span={6} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#3c40c6',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => {
                            this.openDrawerCreate(this.props.t('create_survey').toUpperCase());
                            this.focusSurvey();
                        }}>
                            {t('survey')}
                        </Col>
                        <Col span={6} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#ffa801',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => {
                            this.openDrawerCreate(this.props.t('create_timeline').toUpperCase());
                            this.focusTimeline()
                        }}>
                            {t('timeline')}
                        </Col>


                    </Row>

                    <Row style={{ justifyContent: 'space-around', marginTop: '10px' }}>
                        <Col span={6} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#ffa801',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => {
                            this.openDrawerCreate(this.props.t('create_forum').toUpperCase());
                            this.focusForum();
                        }}>
                            {t('forum')}
                        </Col>
                    </Row>

                    <Row>
                        <div style={{
                            border: "2px solid #cacaca",
                            padding: "20px 0",
                            borderRadius: "11px",
                            position: 'relative',
                            margin: '20px',
                            width: '100%'
                        }}>
                            <h2>{t('h1')}</h2>
                            <p style={{
                                fontStyle: 'italic',
                                color: '#9d9393'
                            }}>{t('h2')}</p>
                            <p style={{
                                fontStyle: 'italic',
                                color: '#9d9393'
                            }}>{t('h3')} </p>
                            <p style={{
                                fontStyle: 'italic',
                                color: '#9d9393'
                            }}>{t('h4')}</p>
                            <p style={{
                                fontStyle: 'italic',
                                color: '#9d9393'
                            }}>{t('h5')}</p>
                            <p style={{
                                fontStyle: 'italic',
                                color: '#9d9393'
                            }}>{t('h6')}</p>
                        </div>
                    </Row>
                    <Row>
                        <Col span={12} className="action-select-add-content" >
                            <Button
                                type='primary'
                                size='large'
                                icon={<UploadOutlined />}
                                onClick={() => {
                                    this.openDrawerCreate(this.props.t('import_data').toUpperCase());
                                    this.importSubject()
                                }}
                            > {this.props.t('import').toUpperCase()}</Button>

                        </Col>
                        <Col span={12} className="action-select-add-content" >
                            <Button
                                onClick={() => {
                                    this.openDrawerCreate(this.props.t('export_data').toUpperCase());
                                    this.exportSubject()
                                }}
                                type='primary'
                                size='large'
                                icon={<ExportOutlined />}
                            > {this.props.t('export').toUpperCase()}</Button>
                        </Col>
                    </Row>



                </Drawer>
                <Drawer
                    title={this.state.titleDrawCreate}
                    placement="left"
                    onClose={this.closeDrawerCreate}
                    visible={this.state.isOpenDrawerCreate}
                    key="left"
                    width={540}
                    style={{ textAlign: 'center' }}
                >
                    {this.state.isFocusQuiz && (<AddQuiz lstQuizzes={this.state.lstQuizzes} lstTimelines={this.state.lstTimelines} createQuiz={this.createQuiz} updateQuiz={this.updateQuiz} idSubject={this.props.idSubject} idTimeline={this.state.idTimelineRequired} idExam={this.state.idExamFocus} token={this.props.token} />)}
                    {this.state.isFocusSurvey && (<AddSurvey lstTimelines={this.state.lstTimelines} lstSurveys={this.state.lstSurveys} createSurvey={this.createSurvey} updateSurvey={this.updateSurvey} idSubject={this.props.idSubject} idTimeline={this.state.idTimelineRequired} idSurvey={this.state.idSurveyFocus} token={this.props.token} />)}
                    {this.state.isFocusAssignment && (<AddAssignment lstTimelines={this.state.lstTimelines} createAssignment={this.createAssignment} updateAssignment={this.updateAssignment} idSubject={this.props.idSubject} idTimeline={this.state.idTimelineRequired} idAssignment={this.state.idAssignmentFocus} token={this.props.token} />)}
                    {this.state.isFocusFile && (<AddFile lstTimelines={this.state.lstTimelines} createFile={this.createFile} updateFile={this.updateFile} idSubject={this.props.idSubject} idTimeline={this.state.idTimelineRequired} idFile={this.state.idFileFocus} token={this.props.token} />)}
                    {this.state.isFocusInformation && (<AddInformation lstTimelines={this.state.lstTimelines} isLoading={this.state.isLoading} createInformation={this.createInformation} idSubject={this.props.idSubject} idTimeline={this.props.idTimeline} idInformation={this.state.idInformationFocus} />)}
                    {this.state.isFocusTimeline && (<AddTimeline createTimeline={this.createTimeline} isLoading={this.state.isLoading} />)}
                    {this.state.isImportSubject && (<ImportSubject isLoading={this.state.isLoading} handleImportSubject={this.handleImportSubject} />)}
                    {this.state.isFocusForum && (<AddForum lstTimelines={this.state.lstTimelines} createForum={this.createForum} updateForum={this.updateForum} idSubject={this.props.idSubject} idTimeline={this.state.idTimelineRequired} idForum={this.state.idForumFocus} token={this.props.token} />)}
                    {this.state.isExportSubject && (<ExportSubject idSubject={this.props.idSubject} nameSubject={this.props.nameSubject} token={this.props.token} />)}
                </Drawer>
                {
                    this.state.isTeacherPrivilege &&
                    <Widget
                        openDrawerContent={() => this.openDrawerContent()}
                        turnOnOffEditMode={() => this.turnOnOffEditMode()}
                        isOnMovement={this.state.isOnMovement}
                        setIsOnMovement={() => {
                            this.setState({ isOnMovement: !this.state.isOnMovement }, () => {
                                if (this.state.isOnMovement) {
                                    notifySuccess(this.props.t('mode'), this.props.t('mode_arrange_index'));
                                } else {
                                    notifySuccess(this.props.t('mode'), this.props.t('mode_arrange_index_off'));
                                }
                            })
                        }}
                        updateTimelinesIndex={() => this.updateTimelinesIndex()} />
                }

                <AssignmentModal visible={this.state.visible} isSubmitAssignment={this.state.isSubmitAssignment} isCommentAssignment={this.state.isCommentAssignment} commentAssignmentGrade={this.commentAssignmentGrade} assignment={this.state.assignmentRequirement} handleCancelModal={this.handleCancelModal} submitAssignment={this.submissionFile} onSubmitAssignment={this.onSubmitAssignment} onCancelSubmitAssignment={this.onCancelSubmitAssignment} />


                <Row className={styles.background} style={{ justifyContent: 'center' }}>
                    {
                        this.state.isOnMovement ? contentMovement : contentNormal
                    }


                    {
                        this.state.isTeacherPrivilege

                            ?
                            null
                            :
                            <Col span={8}
                                style={{
                                    margin: '10px',
                                    background: '#fff',
                                    minHeight: '200px',
                                    maxHeight: "556px"
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
                    }
                </Row>

            </>
        )
    }
}

export default withTranslation('translations')(Subject)