import React from 'react'
import { Row, Col, Popover, Tooltip, Tabs, Input, Timeline, Select, notification, Spin, Drawer, Modal } from 'antd'
import { Switch } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import styles from './styles.scss'
import './overwrite.css'
import { get, pick, head } from 'lodash';
import add from '../../../assets/images/contents/add.png'
import forum from '../../../assets/images/contents/forum.png'
import excel from '../../../assets/images/contents/excel.png'
import file from '../../../assets/images/contents/file.png'
import pdf from '../../../assets/images/contents/pdf.png'
import video from '../../../assets/images/contents/video.png'
import loudspeaker from '../../../assets/images/contents/loudspeaker.png'
import timeline from '../../../assets/images/contents/timeline.png'
import word from '../../../assets/images/contents/word.png'
import assignment from '../../../assets/images/contents/assignment.png'
import quiz from '../../../assets/images/contents/quiz.png'
import lock from '../../../assets/images/contents/lock.png'
import surveyIcon from '../../../assets/images/contents/survey.png'
import student from '../../../assets/images/contents/student.png'
import external from '../../../assets/images/contents/external.png'
import manageScore from '../../../assets/images/contents/manage-score.png'
import { withTranslation } from 'react-i18next';
import restClient from '../../../assets/common/core/restClient';
import { MoreOutlined, SettingOutlined, AndroidOutlined } from '@ant-design/icons'
import moment from 'moment'
require('isomorphic-fetch');
import 'react-day-picker/lib/style.css';
import newInfo from '../../../assets/images/contents/new.png';
import deadline from '../../../assets/images/courses/deadline.png'
import opts from '../../../assets/images/contents/opts.png'
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
import AssignmentModal from './assignmentModal/assignmentModal.jsx';

