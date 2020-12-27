import React from 'react'
import { Row, Col, Popover, Modal, Tooltip, Tabs, Input, Timeline, Select, Button, Checkbox, InputNumber, notification, Spin } from 'antd'
import { Switch } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import styles from './styles.scss'
import './overwrite.css'
import { get, pick, head } from 'lodash';
import add from '../../../assets/images/contents/add.png'
import forum from '../../../assets/images/contents/forum.png'
import excel from '../../../assets/images/contents/excel.png'
import fastTime from '../../../assets/images/courses/fastTime.png'
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
import { withTranslation } from 'react-i18next';
import restClient from '../../../assets/common/core/restClient';
import { MoreOutlined, EyeOutlined, SettingOutlined, AndroidOutlined, AlertOutlined, CheckCircleTwoTone, LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
require('isomorphic-fetch');
import 'react-day-picker/lib/style.css';
import newInfo from '../../../assets/images/contents/new.png';
import deadline from '../../../assets/images/courses/deadline.png'
import deadlineCalcular from '../../../assets/images/courses/deadlineCalcular.png'
import points from '../../../assets/images/contents/statistics-point.png'
import opts from '../../../assets/images/contents/opts.png'
import rar from '../../../assets/images/contents/rar.png'
import DayPickerInputCustomize from '../../basic-component/time-picker';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

class Subject extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            timelines: [],
            updateTimelines: [],
            isTeacher: false,
            assigmentRequirement: {},
            lstTimelines: [],
            lstQuizzis: [],
            quizId: null,
            timeLine: {
                name: '',
                description: ''
            },
            information: {
                name: '',
                content: ''
            },
            timelineId: null,
            assignment: {
                name: '',
                content: '',
                setting: {
                    startTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                        1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                            2,
                            0
                        )}T${`${new Date().getHours()}`.padStart(
                            2,
                            0
                        )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
                    expireTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                        1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                            2,
                            0
                        )}T${`${new Date().getHours()}`.padStart(
                            2,
                            0
                        )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
                    isOverDue: false,
                    overDueDate: null,
                    fileSize: ''
                }
            },
            quiz: {
                name: '',
                content: '',
                startTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                    1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                        2,
                        0
                    )}T${`${new Date().getHours()}`.padStart(
                        2,
                        0
                    )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
                expireTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                    1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                        2,
                        0
                    )}T${`${new Date().getHours()}`.padStart(
                        2,
                        0
                    )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
                setting: {
                    questionCount: null,
                    timeToDo: null,
                    code: get(head(this.props.lstQuizzis), '_id'),
                    attemptCount: null
                }
            },
            FileData: null,
            isAddInfomation: false,
            isAddFilePdf: false,
            isAddFileWord: false,
            isAddFileExcel: false,
            isAddTimeline: false,
            isAddAssignment: false,
            isAddQuiz: false,
            isAddSurvey: false,
            selectedDay: (new Date()),
            isOpenSetting: true,
            deadlines: [],
            dueTo: [],
            timelineIdRequirement: null,
            orderTl: false,
            isLoading: false,
            isLoadingRequirement: true,
            isExe: false,
            isOverDue: false,
            isTeacherPriviledge: false
        }
    }

    async componentDidMount() {
        console.log('componentDidMount', this.props.subject, this.props.lstQuizzis, this.props.lstTimeline);

        const user = JSON.parse(JSON.stringify(localStorage.getItem('user')));
        
        if(user?.idPrivilege == 'student'){
            this.setState({
                isTeacherPriviledge: false,
                deadlines: this.props.lstDeadline,
                dueTo: this.props.lstDueTo
            })
        }

        if(user?.idPrivilege == 'teacher'){
            this.setState({
                isTeacherPriviledge: true
            })
        }

        this.setState({
            lstTimelines: this.props.lstTimeline,
            timelineId: get(head(this.props.lstTimeline), '_id'),
        })



        this.setState({
            lstQuizzis: this.props.lstQuizzis,
            quizId: get(head(this.props.lstQuizzis), '_id')
        })



        this.setState({
            timelines: get(this.props.subject, 'timelines'),

        })

    }

    handleOk = e => {
        console.log(e);

    };

    handleCancel = e => {
        console.log(e);
        this.setState({ visible: false })
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

    updateTimelines = async () => {
        await restClient.asyncPost(`/subject/${this.props.idSubject}/index`, this.state.updateTimelines)
            .then(res => {
                if (!res.hasError) {
                    this.notifySuccess('Thành công!', get(res, 'data').message);
                    console.log('updateTimeline', res)
                    this.setState({
                        timelines: get(res, 'data').timelines
                    })
                }
            })
    }

    onOrderTimeLine = (status) => {
        this.setState({
            isTeacher: !this.state.isTeacher
        })

        if (status === false) {
            this.updateTimelines();
            return;
        }
    }

    transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    getRequirementAssignment = async (id, idSubject, idTimeline) => {
        console.log('getRequirementAssignment', idTimeline);
        this.setState({
            isLoadingRequirement: true
        })
        await restClient.asyncGet(`/assignment/${id}?idSubject=${idSubject}&idTimeline=${idTimeline}`)
            .then(res => {
                if (!res.hasError) {
                    // this.setState({
                    //     isLoadingRequirement: false
                    // })
                    console.log('getRequirementAssignment', res);

                    this.setState({
                        assigmentRequirement: get(res, 'data').assignment,
                        timelineIdRequirement: idTimeline
                    }, () => {
                        this.setState({
                            visible: true
                        })
                    })

                    // return true;
                }
            })

    }

    deleteExercise = async () => {

    }

    deleteQuiz = async () => {

    }

    deleteForum = async () => {

    }

    handleProcessFile = (e) => {
        this.setState({
            FileData: e.target.files[0]
        })

    }

    handleProcessFileSubmissioin = (e) => {
        this.setState({
            FileData: e.target.files[0]
        })
    }

    handleChange(value) {
        this.setState({
            timelineId: value
        })
    }

    handleCodeQuiz = (value) => {
        console.log('handleCodeQuiz', value)
        this.setState({ quiz: { ...this.state.quiz, setting: { ...this.state.quiz.setting, code: value } }, quizId: value });
    }

    changeAttempQuantity = (quantity) => {
        this.setState({ quiz: { ...this.state.quiz, setting: { ...this.state.quiz.setting, attemptCount: quantity } } });
    }

    changeQuantityQuestion = (quantity) => {
        this.setState({ quiz: { ...this.state.quiz, setting: { ...this.state.quiz.setting, questionCount: quantity } } });
    }

    changeTimeTodo = (time) => {
        this.setState({ quiz: { ...this.state.quiz, setting: { ...this.state.quiz.setting, timeToDo: time * 60000 } } });
    }

    handleSelectStartTime(day) {
        this.setState({ assignment: { ...this.state.assignment, setting: { ...this.state.assignment.setting, startTime: day } } });
    }

    handleSelectExpireTime(day) {
        this.setState({ assignment: { ...this.state.assignment, setting: { ...this.state.assignment.setting, expireTime: day } } });
    }

    handleSelectStartTimeQuiz(day) {
        console.log('handleSelectStartTimeQuiz', day)
        this.setState({ quiz: { ...this.state.quiz, startTime: day } });
    }

    handleSelectExpireTimeQuiz(day) {
        console.log('handleSelectExpireTimeQuiz', day)

        this.setState({ quiz: { ...this.state.quiz, expireTime: day } });
    }


    handleSelectoverDueDate(day) {
        this.setState({ assignment: { ...this.state.assignment, setting: { ...this.state.assignment.setting, overDueDate: day } } });
    }

    handleFileSize(size) {
        this.setState({ assignment: { ...this.state.assignment, setting: { ...this.state.assignment.setting, fileSize: size } } });
    }

    handleIsOverDue = (status) => {
        console.log('handleIsOverDue', status.target.checked)
        this.setState({ isOverDue: status.target.checked, assignment: { ...this.state.assignment, setting: { ...this.state.assignment.setting, isOverDue: status.target.checked } } });
    }

    submissionFile = async (idAssignment) => {
        // console.log(idAssignment)
        // const formData = new FormData();
        const objResult = await this.handleImageUpload();
        this.setState({
            isLoading: true
        })
        // formData.append('file', this.state.FileAssign)
        await restClient.asyncPost(`/assignment/${idAssignment}/submit`, {idSubject: this.props.idSubject, idTimeline: this.state.timelineIdRequirement, file: objResult})
            .then(res => {
                if (!res.hasError) {
                    this.notifySuccess('Thành công!', 'Nộp bài thành công')
                    this.setState({
                        isLoading: false
                    })
                    console.log('Notification', res)
                }
            })
    }

    handleImageUpload = async () => {
        const formData = new FormData();
        formData.append('file', this.state.FileData)
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

    createFileWord = async () => {

        this.setState({
            isLoading: true
        })

        const objResult = await this.handleImageUpload();
        console.log('objResult', objResult)

        if (objResult) {
            console.log('Save on database')
        }
        await restClient.asyncPost(`/timeline/upload`, {
            idSubject: this.props.idSubject,
            idTimeline: this.state.timelineId,
            data: objResult
        })
            .then(res => {
                this.setState({
                    isLoading: false
                })
                if (!res.hasError) {
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công document')

                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === this.state.timelineId)

                    head(timelineUpdate).files.push(res.data.file)


                    console.log(timelineUpdate)

                    this.setState({
                        timelines: [...this.state.timelines]
                    }, () => {
                        console.log(this.state.timelines)
                    })
                }
            })
    }

    createQuiz = async () => {
        console.log('createQuiz', this.state.quiz)
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: this.state.timelineId,
            data: this.state.quiz
        }
        this.setState({
            isLoading: true
        })
        console.log('data', data)
        await restClient.asyncPost('/exam', data)
            .then(res => {
                console.log('createQuiz', res)
                if (!res.hasError) {
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công quiz')
                    this.setState({
                        isLoading: false
                    })
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)

                    console.log('timelineUpdate', timelineUpdate)
                    head(timelineUpdate).exams.push(res.data.exam)


                    console.log(timelineUpdate)

                    this.setState({
                        timelines: [...this.state.timelines]
                    }, () => {
                        console.log(this.state.timelines)
                    })


                    this.setState({
                        quiz: {
                            name: '',
                            content: '',
                            startTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                                1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                                    2,
                                    0
                                )}T${`${new Date().getHours()}`.padStart(
                                    2,
                                    0
                                )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
                            expireTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                                1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                                    2,
                                    0
                                )}T${`${new Date().getHours()}`.padStart(
                                    2,
                                    0
                                )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
                            expireTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                                1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                                    2,
                                    0
                                )}T${`${new Date().getHours()}`.padStart(
                                    2,
                                    0
                                )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
                            expireTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                                1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                                    2,
                                    0
                                )}T${`${new Date().getHours()}`.padStart(
                                    2,
                                    0
                                )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
                            setting: {
                                questionCount: null,
                                timeToDo: null,
                                code: null,
                                attemptCount: null
                            }
                        }
                    })
                }
            })
    }

    createAssignment = async () => {
        console.log(this.state.assignment)
        const objResult = await this.handleImageUpload();

        const data = {
            idSubject: this.props.idSubject,
            idTimeline: this.state.timelineId,
            data: { ...this.state.assignment, file: [objResult] }
        }
        this.setState({
            isLoading: true
        })
        await restClient.asyncPost('/assignment', data)
            .then(res => {
                console.log(res)
                if (!res.hasError) {
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công assignment')
                    this.setState({
                        isLoading: false
                    })
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)

                    head(timelineUpdate).assignments.push(res.data.assignment)


                    console.log(timelineUpdate)

                    this.setState({
                        timelines: [...this.state.timelines]
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

    createTimeline = async () => {
        if (this.state.timeLine.name.trim() == '' || this.state.timeLine.description.trim() == '') {
            this.notifyWarning('Cảnh báo', 'Hãy nhập đầy đủ thông tin cần thiết');
            return;
        }

        this.setState({
            isLoading: true
        })

        const data = {
            idSubject: this.props.idSubject,
            data: this.state.timeLine
        }

        await restClient.asyncPost('/timeline', data)
            .then(res => {
                console.log('Timeline', res)
                if (!res.hasError) {
                    this.notifySuccess('Thành công!', 'Bạn vừa mới thêm thành công timeline')
                    this.setState({
                        timelines: [...this.state.timelines, get(res, 'data').timeline],
                        isLoading: false,
                        timeLine: {
                            name: '',
                            description: ''
                        },
                        lstTimelines: [...this.state.lstTimelines, {
                            _id: get(res, 'data').timeline._id,
                            isDeleted: get(res, 'data').timeline.isDeleted,
                            name: get(res, 'data').timeline.name,
                            description: get(res, 'data').timeline.description
                        }]
                    })

                }
            })
    }

    addFilePdf = () => {
        this.setState({
            isAddInfomation: false,
            isAddFilePdf: true,
            isAddFileWord: false,
            isAddFileExcel: false,
            isAddTimeline: false,
            isAddAssignment: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isSurvey: false
        })
    }

    addFileWord = () => {
        this.setState({
            isAddInfomation: false,
            isAddFilePdf: false,
            isAddFileWord: true,
            isAddFileExcel: false,
            isAddTimeline: false,
            isAddAssignment: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isSurvey: false
        })
    }

    addFileExcel = () => {
        this.setState({
            isAddInfomation: false,
            isAddFilePdf: false,
            isAddFileWord: false,
            isAddFileExcel: true,
            isAddTimeline: false,
            isAddAssignment: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isSurvey: false
        })
    }

    addInformation = () => {
        console.log('Add information')
        this.setState({
            isAddInfomation: true,
            isAddFilePdf: false,
            isAddFileWord: false,
            isAddFileExcel: false,
            isAddTimeline: false,
            isAddAssignment: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isAddSurvey: false

        })
    }

    addTimeline = () => {
        this.setState({
            isAddInfomation: false,
            isAddFilePdf: false,
            isAddFileWord: false,
            isAddFileExcel: false,
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
            isAddInfomation: false,
            isAddFilePdf: false,
            isAddFileWord: false,
            isAddFileExcel: false,
            isAddTimeline: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isAddSurvey: false
        })
    }

    addQuiz = () => {
        this.setState({
            isAddQuiz: false,
            isAddInfomation: false,
            isAddFilePdf: false,
            isAddFileWord: false,
            isAddFileExcel: false,
            isAddTimeline: false,
            isAddQuiz: true,
            isOpenSetting: false,
            isAddSurvey: false
        })
    }

    addSurvey = () => {
        this.setState({
            isAddQuiz: false,
            isAddInfomation: false,
            isAddFilePdf: false,
            isAddFileWord: false,
            isAddFileExcel: false,
            isAddTimeline: false,
            isAddQuiz: false,
            isOpenSetting: false,
            isAddSurvey: true
        })
    }


    createInfomation = async () => {
        console.log('createInfomation', this.state.timelineId, this.state.timelines)
        console.log(this.state.information)
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: this.state.timelineId,
            data: this.state.information
        }
        await restClient.asyncPost('/information', data)
            .then(res => {
                if (!res.hasError) {
                    console.log('information', res)
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)

                    head(timelineUpdate).information.push(res.data.information)


                    console.log(timelineUpdate)

                    this.setState({
                        timelines: [...this.state.timelines]
                    }, () => {
                        console.log(this.state.timelines)
                    })



                    this.setState({
                        information: {
                            name: '',
                            content: ''
                        }
                    })
                }


            })
    }


    downloadFile = async (idTimeline, idFile) => {
        await restClient.asyncDownLoad(`/timeline/${idTimeline}/download/${idFile}?idSubject=${this.props.idSubject}`)
            .then(res => {
                console.log(res)
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

    edit = (id) => {
        console.log('Edit', id)
    }

    lock = async (url) => {

        await restClient.asyncPut(url)
            .then(res => {
                console.log('Lock', res)

            })
    }

    unlock = async (url) => {

        await restClient.asyncPut(url)
            .then(res => {
                console.log('Lock', res)
            })

    }

    render() {

        const { t } = this.props;

        const content = (
            <div>
                <span style={{ margin: '0 10px' }} onClick={() => this.addFileWord()}>
                    <i>
                        <Tooltip title="Add file word">
                            <img src={file} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
                <span style={{ margin: '0 10px' }} onClick={() => this.addInformation()}>
                    <i>
                        <Tooltip title="Add file information">
                            <img src={loudspeaker} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
                <span style={{ margin: '0 10px' }} onClick={() => this.addTimeline()}>
                    <i>
                        <Tooltip title="Add file timeline">
                            <img src={timeline} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>

                <span style={{ margin: '0 10px' }} onClick={() => this.addAssignment()}>
                    <i>
                        <Tooltip title="Add assignment">
                            <img src={assignment} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>

                <span style={{ margin: '0 10px' }} onClick={() => this.addQuiz()}>
                    <i>
                        <Tooltip title="Add quiz">
                            <img src={quiz} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>

                <span style={{ margin: '0 10px' }} onClick={() => this.addSurvey()}>
                    <i>
                        <Tooltip title="Add survey">
                            <img src={surveyIcon} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
            </div>
        );

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

        const template = (id, name, description, assignments, exams, forums, infomation, files, surveys) => (
            <div style={{ margin: '0 10px 10px 10px', border: "2px solid #cacaca" }}>
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
                        <Col span={6}>
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

                        infomation != null ? (
                            <Row style={{ paddingLeft: 35 }}>
                                <Timeline>
                                    {infomation.map(info => {
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
                                console.log('File', f); return (
                                    <Row style={{ marginBottom: 10 }} key={f._id} >
                                        <Col span={2} style={{
                                            textAlign: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <i>
                                                <img src={surveyIcon} width={36} />                    </i>
                                        </Col>
                                        <Col span={20} style={{
                                            fontSize: '20px',
                                        }}>
                                            <a style={{ display: 'inline-block', cursor: 'pointer' }} href={`/surveys/${f._id}?idSubject=${this.props.idSubject}&idTimeline=${id}`}>[{t('Surveys')}] {f.name}</a>

                                            {(this.state.isExe && f.isDeleted) && <img src={lock} width={20} />}

                                            {this.state.isExe && <Popover content={contentCRUD(f._id, f.isDeleted, 'survey', id)} title="Thao tác">
                                                <img src={opts} width={20} />
                                            </Popover>}
                                        </Col>
                                    </Row>
                                )
                            })

                        ) : null
                    }

                    {
                        files != null ? (
                            files.map(f => {
                                console.log('File', f); return (
                                    <Row style={{ marginBottom: 10 }} key={f._id} >
                                        <Col span={2} style={{
                                            textAlign: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <i>
                                                <img src={(f.type == 'docx' || f.type == 'doc') ? word : (f.type == 'pdf' ? pdf : f.type == 'webm' ? video : excel)} width={36} />
                                            </i>
                                        </Col>
                                        <Col span={20} style={{
                                            fontSize: '20px',
                                        }}>
                                            <a style={{ display: 'inline-block', cursor: 'pointer' }} href={f.path}>[{t('Files')}] {f.name}</a> <Tooltip title="View online"><a href={`/view?idSubject=${this.props.idSubject}&idTimeline=${id}&idFile=${f._id}`} target='_blank'><img width={20} src={external} /></a></Tooltip>
                                        </Col>
                                    </Row>
                                )
                            })

                        ) : null
                    }


                    {
                        assignments != null ? (
                            assignments.map(assign => (
                                !this.state.isTeacherPriviledge ?
                                    <Row style={{ marginBottom: 10, position: 'relative', cursor: 'pointer' }} onClick={() => {
                                        this.getRequirementAssignment(assign._id, this.props.idSubject, id);
                                        // if(flagLoading){
                                        //     this.setState({ visible: true })
                                        // }
                                    }} key={assign._id}>

                                        <Col span={2} style={{
                                            textAlign: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <i>
                                                <img src={assignment} width={36} />
                                            </i>
                                        </Col>
                                        <Col span={20} style={{
                                            fontSize: '20px',
                                        }}>
                                            <div>[{t('exercise')}] {assign.name}</div>
                                        </Col>
                                    </Row>
                                    :

                                    <Row style={{ marginBottom: 10 }} key={assign._id}>
                                        <Col span={2} style={{
                                            textAlign: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <i>
                                                <img src={assignment} width={36} />
                                            </i>
                                        </Col>
                                        <Col span={20} style={{
                                            fontSize: '20px',
                                        }}>
                                            <a href={`/manage/${assign._id}?idSubject=${this.props.idSubject}&idTimeline=${id}`}>[{t('exercise')}] {assign.name}</a>

                                            {(this.state.isExe && assign.isDeleted) && <img src={lock} width={20} />}

                                            {this.state.isExe && <Popover content={contentCRUD(assign._id, assign.isDeleted, 'assignment', id)} title="Thao tác">
                                                <img src={opts} width={20} />
                                            </Popover>}

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
                                    <Col span={20} style={{
                                        fontSize: '20px',
                                    }}>
                                        <a href={`/forums/${fr._id}?idSubject=${this.props.idSubject}&idTimeline=${id}`}>[{t('discussion_forum')}] {fr.name}</a>
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
                                            <img src={quiz} width={36} />
                                        </i>
                                    </Col>
                                    <Col span={20} style={{
                                        fontSize: '20px',
                                    }}>
                                        <a href={`/quizzis/${ex._id}?idSubject=${this.props.idSubject}&idTimeline=${id}`}>[{t('quiz')}] {ex.name}</a>
                                    </Col>
                                </Row>
                            ))

                        ) : null
                    }

                </div>

            </div>
        );

        const contentTeacher = (
            <DragDropContext onDragEnd={this.handleOnDragEnd}>
                <Droppable droppableId="characters">
                    {(provided) => (
                        <Col span={12}
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
                                    <span style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject}</span>
                                </div>

                            </div>

                            {
                                this.state.timelines.map(({ _id, name, description, assignments, exams, forums, information, files, surveys }, index) => {
                                    console.log('assignment', assignments, exams, forums, information, surveys)
                                    return (
                                        <Draggable key={_id} draggableId={_id} index={index} >
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {template(_id, name, description, assignments, exams, forums, information, files, surveys)}
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
            <Col span={12}
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
                        <span style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject}</span>
                    </div>

                </div>
                {
                    this.state.isTeacherPriviledge ? <Row style={{ marginBottom: 10 }} >
                        <Col span={2} style={{
                            textAlign: 'center',
                            alignSelf: 'center'
                        }}>
                            <i>
                                <img src={student} width={36} />
                            </i>
                        </Col>
                        <Col span={20} style={{
                            fontSize: '20px',
                        }}>
                            <a href={`/students?idSubject=${this.props.idSubject}`}>Quản lý sinh viên</a>
                        </Col>
                    </Row>

                        :

                        <Row style={{ marginBottom: 10 }} >
                            <Col span={2} style={{
                                textAlign: 'center',
                                alignSelf: 'center'
                            }}>
                                <i>
                                    <img src={opts} width={36} />
                                </i>
                            </Col>
                            <Col span={20} style={{
                                fontSize: '20px',
                            }}>
                                <a href={`/points/${this.props.idSubject}`}>Quản lý điểm số</a>
                            </Col>
                        </Row>

                }

                {
                    this.state.timelines.map(({ _id, name, description, assignments, exams, forums, information, files, surveys }) => (
                        <div key={_id}>
                            {template(_id, name, description, assignments, exams, forums, information, files, surveys)}
                        </div>
                    )
                    )
                }
            </Col>
        )


        console.log('attachments', get(this.state.assigmentRequirement, 'attachments'))
        return (
            <>
                <Modal
                    title="[ Assignment ] Submission file word"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okButtonProps={{ style: { display: 'none' } }}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    footer={null}
                >
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="Submission" key="1">
                            <div>
                                <div>{t('sbmit_stat')}</div>
                                <div style={{ margin: '10px 0' }}>
                                    <span style={{ fontWeight: 600 }}>Due date: </span>
                                    <span>{this.transTime(get(this.state.assigmentRequirement, 'setting')?.expireTime)}</span>
                                </div>
                                <div style={{ margin: '10px 0' }}>
                                    <span style={{ fontWeight: 600 }}>Time remaining: </span>
                                    <span>{get(this.state.assigmentRequirement, 'timingRemain')}</span>
                                </div>
                                <div style={{ margin: '10px 0' }}>
                                    <span style={{ fontWeight: 600 }}>Last modified: </span>
                                    <span>{this.transTime(head(get(this.state.assigmentRequirement, 'submission'))?.submitTime)}</span>
                                </div>
                                <div style={{ margin: '10px 0' }} >
                                    <span style={{ fontWeight: 600 }}>File submissions: </span>
                                    <Input type="file" onChange={e => this.handleProcessFileSubmissioin(e)} style={{ width: 200, borderRadius: 20, overflow: 'hidden' }} />
                                </div>
                                {
                                    (this.state.assigmentRequirement.submission !== null) && <div style={{ margin: '10px 0' }}>
                                        <div style={{
                                            border: '1px dashed #cacaca',
                                            padding: '5px 20px',
                                            textAlign: 'center'
                                        }}>
                                            <img src={get(this.state.assigmentRequirement.submission, 'file')?.type.includes('doc') ? word: get(this.state.assigmentRequirement.submission, 'file')?.type == 'rar' ? rar : file} />
                                            <div>{get(this.state.assigmentRequirement.submission, 'file')?.name}</div>
                                        </div>
                                    </div>
                                }


                            </div>
                            {
                                get(this.state.assigmentRequirement, 'isCanSubmit') &&
                                <Row style={{ marginTop: 10 }}>
                                    <div>
                                        <Button type="primary" onClick={() => this.submissionFile(get(this.state.assigmentRequirement, '_id'))} style={{ borderRadius: 20 }}><Spin spinning={this.state.isLoading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />{t('submit_assign')}</Button>
                                    </div>
                                </Row>
                            }

                        </TabPane>
                        <TabPane tab="Requirement" key="2">
                            <div style={{ fontWeight: "700" }}>[Content requirement]</div>
                            <div dangerouslySetInnerHTML={{ __html: get(this.state.assigmentRequirement, 'content') }} />
                            {/* <div>
                                {get(this.state.assigmentRequirement, 'content')}
                            </div> */}
                            <div style={{ fontWeight: "700" }}>File attachment</div>
                            <div style={{ height: 50 }}>
                                {
                                    (get(this.state.assigmentRequirement, 'attachments') || []).map(f => {
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
                                get(this.state.assigmentRequirement, 'gradeStatus') ? (<>
                                    <div>Grade status</div>
                                    <div>
                                        <span style={{ fontWeight: 600 }}>Grade: </span>
                                        <span>{get(get(this.state.assigmentRequirement, 'submission')?.feedBack, 'grade')}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 600 }}>Grade on: </span>
                                        <span>{this.transTime(get(head(get(this.state.assigmentRequirement, 'submission'))?.feedBack, 'gradeOn'))}</span>
                                    </div>
                                    <div>
                                        <div style={{ marginBottom: 10 }}>Feedback comments</div>
                                        <TextArea rows={2} />
                                    </div></>
                                )
                                    :
                                    (
                                        <div style={{ color: '#ff4000', fontStyle: 'italic' }}>Chưa chấm điểm</div>
                                    )
                            }
                        </TabPane>
                    </Tabs>
                </Modal>
                <Row className={styles.background} style={{ justifyContent: 'center' }}>
                    {
                        this.state.isTeacher ? contentTeacher : contentNormal
                    }


                    {
                        this.state.isTeacherPriviledge

                            ?
                            <Col span={8}
                                style={{
                                    margin: '10px',
                                    background: '#fff',
                                    borderRadius: '10px',
                                    minHeight: '200px',
                                    maxHeight: 726
                                }}>

                                <div
                                    style={{
                                        textAlign: 'center',
                                        padding: 10
                                    }}>

                                    <Tabs defaultActiveKey="1">
                                        <TabPane
                                            tab={
                                                <span>
                                                    <SettingOutlined />
                                                    {t('setting')}
                                                </span>
                                            }
                                            key="1"
                                            style={{ height: 'auto' }}
                                        >
                                            <Row>
                                                <Col span={10}>
                                                    <span style={{ fontWeight: 600 }}>Sắp xếp mốc thời gian</span>
                                                </Col>
                                                <Col span={10}>
                                                    <Switch defaultChecked={false} onChange={e => this.onOrderTimeLine(e)} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={10}>
                                                    <span style={{ fontWeight: 600 }}>Nghiệp vụ thao tác</span>
                                                </Col>
                                                <Col span={10}>
                                                    <Switch defaultChecked={false} onChange={e => this.onExe(e)} />
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane
                                            tab={
                                                <span>
                                                    <AndroidOutlined />
                                                    {t('add_content')}
                                                </span>
                                            }
                                            key="2"
                                            style={{ height: 'auto' }}
                                        >

                                            <Row style={{
                                                background: '#cacaca',
                                                borderRadius: '30px',
                                                padding: '10px 0',
                                                width: '47px',
                                                marginBottom: "15px"
                                            }}>
                                                <Popover content={content} title="Thêm nội dung">
                                                    <div>
                                                        <i>
                                                            <img src={add} style={{ width: '25px' }} />
                                                        </i>
                                                    </div>
                                                </Popover>
                                            </Row>

                                            <div style={{
                                                border: "2px solid #cacaca",
                                                padding: "20px 0",
                                                borderRadius: "11px",
                                                position: 'relative'

                                            }}>
                                                {this.state.isLoading && <Spin style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 100 }} />}
                                                {
                                                    this.state.isOpenSetting && <div style={{
                                                        fontStyle: "italic",
                                                        color: "#cacaca"
                                                    }}>
                                                        {t('setting_title')}
                                                    </div>
                                                }

                                                {
                                                    this.state.isAddQuiz && (<>
                                                        <div style={{
                                                            fontStyle: "italic",
                                                            color: "#cacaca"
                                                        }}>
                                                            {t('setting_quiz')}
                                                        </div>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('timeline')}
                                                            </Col>
                                                            <Col>
                                                                <Select defaultValue={this.state.timelineId} style={{ width: 200 }} onChange={e => this.handleChange(e)}>
                                                                    {
                                                                        this.state.lstTimelines.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                                                    }
                                                                </Select>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('name')}
                                                            </Col>
                                                            <Col>
                                                                <Input placeholder="Name assigment" style={{ width: 200 }}
                                                                    value={get(this.state.quiz, 'name')}
                                                                    onChange={e => {
                                                                        this.setState({
                                                                            quiz: { ...this.state.quiz, name: e.target.value }
                                                                        })
                                                                    }} />
                                                            </Col>

                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('content')}
                                                            </Col>
                                                            <Col>
                                                                <TextArea style={{ width: 200 }}

                                                                    placeholder="Content assignment"
                                                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                                                    showCount
                                                                    value={get(this.state.quiz, 'content')}
                                                                    onChange={e => {
                                                                        this.setState({
                                                                            quiz: { ...this.state.quiz, content: e.target.value }
                                                                        })
                                                                    }}
                                                                />
                                                            </Col>

                                                        </Row>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('startTime')}</span>
                                                            </Col>
                                                            <Col>
                                                                {/* <DayPickerInput value={get(this.state.quiz, 'startTime')} onDayChange={e => this.handleSelectStartTimeQuiz(e)} style={{ width: 200 }} /> */}
                                                                {/* <DayPickerInputCustomize value={get(this.state.quiz, 'startTime')} onDayChange={e => this.handleSelectStartTimeQuiz(e)} style={{ width: 200 }} /> */}
                                                                <input type="datetime-local" id="start-time"
                                                                    name="start-time" value={get(this.state.quiz, 'startTime')}
                                                                    min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectStartTimeQuiz(e.target.value)} />
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('expireTime')}</span>
                                                            </Col>
                                                            <Col>
                                                                {/* <DayPickerInputCustomize value={get(this.state.quiz, 'expireTime')} onDayChange={e => this.handleSelectExpireTimeQuiz(e)} style={{ width: 200 }} /> */}
                                                                <input type="datetime-local" id="expire-time"
                                                                    name="expire-time" value={get(this.state.quiz, 'expireTime')}
                                                                    min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectExpireTimeQuiz(e.target.value)} />
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col style={{ fontWeight: 700 }}>
                                                                {t('settings')}
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('questionCount')}</span>
                                                            </Col>
                                                            <Col>
                                                                <InputNumber size="small" min={1} max={100000} defaultValue={3} onChange={e => this.changeQuantityQuestion(e)} style={{ width: 200 }} />
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('timeTodo')}</span>
                                                            </Col>
                                                            <Col>
                                                                <InputNumber size="small" min={1} max={180} defaultValue={3} onChange={e => this.changeTimeTodo(e)} style={{ width: 200 }} />
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('code')}
                                                            </Col>
                                                            <Col>
                                                                <Select defaultValue={this.state.quizId} style={{ width: 200 }} onChange={e => this.handleCodeQuiz(e)}>
                                                                    {
                                                                        this.state.lstQuizzis.map(q => (<Option value={q._id} key={q._id}>{q.name}</Option>))
                                                                    }
                                                                </Select>
                                                            </Col>
                                                        </Row>


                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('attemptQuantity')}</span>
                                                            </Col>
                                                            <Col>
                                                                <InputNumber size="small" min={1} max={10} defaultValue={3} onChange={e => this.changeAttempQuantity(e)} style={{ width: 200 }} />
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ textAlign: 'center', paddingTop: "20px" }}>
                                                            <div>
                                                                <Button type="primary" onClick={() => this.createQuiz()} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                                                            </div>
                                                        </Row>
                                                    </>)
                                                }

                                                {
                                                    this.state.isAddSurvey && (<>
                                                        <div style={{
                                                            fontStyle: "italic",
                                                            color: "#cacaca"
                                                        }}>
                                                            {t('setting_quiz')}
                                                        </div>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('timeline')}
                                                            </Col>
                                                            <Col>
                                                                <Select defaultValue={this.state.timelineId} style={{ width: 200 }} onChange={e => this.handleChange(e)}>
                                                                    {
                                                                        this.state.lstTimelines.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                                                    }
                                                                </Select>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('name')}
                                                            </Col>
                                                            <Col>
                                                                <Input placeholder="Name assigment" style={{ width: 200 }}
                                                                    value={get(this.state.quiz, 'name')}
                                                                    onChange={e => {
                                                                        this.setState({
                                                                            quiz: { ...this.state.quiz, name: e.target.value }
                                                                        })
                                                                    }} />
                                                            </Col>

                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('content')}
                                                            </Col>
                                                            <Col>
                                                                <TextArea style={{ width: 200 }}

                                                                    placeholder="Content assignment"
                                                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                                                    showCount
                                                                    value={get(this.state.quiz, 'content')}
                                                                    onChange={e => {
                                                                        this.setState({
                                                                            quiz: { ...this.state.quiz, content: e.target.value }
                                                                        })
                                                                    }}
                                                                />
                                                            </Col>

                                                        </Row>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('startTime')}</span>
                                                            </Col>
                                                            <Col>
                                                                {/* <DayPickerInput value={get(this.state.quiz, 'startTime')} onDayChange={e => this.handleSelectStartTimeQuiz(e)} style={{ width: 200 }} /> */}
                                                                {/* <DayPickerInputCustomize value={get(this.state.quiz, 'startTime')} onDayChange={e => this.handleSelectStartTimeQuiz(e)} style={{ width: 200 }} /> */}
                                                                <input type="datetime-local" id="start-time"
                                                                    name="start-time" value={get(this.state.quiz, 'startTime')}
                                                                    min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectStartTimeQuiz(e.target.value)} />
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('expireTime')}</span>
                                                            </Col>
                                                            <Col>
                                                                {/* <DayPickerInputCustomize value={get(this.state.quiz, 'expireTime')} onDayChange={e => this.handleSelectExpireTimeQuiz(e)} style={{ width: 200 }} /> */}
                                                                <input type="datetime-local" id="expire-time"
                                                                    name="expire-time" value={get(this.state.quiz, 'expireTime')}
                                                                    min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectExpireTimeQuiz(e.target.value)} />
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col style={{ fontWeight: 700 }}>
                                                                {t('settings')}
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('questionCount')}</span>
                                                            </Col>
                                                            <Col>
                                                                <InputNumber size="small" min={1} max={100000} defaultValue={3} onChange={e => this.changeQuantityQuestion(e)} style={{ width: 200 }} />
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('timeTodo')}</span>
                                                            </Col>
                                                            <Col>
                                                                <InputNumber size="small" min={1} max={180} defaultValue={3} onChange={e => this.changeTimeTodo(e)} style={{ width: 200 }} />
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('code')}
                                                            </Col>
                                                            <Col>
                                                                <Select defaultValue={this.state.quizId} style={{ width: 200 }} onChange={e => this.handleCodeQuiz(e)}>
                                                                    {
                                                                        this.state.lstQuizzis.map(q => (<Option value={q._id} key={q._id}>{q.name}</Option>))
                                                                    }
                                                                </Select>
                                                            </Col>
                                                        </Row>


                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('attemptQuantity')}</span>
                                                            </Col>
                                                            <Col>
                                                                <InputNumber size="small" min={1} max={10} defaultValue={3} onChange={e => this.changeAttempQuantity(e)} style={{ width: 200 }} />
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ textAlign: 'center', paddingTop: "20px" }}>
                                                            <div>
                                                                <Button type="primary" onClick={() => this.createQuiz()} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                                                            </div>
                                                        </Row>
                                                    </>)
                                                }

                                                {
                                                    this.state.isAddAssignment && (<>
                                                        <div style={{
                                                            fontStyle: "italic",
                                                            color: "#cacaca"
                                                        }}>
                                                            {t('setting_assignment')}
                                                        </div>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('timeline')}
                                                            </Col>
                                                            <Col>
                                                                <Select defaultValue={this.state.timelineId} style={{ width: 200 }} onChange={e => this.handleChange(e)}>
                                                                    {
                                                                        this.state.lstTimelines.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                                                    }
                                                                </Select>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('name')}
                                                            </Col>
                                                            <Col>
                                                                <Input placeholder="Name assigment" style={{ width: 200 }}
                                                                    value={get(this.state.assignment, 'name')}
                                                                    onChange={e => {
                                                                        this.setState({
                                                                            assignment: { ...this.state.assignment, name: e.target.value }
                                                                        })
                                                                    }} />
                                                            </Col>

                                                        </Row>

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('content')}
                                                            </Col>
                                                            <Col>
                                                                <TextArea style={{ width: 200 }}

                                                                    placeholder="Content assignment"
                                                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                                                    showCount
                                                                    value={get(this.state.assignment, 'content')}
                                                                    onChange={e => {
                                                                        this.setState({
                                                                            assignment: { ...this.state.assignment, content: e.target.value }
                                                                        })
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('startTime')}</span>
                                                            </Col>
                                                            <Col>
                                                                <input type="datetime-local" id="start-time"
                                                                    name="start-time" value={get(this.state.assignment.setting, 'startTime')}
                                                                    min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectStartTime(e.target.value)} />
                                                                {/* <DayPickerInputCustomize  onDayChange={e => this.handleSelectStartTime(e)} style={{ width: 200 }} /> */}
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('expireTime')}</span>
                                                            </Col>
                                                            <Col>
                                                                <input type="datetime-local" id="start-time"
                                                                    name="start-time" value={get(this.state.assignment.setting, 'expireTime')}
                                                                    min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectExpireTime(e.target.value)} />
                                                                {/* <DayPickerInputCustomize value={get(this.state.assignment.setting, 'expireTime')} onDayChange={e => this.handleSelectExpireTime(e)} style={{ width: 200 }} /> */}
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('isOverDue')}</span>
                                                            </Col>
                                                            <Col>
                                                                <Checkbox onChange={e => this.handleIsOverDue(e)} style={{ width: 200 }} />
                                                            </Col>
                                                        </Row>

                                                        {
                                                            this.state.isOverDue && (
                                                                <Row style={{ margin: '10px 0' }}>
                                                                    <Col span={6} style={{ fontWeight: 700 }}>
                                                                        <span>{t('overDueDate')}</span>
                                                                    </Col>
                                                                    <Col>
                                                                        <input type="datetime-local" id="start-time"
                                                                            name="start-time" value={get(this.state.assignment.setting, 'overDueDate')}
                                                                            min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectoverDueDate(e.target.value)} />
                                                                        {/* <DayPickerInputCustomize value={get(this.state.assignment.setting, 'overDueDate')} onDayChange={e => this.handleSelectoverDueDate(e)} style={{ width: 200 }} /> */}
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        }

                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                <span>{t('fileSize')}</span>
                                                            </Col>
                                                            <Col>
                                                                <Select defaultValue="5" style={{ width: 200 }} onChange={e => this.handleFileSize(e)} >
                                                                    <Option value="5">5</Option>
                                                                    <Option value="10">10</Option>
                                                                    <Option value="15">
                                                                        15
                                                                    </Option>
                                                                    <Option value="20">20</Option>
                                                                </Select>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ margin: '10px 0' }}>
                                                            <Col span={6} style={{ fontWeight: 700 }}>
                                                                {t('fileAttach')}
                                                            </Col>
                                                            <Col>
                                                                <Input type="file" onChange={e => this.handleProcessFile(e)} style={{ width: 200, borderRadius: 20, overflow: 'hidden' }} />
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ textAlign: 'center', paddingTop: "20px" }}>
                                                            <div>
                                                                <Button type="primary" onClick={() => this.createAssignment()} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                                                            </div>
                                                        </Row>
                                                    </>)
                                                }

                                                {this.state.isAddInfomation && <>
                                                    <div style={{
                                                        fontStyle: "italic",
                                                        color: "#cacaca"
                                                    }}>
                                                        {t('setting_inform')}
                                                    </div>
                                                    <Row style={{ margin: '10px 0' }}>
                                                        <Col span={6} style={{ fontWeight: 700 }}>
                                                            {t('timeline')}
                                                        </Col>
                                                        <Col>
                                                            <Select defaultValue={this.state.timelineId} style={{ width: 200 }} onChange={e => this.handleChange(e)}>
                                                                {
                                                                    this.state.lstTimelines.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                                                }
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ margin: '10px 0' }}>
                                                        <Col span={6} style={{ fontWeight: 700 }}>
                                                            {t('name')}
                                                        </Col>
                                                        <Col>
                                                            <Input placeholder="Basic usage" style={{ width: 200 }}
                                                                value={get(this.state.information, 'name')}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        information: { ...this.state.information, name: e.target.value }
                                                                    })
                                                                }} />
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ margin: '10px 0' }}>
                                                        <Col span={6} style={{ fontWeight: 700 }}>
                                                            {t('content')}
                                                        </Col>
                                                        <Col>
                                                            <TextArea style={{ width: 200 }}
                                                                placeholder="Controlled autosize"
                                                                autoSize={{ minRows: 3, maxRows: 5 }}
                                                                showCount
                                                                value={get(this.state.information, 'content')}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        information: { ...this.state.information, content: e.target.value }
                                                                    })
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ textAlign: 'center', paddingTop: "20px" }}>
                                                        <div>
                                                            <Button type="primary" onClick={() => this.createInfomation()} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                                                        </div>
                                                    </Row>
                                                </>}
                                                {this.state.isAddFileWord && <>
                                                    <div style={{
                                                        fontStyle: "italic",
                                                        color: "#cacaca"
                                                    }}>
                                                        {t('setting_file')}
                                                    </div>
                                                    <Row style={{ margin: '10px 0' }}>
                                                        <Col span={6} style={{ fontWeight: 700 }}>
                                                            {t('timeline')}
                                                        </Col>
                                                        <Col>
                                                            <Select defaultValue={this.state.timelineId} style={{ width: 200 }} onChange={e => this.handleChange(e)}>
                                                                {
                                                                    this.state.lstTimelines.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                                                }
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ margin: '10px 0' }}>
                                                        <Col span={6} style={{ fontWeight: 700 }}>
                                                            {t('fileAttach')}
                                                        </Col>
                                                        <Col>
                                                            <Input type="file" onChange={e => this.handleProcessFile(e)} style={{ width: 200, borderRadius: 20, overflow: 'hidden' }} />
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ textAlign: "center" }}>
                                                        <div>
                                                            <Button type="primary" onClick={() => this.createFileWord()} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                                                        </div>
                                                    </Row>
                                                </>}
                                                {this.state.isAddTimeline && <>

                                                    <div style={{
                                                        fontStyle: "italic",
                                                        color: "#cacaca"
                                                    }}>
                                                        {t('setting_timeline')}
                                                    </div>
                                                    <Row style={{ margin: '10px 0' }}>
                                                        <Col span={6} style={{ fontWeight: 700 }}>
                                                            {t('name')}
                                                        </Col>
                                                        <Col>
                                                            <Input placeholder="Name timeline" style={{ width: 200 }}
                                                                value={get(this.state.timeLine, 'name')}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        timeLine: { ...this.state.timeLine, name: e.target.value }
                                                                    })
                                                                }} />
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ margin: '10px 0' }}>
                                                        <Col span={6} style={{ fontWeight: 700 }}>
                                                            {t('description')}
                                                        </Col>
                                                        <Col>
                                                            <TextArea style={{ width: 200 }}

                                                                placeholder="Description timeline"
                                                                autoSize={{ minRows: 3, maxRows: 5 }}
                                                                showCount
                                                                value={get(this.state.timeLine, 'description')}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        timeLine: { ...this.state.timeLine, description: e.target.value }
                                                                    })
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ textAlign: 'center', paddingTop: "20px" }}>
                                                        <div>
                                                            <Button type="primary" onClick={() => this.createTimeline()} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                                                        </div>
                                                    </Row>
                                                </>}

                                            </div>
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Col>
                            :
                            <Col span={8}
                                style={{
                                    margin: '10px',
                                    background: '#fff',
                                    borderRadius: '10px',
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
                                            <TabPane tab={<span> <AlertOutlined twoToneColor="#ff0000" />{t('dl')}</span>} key="1">
                                                <div style={{
                                                    maxHeight: '400px',
                                                    overflowY: 'auto'
                                                }}>
                                                    {this.state.deadlines.length > 0 ? this.state.deadlines.map(dl => (
                                                        <Row key={dl._id} style={{
                                                            marginBottom: 5, border: "2px solid #cacaca",
                                                            padding: "10px 0", cursor: 'pointer'
                                                        }} onClick={() => {
                                                            this.getRequirementAssignment(dl._id, dl.idSubject, dl.idTimeline);
                                                            // if(flagLoading){
                                                            //     this.setState({ visible: true })
                                                            // }
                                                        }}>
                                                            <Col span={10} style={{ textAlign: "center", alignSelf: "center" }}><i>
                                                                <img src={fastTime} width="36px" />
                                                            </i></Col>
                                                            <Col span={12} >
                                                                <div>{dl.name}</div>
                                                                <div>
                                                                    <span style={{ fontWeight: 600 }}>Due to: </span>{this.transTime(get(dl, 'expireTime'))}
                                                                </div>
                                                                <div>
                                                                    <span style={{ fontWeight: 600 }}>Time remaining:</span> {moment.utc(get(dl, 'expireTime')).fromNow()}
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    )) : <Row>
                                                            <img src={deadlineCalcular} />
                                                            <div style={{ width: "100%", color: '#cacaca', textAlign: 'center' }}>No upcoming deadline</div>
                                                        </Row>}
                                                </div>
                                            </TabPane>
                                            <TabPane tab={
                                                <span><CheckCircleTwoTone twoToneColor="#52c41a" />
                                                    {t('complt')}
                                                </span>} key="2">
                                                <div style={{
                                                    maxHeight: '400px',
                                                    overflowY: 'auto'
                                                }}>
                                                    {this.state.dueTo.map(dt => (
                                                        <Row key={dt._id} style={{
                                                            marginBottom: 5, color: "#2ecc71", border: "2px solid #cacaca",
                                                            padding: "10px 0"
                                                        }}>
                                                            <Col span={10} style={{ textAlign: "center", alignSelf: "center" }}><i>
                                                                <img src={fastTime} width="36px" />
                                                            </i></Col>
                                                            <Col span={10} >
                                                                <div>{dt.name}</div>
                                                                <div>
                                                                    <span style={{ fontWeight: 600 }}>Due to: </span>{this.transTime(get(dt, 'expireTime'))}
                                                                </div>
                                                                <div>
                                                                    <span style={{ fontWeight: 600 }}>Time remaining:</span> {moment.utc(get(dt, 'expireTime')).fromNow()}
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </div>
                                            </TabPane>
                                        </Tabs>
                                    </Row>
                                </div>
                            </Col>
                    }

                </Row>
            </>
        )
    }
}

export default withTranslation('translations')(Subject)
