import React from 'react'
import { Row, Col, Popover, Tooltip, Tabs, Input, Timeline, Select, notification, Spin, Drawer, Modal, Button } from 'antd'
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
import AddForum from './addForum/addForum.jsx'
import AssignmentModal from './assignmentModal/assignmentModal.jsx';
import ImportSubject from './importSubject/importSubject.jsx';
import downloadFile from '../../../assets/common/core/downloadFile.js';
import {
    ExportOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import fileDownload from 'js-file-download';

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
            isAddForum: false,
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
            titleDrawCreate: "NỘI DUNG",
            isOnMovement: false,
            isOnEdit: false,
            isExporting: false,
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
                    this.notifySuccess('Thành công!', get(res, 'data').message);
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
                    this.notifyError('Thất bại!', res.data.message);
                }
            })

    }

    submissionFile = async ({ file, idAssignment }) => {
        await restClient.asyncPost(`/assignment/${idAssignment}/submit`, { idSubject: this.props.idSubject, idTimeline: this.state.idTimelineRequired, file: file }, this.props.token)
            .then(res => {
                this.setState({ isSubmitAssignment: false });
                if (!res.hasError) {
                    this.notifySuccess('Thành công!', 'Nộp bài thành công')
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
                    this.notifySuccess('Thành công!', res.data.message)
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
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công document')

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
                    this.notifyError('Thất bại!', res.data.message);
                }
            })
    }

    createQuiz = async ({ quiz, idTimeline }) => {
        console.log('createQuiz', quiz)
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
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công quiz')
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
    onCancelUploadFile = () => {
        this.setState({
            isLoading: false
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
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công assignment')
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
                    this.notifyError("Thất bại", res.data.message);
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
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công survey')
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
                    this.notifyError("Thất bại", res.data.message);
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
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công information')
                    console.log('information', res)
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)
                    head(timelineUpdate).information.push(res.data.information)
                    this.setState({
                        timelines: [...this.state.timelines],
                        isOpenDrawerCreate: false
                    })
                } else {
                    this.notifyError('Thất bại!', res.data.message);
                }
            })
    }

    createForum = async ({ forum, idTimeline }) => {
        this.setState({ isLoading: true });
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: idTimeline,
            data: forum
        }
        console.log('createForum', data);
        await restClient.asyncPost('/forum', data, this.props.token)
            .then(res => {
                this.setState({ isLoading: false });
                if (!res.hasError) {
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công forum')
                    console.log('information', res)
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)
                    head(timelineUpdate).forums.push(res.data.forum)
                    this.setState({
                        timelines: [...this.state.timelines],
                        isOpenDrawerCreate: false
                    })
                } else {
                    this.notifyError('Thất bại!', res.data.message);
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
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công timeline')
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
                    this.notifyError('Thất bại!', res.data.message);
                }
            })
    }


    addFile = () => {
        this.setState({
            isAddFile: true,
        })
    }

    addInformation = () => {
        console.log('Add information')
        this.setState({
            isAddInformation: true,
        })
    }

    addTimeline = () => {
        this.setState({
            isAddTimeline: true,
        })
    }

    addAssignment = () => {
        this.setState({
            isAddAssignment: true,
        })
    }

    addQuiz = () => {
        this.setState({
            isAddQuiz: true,
        })
    }

    addSurvey = () => {
        this.setState({
            isAddSurvey: true
        })
    }

    addForum = () => {
        this.setState({
            isAddForum: true
        })
    }

    importSubject = () => {
        this.setState({
            isImportSubject: true
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
            isAddSurvey: false,
            isAddForum: false,
            isImportSubject: false,
            isLoading: false,
        })
    }

    handleExportSubject = async () => {
        this.setState({ isExporting: true });
        await restClient.asyncGet(`/subject/${this.props.idSubject}/export-teacher`, this.props.token)
            .then(res => {
                this.setState({ isExporting: false });
                if (!res.hasError) {
                    console.log('res', res);
                    fileDownload(JSON.stringify(res.data), `${this.props.subject.name}.json`);
                } else {
                    this.notifyError('Error', res.data.message);
                }
            });
    }
    handleImportSubject = async (data) => {
        this.setState({ isLoading: true });
        await restClient.asyncPost(`/subject/${this.props.idSubject}/import-teacher`, data, this.props.token)
            .then(res => {
                this.setState({ isLoading: false });
                console.log('res', res);
                if (!res.hasError) {
                    this.setState({
                        isOpenDrawerCreate: false,
                        lstTimelines: res.data.timelines,
                        lstSurveys: res.data.surveyBank,
                        lstQuizzes: res.data.quizBank
                    });
                    this.notifySuccess('Thành công!', res.data.message);
                } else {
                    this.notifyError('Error', res.data.message);
                }
            });
    }

    render() {

        const { t } = this.props;

        console.log(this.state.isTeacherPrivilege)
        // const content = (
        //     <div>
        //         <span style={{ margin: '0 10px' }} onClick={() => this.addFileWord()}>
        //             <i>
        //                 <Tooltip title="Add file word">
        //                     <img src={file} style={{ width: '50px' }} />
        //                 </Tooltip>
        //             </i>
        //         </span>
        //         <span style={{ margin: '0 10px' }} onClick={() => this.addInformation()}>
        //             <i>
        //                 <Tooltip title="Add file information">
        //                     <img src={loudspeaker} style={{ width: '50px' }} />
        //                 </Tooltip>
        //             </i>
        //         </span>
        //         <span style={{ margin: '0 10px' }} onClick={() => this.addTimeline()}>
        //             <i>
        //                 <Tooltip title="Add file timeline">
        //                     <img src={timeline} style={{ width: '50px' }} />
        //                 </Tooltip>
        //             </i>
        //         </span>

        //         <span style={{ margin: '0 10px' }} onClick={() => this.addAssignment()}>
        //             <i>
        //                 <Tooltip title="Add assignment">
        //                     <img src={assignment} style={{ width: '50px' }} />
        //                 </Tooltip>
        //             </i>
        //         </span>

        //         <span style={{ margin: '0 10px' }} onClick={() => this.addQuiz()}>
        //             <i>
        //                 <Tooltip title="Add quiz">
        //                     <img src={quiz} style={{ width: '50px' }} />
        //                 </Tooltip>
        //             </i>
        //         </span>

        //         <span style={{ margin: '0 10px' }} onClick={() => this.addSurvey()}>
        //             <i>
        //                 <Tooltip title="Add survey">
        //                     <img src={surveyIcon} style={{ width: '50px' }} />
        //                 </Tooltip>
        //             </i>
        //         </span>
        //     </div>
        // );

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
                    {/* {this.state.isLoadingRequirement && <Spin style={{position: 'absolute', top: '50%', left: '50%', zIndex: 100}}/>} */}
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
                            <Row style={{ paddingLeft: 25 }}>
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
                                            marginLeft: '10px'
                                        }}>

                                            {this.state.isOnEdit && <FontAwesomeIcon icon="edit" />}
                                            {this.state.isOnEdit && <FontAwesomeIcon icon="lock-open" />}
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
                                            justifyContent: 'space-between'
                                        }}>
                                            <Tooltip title="View online">
                                                <a href={`/view?idSubject=${this.props.idSubject}&idTimeline=${id}&idFile=${f._id}`} target='_blank'>
                                                    <FontAwesomeIcon icon="external-link-alt" />
                                                </a>
                                            </Tooltip>
                                            {this.state.isOnEdit && <FontAwesomeIcon icon="edit" />}
                                            {this.state.isOnEdit && <FontAwesomeIcon icon="lock-open" />}
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
                                            marginLeft: '10px'
                                        }}>

                                            {(this.state.isExe && assign.isDeleted) && <img src={lock} width={20} />}

                                            {this.state.isExe && <Popover content={contentCRUD(assign._id, assign.isDeleted, 'assignment', id)} title="Thao tác">
                                                <img src={opts} width={20} />
                                            </Popover>}
                                            {this.state.isOnEdit && <FontAwesomeIcon icon="edit" />}
                                            {this.state.isOnEdit && <FontAwesomeIcon icon="lock-open" />}
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
                                        marginLeft: '10px'
                                    }}>
                                        {this.state.isOnEdit && <FontAwesomeIcon icon="edit" />}
                                        {this.state.isOnEdit && <FontAwesomeIcon icon="lock-open" />}
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
                                    <Col span={20} style={{
                                        fontSize: '20px',
                                        alignSelf: 'center',
                                        marginLeft: '10px'
                                    }}>
                                        <a style={{ display: 'inline-block', cursor: 'pointer', color: '#000' }} href={`/quizzis/${ex._id}?idSubject=${this.props.idSubject}&idTimeline=${id}`}>{ex.name}</a>
                                    </Col>
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
                            </i>Quản lý sinh viên</a>
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
                                <a href={`/points/${this.props.idSubject}`}>Quản lý điểm số</a>
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
                    title="QUẢN LÝ NỘI DUNG"
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
                            this.openDrawerCreate('TẠO THÔNG BÁO');
                            this.addInformation()
                        }}>
                            THÔNG BÁO
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
                                this.openDrawerCreate('TẠO TÀI LIỆU');
                                this.addFile()
                            }}>
                            TÀI LIỆU
                       </Col>
                        <Col span={6} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#e84118',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => {
                            this.openDrawerCreate('TẠO BÀI TẬP');
                            this.addAssignment();
                        }}>
                            BÀI TẬP
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
                            this.openDrawerCreate('TẠO BÀI KIỂM TRA');
                            this.addQuiz();
                        }}>
                            KIỂM TRA
                       </Col>
                        <Col span={6} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#3c40c6',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => {
                            this.openDrawerCreate('TẠO BÀI KHẢO SÁT');
                            this.addSurvey();
                        }}>
                            KHẢO SÁT
                       </Col>
                        <Col span={6} className="action-select-add-content" style={{
                            height: '50px',
                            border: '2px solid #cacaca',
                            background: '#ffa801',
                            color: '#fff',
                            lineHeight: '50px',
                            cursor: 'pointer'
                        }} onClick={() => {
                            this.openDrawerCreate('TẠO TUẦN MỚI');
                            this.addTimeline()
                        }}>
                            TUẦN
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
                            this.openDrawerCreate('TẠO DIỄN ĐÀN MỚI MỚI');
                            this.addForum();
                        }}>
                            DIỄN ĐÀN
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
                            <h2>Chỉ định tạo chức năng cho một lớp học</h2>
                            <p style={{
                                fontStyle: 'italic',
                                color: '#9d9393'
                            }}>Tạo chủ đề</p>
                            <p style={{
                                fontStyle: 'italic',
                                color: '#9d9393'
                            }}>Tạo thông báo cho lớp học theo mỗi chủ để </p>
                            <p style={{
                                fontStyle: 'italic',
                                color: '#9d9393'
                            }}>Đính kèm tài liệu cho sinh viên theo mỗi chủ để</p>
                            <p style={{
                                fontStyle: 'italic',
                                color: '#9d9393'
                            }}>Tạo bài tập và các câu hỏi</p>
                            <p style={{
                                fontStyle: 'italic',
                                color: '#9d9393'
                            }}>Tạo các bài khảo sát ý kiến sau mỗi buổi học theo mỗi chủ đề</p>
                        </div>
                    </Row>
                    <Row>
                        <Col span={12} className="action-select-add-content" >
                            <Button
                                type='primary'
                                size='large'
                                icon={<UploadOutlined />}
                                onClick={() => {
                                    this.openDrawerCreate('IMPORT DỮ LIỆU');
                                    this.importSubject()
                                }}
                            > IMPORT</Button>

                        </Col>
                        <Col span={12} className="action-select-add-content" >
                            <Button
                                loading={this.state.isExporting}
                                onClick={this.handleExportSubject}
                                type='primary'
                                size='large'
                                icon={<ExportOutlined />}
                            > EXPORT</Button>
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
                    {this.state.isAddAssignment && (<AddAssignment isLoading={this.state.isLoading} lstTimelines={this.state.lstTimelines} onUploadFile={this.onUploadFile} onCancelUploadFile={this.onCancelUploadFile} createAssignment={this.createAssignment} notifyError={this.notifyError} />)}
                    {this.state.isAddFile && (<AddFile isLoading={this.state.isLoading} lstTimelines={this.state.lstTimelines} onUploadFile={this.onUploadFile} onCancelUploadFile={this.onCancelUploadFile} createFile={this.createFile} />)}
                    {this.state.isAddInformation && (<AddInformation lstTimelines={this.state.lstTimelines} isLoading={this.state.isLoading} createInformation={this.createInformation} />)}
                    {this.state.isAddTimeline && (<AddTimeline createTimeline={this.createTimeline} isLoading={this.state.isLoading} />)}
                    {this.state.isImportSubject && (<ImportSubject isLoading={this.state.isLoading} handleImportSubject={this.handleImportSubject} />)}
                    {this.state.isAddForum && (<AddForum isLoading={this.state.isLoading} lstTimelines={this.state.lstTimelines} createForum={this.createForum} />)}

                </Drawer>
                {
                    this.state.isTeacherPrivilege &&
                    <Widget
                        openDrawerContent={() => this.openDrawerContent()}
                        turnOnOffEditMode={() => this.turnOnOffEditMode()}
                        isOnMovement={this.state.isOnMovement}
                        setIsOnMovement={() => {
                            if (!this.state.isOnMovement) {
                                this.notifySuccess("Turn on mode arrange timelines", "Bật chế độ sắp xếp chủ đề đã bật !");
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
                            // <Col span={8}
                            //     style={{
                            //         margin: '10px',
                            //         background: '#fff',
                            //         minHeight: '200px',
                            //         maxHeight: 726
                            //     }}>

                            //     <div
                            //         style={{
                            //             textAlign: 'center',
                            //             padding: 10
                            //         }}>

                            //         <Tabs defaultActiveKey="1">
                            //             <TabPane
                            //                 tab={
                            //                     <span>
                            //                         <SettingOutlined />
                            //                         {t('setting')}
                            //                     </span>
                            //                 }
                            //                 key="1"
                            //                 style={{ height: 'auto' }}
                            //             >
                            //                 <Row>
                            //                     <Col span={10}>
                            //                         <span style={{ fontWeight: 600 }}>Sắp xếp mốc thời gian</span>
                            //                     </Col>
                            //                     <Col span={10}>
                            //                         <Switch defaultChecked={false} onChange={e => this.onOrderTimeLine(e)} />
                            //                     </Col>
                            //                 </Row>
                            //                 <Row>
                            //                     <Col span={10}>
                            //                         <span style={{ fontWeight: 600 }}>Nghiệp vụ thao tác</span>
                            //                     </Col>
                            //                     <Col span={10}>
                            //                         <Switch defaultChecked={false} onChange={e => this.onExe(e)} />
                            //                     </Col>
                            //                 </Row>
                            //             </TabPane>
                            //             <TabPane
                            //                 tab={
                            //                     <span>
                            //                         <AndroidOutlined />
                            //                         {t('add_content')}
                            //                     </span>
                            //                 }
                            //                 key="2"
                            //                 style={{ height: 'auto' }}
                            //             >

                            //                 <Row style={{
                            //                     background: '#cacaca',
                            //                     borderRadius: '30px',
                            //                     padding: '10px 0',
                            //                     width: '47px',
                            //                     marginBottom: "15px"
                            //                 }}>
                            //                     <Popover content={content} title="Thêm nội dung">
                            //                         <div>
                            //                             <i>
                            //                                 <img src={add} style={{ width: '25px' }} />
                            //                             </i>
                            //                         </div>
                            //                     </Popover>
                            //                 </Row>

                            //                 <div style={{
                            //                     border: "2px solid #cacaca",
                            //                     padding: "20px 0",
                            //                     borderRadius: "11px",
                            //                     position: 'relative'

                            //                 }}>
                            //                     {this.state.isLoading && <Spin style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 100 }} />}
                            //                     {
                            //                         this.state.isOpenSetting && <div style={{
                            //                             fontStyle: "italic",
                            //                             color: "#cacaca"
                            //                         }}>
                            //                             {t('setting_title')}
                            //                         </div>
                            //                     }

                            //                     {
                            //                         this.state.isAddQuiz && (
                            //                             <AddQuiz isLoading={this.state.isLoading} lstQuizzes={this.state.lstQuizzes} lstTimelines={this.state.lstTimelines} createQuiz={this.createQuiz} />
                            //                         )
                            //                     }

                            //                     {
                            //                         this.state.isAddSurvey && (
                            //                             <AddSurvey isLoading={this.state.isLoading} lstTimelines={this.state.lstTimelines} lstSurveys={this.state.lstSurveys} createSurvey={this.createSurvey} />
                            //                         )
                            //                     }

                            //                     {
                            //                         this.state.isAddAssignment && (
                            //                             <AddAssignment isLoading={this.state.isLoading} lstTimelines={this.state.lstTimelines} onUploadFile={this.onUploadFile} createAssignment={this.createAssignment} notifyError={this.notifyError} />
                            //                         )}
                            //                     {this.state.isAddFile && <>
                            //                         <AddFile isLoading={this.state.isLoading} lstTimelines={this.state.lstTimelines} onUploadFile={this.onUploadFile} createFile={this.createFile} />
                            //                     </>}
                            //                     {this.state.isAddInformation && <>
                            //                         <AddInformation lstTimelines={this.state.lstTimelines} isLoading={this.state.isLoading} createInformation={this.createInformation} />
                            //                     </>}

                            //                     {this.state.isAddTimeline && <>
                            //                         <AddTimeline createTimeline={this.createTimeline} isLoading={this.state.isLoading} />
                            //                     </>}

                            //                 </div>
                            //             </TabPane>
                            //         </Tabs>
                            //     </div>
                            // </Col>

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