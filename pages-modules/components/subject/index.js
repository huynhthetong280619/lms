import React from 'react'
import { Row, Col, Popover, Modal, Tooltip, Tabs, Input, Timeline, Select, Button, Checkbox, InputNumber } from 'antd'
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
import loudspeaker from '../../../assets/images/contents/loudspeaker.png'
import timeline from '../../../assets/images/contents/timeline.png'
import word from '../../../assets/images/contents/word.png'
import assignment from '../../../assets/images/contents/assignment.png'
import quiz from '../../../assets/images/contents/quiz.png'
import student from '../../../assets/images/contents/student.png'
import { withTranslation } from 'react-i18next';
import restClient from '../../../assets/common/core/restClient';
import { MoreOutlined, ClockCircleOutlined, SettingOutlined, AndroidOutlined, DeleteOutlined } from '@ant-design/icons'
import moment from 'moment'
import fetch from 'node-fetch';
require('isomorphic-fetch');
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import glb_sv from '../../../assets/global/global.service';

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
                    startTime: new Date(),
                    expireTime: new Date(),
                    isOverDue: false,
                    overDueDate: new Date(),
                    fileSize: ''
                }
            },
            quiz: {
                name: '',
                content: '',
                startTime: new Date(),
                expireTime: new Date(),
                setting: {
                    questionCount: null,
                    timeToDo: null,
                    code: null,
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
            selectedDay: (new Date()),
        }
    }

    async componentDidMount() {
        await restClient.asyncGet(`/timeline?idSubject=${this.props.idSubject}`)
            .then(res => {
                if (!res.hasError) {
                    console.log('res', res)
                    this.setState({
                        lstTimelines: res.data,
                        timelineId: get(head(res.data), '_id')
                    })
                }
            })

        await restClient.asyncGet(`/quiz?idSubject=${this.props.idSubject}`)
            .then(res => {
                if (!res.hasError) {
                    console.log('res', res)
                    this.setState({
                        lstQuizzis: res.data,
                        quizId: get(head(res.data), '_id')
                    })
                }
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
                index: index + 1
            }
        })

        console.log('cv', cv)
        this.setState({ updateTimelines: cv });
        console.log('items', items, cv);
    }

    updateTimelines = async () => {
        // await fetch('https://spkt-server.herokuapp.com/subject/lthdt01/index', {
        //     method: 'POST',
        //     headers: {
        //         Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ0aGl2YW4iLCJpYXQiOjE2MDQ4MjcyOTF9.CdHuoyPgBRtbPpX1rqqZEPvyiaCEb-R2NHo4N01TOcY',
        //         'Content-Type': 'application/json',
        //         'Access-Control-Allow-Origin':'*',
        //         mode: 'no-cors'
        //     },
        //     body: JSON.stringify(
        //         this.state.updateTimelines
        //     ),
        //     }).then(res => res.json())
        //   .then(data => {
        //       console.log('updateTimeline', data)
        //   })

        await restClient.asyncPost('/subject/lthdt01/index', this.state.updateTimelines)
            .then(data => console.log('updateTimeline', data))
    }

    handleSwitchMode = (e) => {
        this.setState({
            isTeacher: !this.state.isTeacher
        })
        if (e === false) {
            this.updateTimelines();
            return;
        }
    }

    transTime = (time) => {
        return moment(time).format('MMM DD h:mm A')
    }

    getRequirementAssignment = async (id, idSubject, idTimeline) => {
        const res = await fetch(`https://spkt-server.herokuapp.com/assignment/${id}?idSubject=${idSubject}&idTimeline=${idTimeline}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ0aGl2YW4iLCJpYXQiOjE2MDQ4MjcyOTF9.CdHuoyPgBRtbPpX1rqqZEPvyiaCEb-R2NHo4N01TOcY'
            }

        });

        const data = await res.json();

        this.setState({
            assigmentRequirement: data
        })

        console.log('getRequirementAssignment', data)
    }

    deleteExercise = async () => {

    }

    deleteQuiz = async () => {

    }

    deleteForum = async () => {

    }

    handleProcessFile = (e) => {
        console.log('handleProcessFile', head(e.target.files))
    

       
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
        this.setState({ quiz: { ...this.state.quiz, startTime: (new Date(day)).getTime() } });
    }

    handleSelectExpireTimeQuiz(day) {
        this.setState({ quiz: { ...this.state.quiz, expireTime: (new Date(day)).getTime() } });
    }


    handleSelectoverDueDate(day) {
        this.setState({ assignment: { ...this.state.assignment, setting: { ...this.state.assignment.setting, overDueDate: day } } });
    }

    handleFileSize(size) {
        this.setState({ assignment: { ...this.state.assignment, setting: { ...this.state.assignment.setting, fileSize: size } } });
    }

    handleIsOverDue = (status) => {
        this.setState({ assignment: { ...this.state.assignment, setting: { ...this.state.assignment.setting, isOverDue: status.target.checked } } });
    }

    createFileWord = async () => {
        const formData = new FormData();
        formData.append('file', this.state.FileData)

        console.log(formData.get('file'))
        console.log(this.state.FileData, formData)
        await restClient.asyncPostFile(`/timeline/${this.state.timelineId}/upload?idSubject=${this.props.idSubject}`, formData)
        .then(res => {
            console.log('createFileWord', res)
        })
    }

    createQuiz = async () => {
        console.log(this.state.quiz)
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: this.state.timelineId,
            data: this.state.quiz
        }

        console.log('data', data)
        await restClient.asyncPost('/exam', data)
            .then(res => {
                console.log(res)
                if (!res.hasError) {
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)

                    head(timelineUpdate).quiz.push(res.data)


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
                            startTime: new Date(),
                            expireTime: new Date(),
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
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: this.state.timelineId,
            data: this.state.assignment
        }
        await restClient.asyncPost('/assignment', data)
            .then(res => {
                console.log(res)
                if (!res.hasError) {
                    let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)

                    head(timelineUpdate).assignments.push(res.data)


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
                                startTime: new Date(),
                                expireTime: new Date(),
                                isOverDue: false,
                                overDueDate: new Date(),
                                fileSize: ''
                            }
                        }
                    })
                }
            })
    }

    createTimeline = async () => {
        const data = {
            idSubject: this.props.idSubject,
            data: this.state.timeLine
        }
        await restClient.asyncPost('/timeline', data)
            .then(res => {
                if (!res.hasError) {
                    this.setState({
                        timelines: [...this.state.timelines, get(res, 'data')]
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
            isAddQuiz: false
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
            isAddQuiz: false
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
            isAddQuiz: false
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
            isAddQuiz: false

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
            isAddQuiz: false
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
            isAddQuiz: false
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
            isAddQuiz: true
        })
    }


    createInfomation = async () => {
        console.log(this.state.information)
        const data = {
            idSubject: this.props.idSubject,
            idTimeline: this.state.timelineId,
            data: this.state.information
        }
        await restClient.asyncPost('/information', data)
            .then(res => {
                console.log('information', res)
                let timelineUpdate = this.state.timelines.filter(({ _id }) => _id === data.idTimeline)

                head(timelineUpdate).information.push(res.data)


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
            })
    }


    downloadFile = async (idTimeline, idFile) => {
        await restClient.asyncGet(`/timeline/${idTimeline}/download/${idFile}?idSubject=${this.props.idSubject}`)
        .then(res => {
            console.log(res)
        })
    }

    render() {

        const { t } = this.props;


        console.log(this.state.timelines)

        const content = (
            <div>
                <span style={{ margin: '0 10px' }} onClick={() => this.addFilePdf()}>
                    <i>
                        <Tooltip title="Add file pdf">
                            <img src={pdf} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
                <span style={{ margin: '0 10px' }} onClick={() => this.addFileWord()}>
                    <i>
                        <Tooltip title="Add file word">
                            <img src={word} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
                <span style={{ margin: '0 10px' }} onClick={() => this.addFileExcel()}>
                    <i>
                        <Tooltip title="Add file excel">
                            <img src={excel} style={{ width: '50px' }} />
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
            </div>
        );

        const template = (id, name, description, assignments, exams, forums, infomation, files) => (
            <div style={{ margin: '0 10px 10px 10px', border: "2px solid #cacaca" }}>
                <div >
                    <Row
                        style={{
                            padding: 10,
                            background: "#cacaca",
                            marginBottom: 10,
                            fontWeight: 600
                        }}
                    >
                        <Col span={6}>
                            {
                                name.toUpperCase()
                            }
                        </Col>
                        <Col span={6}>
                            {
                                description.toUpperCase()
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
                                            <Timeline.Item key={info._id} dot={info.isNew && <ClockCircleOutlined className="timeline-clock-icon" />} >
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
                        files != null ? (
                            files.map(f => (
                                <Row style={{ marginBottom: 10 }} key={f._id} onClick={() => this.downloadFile(id, f._id)}>
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
                                        <div>[{t('Files')}] {f.name}</div> {this.state.isTeacher && <DeleteOutlined style={{ marginLeft: 10, color: '#ff4000' }} />}
                                    </Col>
                                </Row>
                            ))

                        ) : null
                    }


                    {
                        assignments != null ? (
                            assignments.map(assign => (
                                <Row style={{ marginBottom: 10 }} onClick={() => {
                                    this.getRequirementAssignment(assign._id, 'lthdt01', id);
                                    this.setState({ visible: true })
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
                                        <div>[{t('exercise')}] {assign.name}</div> {this.state.isTeacher && <DeleteOutlined style={{ marginLeft: 10, color: '#ff4000' }} />}
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
                                        <a href={`/forums/${fr._id}`}>[{t('discussion_forum')}] {fr.name}</a>{this.state.isTeacher && <DeleteOutlined style={{ marginLeft: 10, color: '#ff4000' }} />}
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
                                        <a href={`/quizzis/${ex._id}/${id}`}>[{t('quiz')}] {ex.name}</a>{this.state.isTeacher && <DeleteOutlined style={{ marginLeft: 10, color: '#ff4000' }} />}
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
                                    <span style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</span>
                                </div>

                            </div>

                            {
                                this.state.timelines.map(({ _id, name, description, assignments, exams, forums, information, files }, index) => {
                                    console.log('assignment', assignments, exams, forums, information)
                                    return (
                                        <Draggable key={_id} draggableId={_id} index={index} >
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {template(_id, name, description, assignments, exams, forums, information, files)}
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
                        <span style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</span>
                    </div>

                </div>
                <Row style={{ marginBottom: 10 }} >
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
                        <a href="/students">Quản lý sinh viên</a>
                    </Col>
                </Row>

                {
                    this.state.timelines.map(({ _id, name, description, assignments, exams, forums, information, files }) => (
                        <div key={_id}>
                            {template(_id, name, description, assignments, exams, forums, information, files)}
                        </div>
                    )
                    )
                }
            </Col>
        )



        return (
            <>
                <Modal
                    title="[ Assignment ] Submission file word"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="Submission" key="1">
                            <div>
                                <div>{t('sbmit_stat')}</div>
                                <div>
                                    <span style={{ fontWeight: 600 }}>Due date: </span>
                                    <span>{this.transTime(get(this.state.assigmentRequirement, 'setting')?.expireTime)}</span>
                                </div>
                                <div>
                                    <span style={{ fontWeight: 600 }}>Time remaining: </span>
                                    <span>Remaining 20 hours</span>
                                </div>
                                <div>
                                    <span style={{ fontWeight: 600 }}>Last modified: </span>
                                    <span>{this.transTime(head(get(this.state.assigmentRequirement, 'submission'))?.submitTime)}</span>
                                </div>
                                <div>
                                    <span>File submissions</span>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Requirement" key="2">
                            <div style={{ fontWeight: "700" }}>[Content requirement]</div>
                            <div dangerouslySetInnerHTML={{ __html: get(this.state.assigmentRequirement, 'content') }} />
                            {/* <div>
                                {get(this.state.assigmentRequirement, 'content')}
                            </div> */}
                            <div style={{ fontWeight: "700" }}>File attachment</div>
                        </TabPane>
                        <TabPane tab="Grade" key="3">
                            <div>Grade status</div>
                            <div>
                                <span style={{ fontWeight: 600 }}>Grade: </span>
                                <span>{get(head(get(this.state.assigmentRequirement, 'submission'))?.feedBack, 'grade')}</span>
                            </div>
                            <div>
                                <span style={{ fontWeight: 600 }}>Grade on: </span>
                                <span>{this.transTime(get(head(get(this.state.assigmentRequirement, 'submission'))?.feedBack, 'gradeOn'))}</span>
                            </div>
                            <div>
                                <div style={{ marginBottom: 10 }}>Feedback comments</div>
                                <TextArea rows={2} />
                            </div>
                        </TabPane>
                    </Tabs>
                </Modal>
                <Row className={styles.background} style={{ justifyContent: 'center' }}>
                    {
                        this.state.isTeacher ? contentTeacher : contentNormal
                    }


                    {
                        glb_sv.isTeacher

                            ?
                            <Col span={8}
                                style={{
                                    margin: '10px',
                                    background: '#fff',
                                    borderRadius: '10px',
                                    minHeight: '200px'
                                }}>
                                <div
                                    style={{
                                        textAlign: 'center',
                                        padding: 10
                                    }}>

                                    <Tabs defaultActiveKey="2">
                                        <TabPane
                                            tab={
                                                <span>
                                                    <SettingOutlined />
                                                    {t('setting')}
                                                </span>
                                            }
                                            key="1"
                                        >
                                            Tab 1
</TabPane>
                                        <TabPane
                                            tab={
                                                <span>
                                                    <AndroidOutlined />
                                                    {t('add_content')}
                                                </span>
                                            }
                                            key="2"
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

                                            {
                                                this.state.isAddQuiz && (<div>
                                                    <Row style={{ margin: '10px 0' }}>
                                                        <Col span={4}>
                                                            Time line
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
                                                        <Col span={4}>
                                                            Name
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
                                                        <Col span={4}>
                                                            Content
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
                                                    <Row>
                                                        <Col>
                                                            <span>Start time: </span>
                                                        </Col>
                                                        <Col>
                                                            <DayPickerInput onDayChange={e => this.handleSelectStartTimeQuiz(e)} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <span>Expire time: </span>
                                                        </Col>
                                                        <Col>
                                                            <DayPickerInput onDayChange={e => this.handleSelectExpireTimeQuiz(e)} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        Setting
                        </Row>

                                                    <Row>
                                                        <Col>
                                                            <span>Question quantity: </span>
                                                        </Col>
                                                        <Col>
                                                            <InputNumber size="small" min={1} max={100000} defaultValue={3} onChange={e => this.changeQuantityQuestion(e)} />
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col>
                                                            <span>Time to do: </span>
                                                        </Col>
                                                        <Col>
                                                            <InputNumber size="small" min={1} max={180} defaultValue={3} onChange={e => this.changeTimeTodo(e)} />
                                                        </Col>
                                                    </Row>

                                                    <Row style={{ margin: '10px 0' }}>
                                                        <Col span={4}>
                                                            Code
                    </Col>
                                                        <Col>
                                                            <Select defaultValue={this.state.quizId} style={{ width: 200 }} onChange={e => this.handleCodeQuiz(e)}>
                                                                {
                                                                    this.state.lstQuizzis.map(q => (<Option value={q._id} key={q._id}>{q.name}</Option>))
                                                                }
                                                            </Select>
                                                        </Col>
                                                    </Row>


                                                    <Row>
                                                        <Col>
                                                            <span>Attemp quantity: </span>
                                                        </Col>
                                                        <Col>
                                                            <InputNumber size="small" min={1} max={10} defaultValue={3} onChange={e => this.changeAttempQuantity(e)} />
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Button onClick={() => this.createQuiz()}>Submit</Button>
                                                    </Row>
                                                </div>)
                                            }

                                            {
                                                this.state.isAddAssignment && (<div>
                                                    <Row style={{ margin: '10px 0' }}>
                                                        <Col span={4}>
                                                            Time line
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
                                                        <Col span={4}>
                                                            Name
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
                                                        <Col span={4}>
                                                            Content
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
                                                    <Row>
                                                        <Col>
                                                            <span>Start time: </span>
                                                        </Col>
                                                        <Col>
                                                            <DayPickerInput onDayChange={e => this.handleSelectStartTime(e)} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <span>Expire time: </span>
                                                        </Col>
                                                        <Col>
                                                            <DayPickerInput onDayChange={e => this.handleSelectExpireTime(e)} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <span>isOverDue</span>
                                                        </Col>
                                                        <Col>
                                                            <Checkbox onChange={e => this.handleIsOverDue(e)}>Checkbox</Checkbox>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col>
                                                            <span>Over due date: </span>
                                                        </Col>
                                                        <Col>
                                                            <DayPickerInput onDayChange={e => this.handleSelectoverDueDate(e)} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <span>File size</span>
                                                        </Col>
                                                        <Col>
                                                            <Select defaultValue="5" style={{ width: 200 }} onChange={e => this.handleFileSize(e)}>
                                                                <Option value="5">5</Option>
                                                                <Option value="10">10</Option>
                                                                <Option value="15">
                                                                    15
                            </Option>
                                                                <Option value="20">20</Option>
                                                            </Select>
                                                        </Col>
                                                    </Row>


                                                    <Row>
                                                        <Button onClick={() => this.createAssignment()}>Submit</Button>
                                                    </Row>
                                                </div>)
                                            }

                                            {this.state.isAddInfomation && <div>
                                                <Row style={{ margin: '10px 0' }}>
                                                    <Col span={4}>
                                                        Time line
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
                                                    <Col span={4}>
                                                        Name
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
                                                    <Col span={4}>
                                                        Content
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
                                                <Row>
                                                    <Button onClick={() => this.createInfomation()}>Submit</Button>
                                                </Row>
                                            </div>}

                                            {this.state.isAddFileWord && <div>
                                                <Row style={{ margin: '10px 0' }}>
                                                    <Col span={4}>
                                                        Time line
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
                                                    <Col span={4}>
                                                        File attachment:
                    </Col>
                                                    <Col>
                                                        <Input type="file" onChange={e => this.handleProcessFile(e)} />
                                                    </Col>

                                                </Row>

                                                <Row>
                                                    <Button onClick={() => this.createFileWord()}>Submit</Button>
                                                </Row>
                                            </div>}

                                            {this.state.isAddTimeline && <div>

                                                <Row style={{ margin: '10px 0' }}>
                                                    <Col span={4}>
                                                        Name
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
                                                    <Col span={4}>
                                                        Description
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
                                                <Row>
                                                    <Button onClick={() => this.createTimeline()}>Submit</Button>
                                                </Row>
                                            </div>}


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
                                                {this.state.deadlines.length > 0 ? this.state.deadlines.map(dl => (
                                                    <Row key={dl._id} style={{ marginBottom: 5 }}>
                                                        <Col span={10} style={{ textAlign: "center", alignSelf: "center" }}><i>
                                                            <img src={fastTime} width="36px" />
                                                        </i></Col>
                                                        <Col span={10} >
                                                            <div>{dl.name}</div>
                                                            <div>
                                                                <span style={{ fontWeight: 600 }}>Due to: </span>{this.transTime(get(dl, 'expireTime'))}
                                                            </div>
                                                            <div>
                                                                <span style={{ fontWeight: 600 }}>Time remaining:</span> 2 hours
                                                                    </div>
                                                        </Col>
                                                    </Row>
                                                )) : <Row>
                                                        <img src={deadlineCalcular} />
                                                        <div style={{ width: "100%", color: '#cacaca', textAlign: 'center' }}>No upcoming deadline</div>
                                                    </Row>}
                                            </TabPane>
                                            <TabPane tab={
                                                <span><CheckCircleTwoTone twoToneColor="#52c41a" />
                                                    {t('complt')}
                                                </span>} key="2">
                                                <div>
                                                    {this.state.dueTo.map(dt => (
                                                        <Row key={dt._id} style={{ marginBottom: 5, color: "#2ecc71" }}>
                                                            <Col span={10} style={{ textAlign: "center", alignSelf: "center" }}><i>
                                                                <img src={fastTime} width="36px" />
                                                            </i></Col>
                                                            <Col span={10} >
                                                                <div>{dt.name}</div>
                                                                <div>
                                                                    <span style={{ fontWeight: 600 }}>Due to: </span>{this.transTime(get(dt, 'expireTime'))}
                                                                </div>
                                                                <div>
                                                                    <span style={{ fontWeight: 600 }}>Time remaining:</span> 2 hours
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