const { TabPane } = Tabs;

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
            FileData: null,
            isAddInformation: false,
            isAddFile: false,
            isAddTimeline: false,
            isAddAssignment: false,
            isAddQuiz: false,
            isAddSurvey: false,
            isOpenSetting: true,
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
            isOnEdit: false
        }
    }

    async componentDidMount() {
        console.log('componentDidMount', this.props.subject, this.props.lstQuizzes, this.props.lstTimeline);

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
        console.log('handleOnDragEnd', result)
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
                name: "Tuần 0" + (index + 1)
            }
        })

        console.log('cv', cv)
        this.setState({ updateTimelines: cv });
        console.log('items', items, cv);
    }

    updateTimelinesIndex = async () => {
        await restClient.asyncPost(`/subject/${this.props.idSubject}/index`, this.state.updateTimelines, this.props.token)
            .then(res => {
                if (!res.hasError) {
                    this.notifySuccess(this.props.t('success'), get(res, 'data').message);
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

    handleProcessFileSubmission = (e) => {
        this.setState({
            FileData: e.target.files[0]
        })
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
                    console.log('getRequirementAssignment', res);

                    this.setState({
                        assignmentRequirement: get(res, 'data').assignment,
                        idTimelineRequired: idTimeline
                    });
                } else {
                    this.notifyError(this.props.t('failure'), res.data.message);
                }
            })

    }

    submissionFile = async ({ file, idAssignment }) => {
        await restClient.asyncPost(`/assignment/${idAssignment}/submit`, { idSubject: this.props.idSubject, idTimeline: this.state.idTimelineRequired, file: file }, this.props.token)
            .then(res => {
                this.setState({ isSubmitAssignment: false });
                if (!res.hasError) {
                    this.notifySuccess(this.props.t('success'), this.props.t('submit_success'))
                    console.log('Notification', res)
                    let submission = res.data.submission;
                    console.log('OLD-ASSIGNMENT', this.state.assignmentRequirement);
                    this.setState({ assignmentRequirement: { ...this.state.assignmentRequirement, submission: submission } }
                        , () => {
                            console.log('New-ASSIGNMENT', this.state.assignmentRequirement);
                        });
                } else {
                    this.notifyError("Thất bại!", res.data.message);
                }
            })
    }

    commentAssignmentGrade = async ({ comment, idAssignment }) => {
        this.setState({ isCommentAssignment: true });
        await restClient.asyncPost(`/assignment/${idAssignment}/comment`, { idSubject: this.props.idSubject, idTimeline: this.state.idTimelineRequired, comment: comment }, this.props.token)
            .then(res => {
                this.setState({ isCommentAssignment: false });
                if (!res.hasError) {
                    this.notifySuccess(this.props.t('success'), res.data.message)
                    console.log('Notification', res)
                    let submission = res.data.submission;
                    console.log('OLD-ASSIGNMENT', this.state.assignmentRequirement);
                    this.setState({ assignmentRequirement: { ...this.state.assignmentRequirement, submission: submission } }
                        , () => {
                            console.log('New-ASSIGNMENT', this.state.assignmentRequirement);
                        });
                } else {
                    this.notifyError(this.props.t('failure'), res.data.message);
                }
            })
    }

    createFile = async ({ file, idTimeline }) => {
        this.setState({
            isLoading: true
        })
        await restClient.asyncPost(`/timeline/upload`, {
            idSubject: this.props.idSubject,
            idTimeline: idTimeline,
            data: file
        }, this.props.token)
            .then(res => {
                this.setState({
                    isLoading: false
                })
                if (!res.hasError) {
                    this.notifySuccess(this.props.t('success'), this.props.t('add_document_success'))

                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === idTimeline)

                    head(timelineUpdate).files.push(res.data.file)


                    console.log(timelineUpdate)

                    this.setState({
                        timelines: [...this.state.timelines],
                        isOpenDrawerCreate: false
                    }, () => {
                        console.log(this.state.timelines)
                    })
                } else {
                    this.notifyError(this.props.t('failure'), res.data.message);
                }
            })
    }

    createQuiz = async ({ quiz, idTimeline }) => {
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: idTimeline,
            data: quiz
        }
        this.setState({
            isLoading: true
        })
        console.log('data', data)
        await restClient.asyncPost('/exam', data, this.props.token)
            .then(res => {
                console.log('createQuiz', res)
                this.setState({
                    isLoading: false
                })
                if (!res.hasError) {
                    this.notifySuccess(this.props.t('success'), this.props.t('add_quiz_success'))
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)

                    console.log('timelineUpdate', timelineUpdate)
                    head(timelineUpdate).exams.push(res.data.exam)


                    console.log(timelineUpdate)

                    this.setState({
                        timelines: [...this.state.timelines],
                        isOpenDrawerCreate: false
                    }, () => {
                        console.log(this.state.timelines)
                    })

                } else {
                    this.notifyError(res.data.message);
                }
            })
    }

    onUploadFile = () => {
        this.setState({
            isLoading: true
        })
    }

    createAssignment = async ({ assignment, idTimeline }) => {
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: idTimeline,
            data: assignment
        }
        this.setState({
            isLoading: true
        })
        console.log('CreateAssignment', data);
        await restClient.asyncPost('/assignment', data, this.props.token)
            .then(res => {
                console.log(res)
                this.setState({
                    isLoading: false
                })
                if (!res.hasError) {
                    this.notifySuccess(this.props.t('success'), this.props.t('add_quiz_asign'))
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)

                    head(timelineUpdate).assignments.push(res.data.assignment)


                    console.log(timelineUpdate)

                    this.setState({
                        timelines: [...this.state.timelines],
                        isOpenDrawerCreate: false
                    }, () => {
                        console.log(this.state.timelines)
                    })


                    this.setState({
                        assignment: {
                            name: '',
                            content: '',
                            setting: {
                                startTime: (new Date()),
                                expireTime: (new Date()),
                                isOverDue: false,
                                overDueDate: (new Date()),
                                fileSize: ''
                            }
                        }
                    })
                } else {
                    this.notifyError(this.props.t('failure'), res.data.message);
                }
            })
    }

    createSurvey = async ({ survey, idTimeline }) => {
        console.log('createSurvey', survey)
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: idTimeline,
            data: survey
        }
        this.setState({
            isLoading: true
        })
        console.log('data', data)
        await restClient.asyncPost('/survey', data, this.props.token)
            .then(res => {
                console.log('createSurvey', res)
                this.setState({
                    isLoading: false
                })
                if (!res.hasError) {
                    this.notifySuccess(this.props.t('success'), this.props.t('add_quiz_survey'))
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)

                    console.log('timelineUpdate', timelineUpdate)
                    head(timelineUpdate).surveys.push(res.data.survey)


                    console.log(timelineUpdate)

                    this.setState({
                        timelines: [...this.state.timelines],
                        isOpenDrawerCreate: false
                    }, () => {
                        console.log(this.state.timelines)
                    })
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

    createInformation = async ({ information, idTimeline }) => {
        this.setState({ isLoading: true });
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: idTimeline,
            data: information
        }
        console.log('createInformation', data);
        await restClient.asyncPost('/information', data, this.props.token)
            .then(res => {
                this.setState({ isLoading: false });
                if (!res.hasError) {
                    this.notifySuccess(this.props.t('success'), this.props.t('add_quiz_information'))
                    console.log('information', res)
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)
                    head(timelineUpdate).information.push(res.data.information)
                    this.setState({
                        timelines: [...this.state.timelines],
                        isOpenDrawerCreate: false
                    })
                } else {
                    this.notifyError(this.props.t('failure'), res.data.message);
                }
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
                console.log('Timeline', res)
                this.setState({ isLoading: false });
                if (!res.hasError) {
                    this.notifySuccess(this.props.t('success'), this.props.t('add_quiz_timeline'))
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
                    this.notifyError(this.props.t('failure'), res.data.message);
                }
            })
    }


    addFile = () => {
        this.setState({
            isAddInformation: false,
            isAddFile: true,
            isAddTimeline: false,
            isAddAssignment: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isSurvey: false
        })
    }

    addInformation = () => {
        this.setState({
            isAddInformation: true,
            isAddFile: false,
            isAddTimeline: false,
            isAddAssignment: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isAddSurvey: false

        })
    }

    addTimeline = () => {
        this.setState({
            isAddInformation: false,
            isAddFile: false,
            isAddTimeline: true,
            isAddAssignment: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isAddSurvey: false
        })
    }

    addAssignment = () => {
        this.setState({
            isAddAssignment: true,
            isAddInformation: false,
            isAddFile: false,
            isAddTimeline: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isAddSurvey: false
        })
    }

    addQuiz = () => {
        this.setState({
            isAddQuiz: false,
            isAddInformation: false,
            isAddFile: false,
            isAddTimeline: false,
            isAddQuiz: true,
            isOpenSetting: false,
            isAddSurvey: false
        })
    }

    addSurvey = () => {
        this.setState({
            isAddQuiz: false,
            isAddInformation: false,
            isAddFile: false,
            isAddTimeline: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isAddSurvey: true
        })
    }

    createNotification = (type, title, message) => {
        return () => {
            switch (type) {
                case 'info':
                    NotificationManager.info(message);
                    break;
                case 'success':
                    NotificationManager.success(message, title);
                    break;
                case 'warning':
                    NotificationManager.warning(message, title, 3000);
                    break;
                case 'error':
                    NotificationManager.error(message, title, 5000, () => {
                        alert('callback');
                    });
                    break;
            }
        };
    };


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
        console.log('Edit', id)
    }

    lock = async (url) => {

        await restClient.asyncPut(url, this.props.token)
            .then(res => {
                console.log('Lock', res)

            })
    }

    unlock = async (url) => {

        await restClient.asyncPut(url, this.props.token)
            .then(res => {
                console.log('Lock', res)
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
            isAddInformation: false,
            isAddFile: false,
            isAddTimeline: false,
            isAddAssignment: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isSurvey: false
        })
    }

    render() {

        const { t } = this.props;


        const contentCRUD = (Id, isDeleted, type, timelineId) => {

            if (type == 'assignment') {
                return (
                    <ul>
                        <li style={{ textDecoration: 'none' }}>
                            {
                                isDeleted ? <a onClick={() => this.unlock(`/assignment/${Id}/hide?idSubject=${this.props.idSubject}&idTimeline=${timelineId}`)}>Unlock</a> : <a onClick={() => this.lock(`/assignment/${Id}/hide?idSubject=${this.props.idSubject}&idTimeline=${timelineId}`)}>Lock</a>
                            }
                        </li>
                        <li style={{ textDecoration: 'none' }}>
                            <a onClick={() => this.edit(Id)}>Edit</a>
                        </li>

                    </ul>
                )
            }

            if (type == 'survey') {
                return (
                    <ul>
                        <li style={{ textDecoration: 'none' }}>
                            {
                                isDeleted ? <a onClick={() => this.unlock(`/survey/${Id}/hide?idSubject=${this.props.idSubject}&idTimeline=${timelineId}`)}>Unlock</a> : <a onClick={() => this.lock(`/survey/${Id}//hide?idSubject=${this.props.idSubject}&idTimeline=${timelineId}`)}>Lock</a>
                            }
                        </li>
                        <li style={{ textDecoration: 'none' }}>
                            <a onClick={() => this.edit(Id)}>Edit</a>
                        </li>

                    </ul>
                )
            }

        }

        const timelineTemplate = (id, name, description, assignments, exams, forums, information, files, surveys, flagMove) => (
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
                        <Col span={6}>
                            {
                                // name.toUpperCase()
                                name
                            }
                        </Col>
                        <Col span={10}>
                            {
                                // description.toUpperCase()
                                description
                            }
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            {
                                this.state.isTeacher ? <MoreOutlined /> : null
                            }
                        </Col>
                    </Row>
                    {

                        information != null ? (
                            <Row style={{ paddingLeft: 47 }}>
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
                            surveys.map(f => {
                                return (
                                    <Row style={{ marginBottom: 10 }} key={f._id} >
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
                                            <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} href={`/surveys/${f._id}?idSubject=${this.props.idSubject}&idTimeline=${id}`}>{f.name}</a>

                                        </Col>
                                        <Col span={2} style={{
                                            fontSize: '20px',
                                            alignSelf: 'center',
                                            marginLeft: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            {this.state.isOnEdit && <FontAwesomeIcon icon="edit" style={{ color: '#3498db' }} />}
                                            {this.state.isOnEdit && <FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} />}
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
                                            <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} href={f.path}>{f.name}</a>
                                        </Col>
                                        <Col span={2} style={{
                                            fontSize: '20px',
                                            alignSelf: 'center',
                                            marginLeft: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Tooltip title="View online">
                                                <FontAwesomeIcon icon="external-link-alt" href={`/view?idSubject=${this.props.idSubject}&idTimeline=${id}&idFile=${f._id}`} target='_blank' />
                                            </Tooltip>
                                            {this.state.isOnEdit && <Tooltip title="Edit Mode"><FontAwesomeIcon icon="edit" style={{ color: '#3498db' }} /></Tooltip>}
                                            {this.state.isOnEdit && <Tooltip title="Lock Mode"><FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} /></Tooltip>}
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
                                        this.getRequirementAssignment({ idAssignment: assign._id, idTimeline: id });
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
                                            <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} href={`/manage/${assign._id}?idSubject=${this.props.idSubject}&idTimeline=${id}`}>{assign.name}</a>
                                        </Col>
                                        <Col span={2} style={{
                                            fontSize: '20px',
                                            alignSelf: 'center',
                                            marginLeft: '10px',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>

                                            {(this.state.isExe && assign.isDeleted) && <img src={lock} width={20} />}

                                            {this.state.isExe && <Popover content={contentCRUD(assign._id, assign.isDeleted, 'assignment', id)} title="Thao tác">
                                                <img src={opts} width={20} />
                                            </Popover>}
                                            {this.state.isOnEdit && <Tooltip title="Edit Mode"><FontAwesomeIcon icon="edit" style={{ color: '#3498db' }} /></Tooltip>}
                                            {this.state.isOnEdit && <Tooltip title="Lock Mode"><FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} /></Tooltip>}
                                        </Col>
                                    </Row>
                            ))

                        ) : null
                    }

                    {
                        forums != null ? (
                            forums.map(fr => (
                                <Row style={{ marginBottom: 10, cursor: 'pointer' }} key={fr._id}>
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
                                        <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} href={`/forums/${fr._id}?idSubject=${this.props.idSubject}&idTimeline=${id}`}>{fr.name}</a>

                                    </Col>
                                    <Col span={2} style={{
                                        fontSize: '20px',
                                        alignSelf: 'center',
                                        marginLeft: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        {this.state.isOnEdit && <Tooltip title="Edit Mode"><FontAwesomeIcon icon="edit" style={{ color: '#3498db' }} /></Tooltip>}
                                        {this.state.isOnEdit && <Tooltip title="Lock Mode"><FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} /></Tooltip>}
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
                                        <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} href={`/quizzis/${ex._id}?idSubject=${this.props.idSubject}&idTimeline=${id}`}>{ex.name}</a>
                                    </Col>
                                    <Col span={2} style={{
                                        fontSize: '20px',
                                        alignSelf: 'center',
                                        marginLeft: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        {this.state.isOnEdit && <Tooltip title="Edit Mode"><FontAwesomeIcon icon="edit" style={{ color: '#3498db' }} /></Tooltip>}
                                        {this.state.isOnEdit && <Tooltip title="Lock Mode"><FontAwesomeIcon icon="lock-open" style={{ color: '#e84118' }} /></Tooltip>}</Col>
                                </Row>
                            ))

                        ) : null
                    }

                </div>

            </div>
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
                                    console.log('assignment', assignments, exams, forums, information, surveys)
                                    return (
                                        <Draggable key={_id} draggableId={_id} index={index} >
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {timelineTemplate(_id, name, description, assignments, exams, forums, information, files, surveys, true)}
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
                    this.state.timelines.map(({ _id, name, description, assignments, exams, forums, information, files, surveys }) => (
                        <div key={_id}>
                            {timelineTemplate(_id, name, description, assignments, exams, forums, information, files, surveys, false)}
                        </div>
                    )
                    )
                }
            </Col>
        )

        //console.log('attachments', get(this.state.assignmentRequirement, 'attachments'))
        return (
            <>
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
                            this.openDrawerCreate(this.props.t('create_information'));
                            this.addInformation()
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
                                this.openDrawerCreate(this.props.t('create_document'));
                                this.addFile()
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
                            this.openDrawerCreate(this.props.t('create_assign'));
                            this.addAssignment();
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
                            this.openDrawerCreate(this.props.t('create_quiz'));
                            this.addQuiz();
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
                            this.openDrawerCreate(this.props.t('create_survey'));
                            this.addSurvey();
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
                            this.openDrawerCreate(this.props.t('create_timeline'));
                            this.addTimeline()
                        }}>
                            {t('timeline')}
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
                        <Col span={12} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#7f8fa6',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => this.openDrawerCreate('TẠO BÀI KIỂM TRA')}>
                            {t('import')}
                       </Col>
                        <Col span={12} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#3c40c6',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => this.openDrawerCreate('TẠO BÀI KHẢO SÁT')}>
                            {t('export')}
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
                    {this.state.isAddQuiz && (<AddQuiz isLoading={this.state.isLoading} lstQuizzes={this.state.lstQuizzes} lstTimelines={this.state.lstTimelines} createQuiz={this.createQuiz} />)}
                    {this.state.isAddSurvey && (<AddSurvey isLoading={this.state.isLoading} lstTimelines={this.state.lstTimelines} lstSurveys={this.state.lstSurveys} createSurvey={this.createSurvey} />)}
                    {this.state.isAddAssignment && (<AddAssignment isLoading={this.state.isLoading} lstTimelines={this.state.lstTimelines} onUploadFile={this.onUploadFile} createAssignment={this.createAssignment} notifyError={this.notifyError} />)}
                    {this.state.isAddFile && (<AddFile isLoading={this.state.isLoading} lstTimelines={this.state.lstTimelines} onUploadFile={this.onUploadFile} createFile={this.createFile} />)}
                    {this.state.isAddInformation && (<AddInformation lstTimelines={this.state.lstTimelines} isLoading={this.state.isLoading} createInformation={this.createInformation} />)}
                    {this.state.isAddTimeline && (<AddTimeline createTimeline={this.createTimeline} isLoading={this.state.isLoading} />)}

                </Drawer>
                {
                    this.state.isTeacherPrivilege &&
                    <Widget
                        openDrawerContent={() => this.openDrawerContent()}
                        turnOnOffEditMode={() => this.turnOnOffEditMode()}
                        isOnMovement={this.state.isOnMovement}
                        setIsOnMovement={() => {
                            if (!this.state.isOnMovement) {
                                this.notifySuccess(this.props.t('mode'), this.props.t('mode_arrange_index'));
                            }
                            this.setState({ isOnMovement: !this.state.isOnMovement })
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