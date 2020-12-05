import React from 'react'
import { Row, Col, Popover, Modal, Tooltip, Tabs, Input, Timeline } from 'antd'
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
import text from '../../../assets/images/contents/text-editor.png'
import timeline from '../../../assets/images/contents/timeline.png'
import word from '../../../assets/images/contents/word.png'
import assignment from '../../../assets/images/contents/assignment.png'
import quiz from '../../../assets/images/contents/quiz.png'
import movement from '../../../assets/images/contents/move.png'
import { withTranslation } from 'react-i18next';
import restClient from '../../../assets/common/core/restClient';
import { MoreOutlined, ClockCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import fetch from 'node-fetch';
require('isomorphic-fetch');

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
            assigmentRequirement: {}
        }
    }

    componentDidMount() {
        this.setState({
            timelines: get(this.props.subject, 'timelines')
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
        this.setState({ updateTimelines: uptTimelines });
        console.log('items', items, uptTimelines);
    }

    updateTimelines = async () => {
        const res = await restClient.asyncPost(`/subject/${this.props.idSubject}/index`, {
            data: this.state.updateTimelines
        })

        console.log('updateTimelines', res);
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

    render() {

        const { t } = this.props;

        console.log(this.state.timelines)
        const content = (
            <div>
                <span style={{ margin: '0 10px' }}>
                    <i>
                        <Tooltip title="Add file pdf">
                            <img src={pdf} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
                <span style={{ margin: '0 10px' }}>
                    <i>
                        <Tooltip title="Add file word">
                            <img src={word} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
                <span style={{ margin: '0 10px' }}>
                    <i>
                        <Tooltip title="Add file excel">
                            <img src={excel} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
                <span style={{ margin: '0 10px' }}>
                    <i>
                        <Tooltip title="Add file text">
                            <img src={text} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
                <span style={{ margin: '0 10px' }}>
                    <i>
                        <Tooltip title="Add file timeline">
                            <img src={timeline} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
                <span style={{ margin: '0 10px' }}>
                    <i>
                        <Tooltip title="Add other file">
                            <img src={file} style={{ width: '50px' }} />
                        </Tooltip>
                    </i>
                </span>
            </div>
        );

        const template = (id, name, assignments, exams, forums, infomation) => (
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
                        <Col span={12}>
                            {
                                name
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
                                        <div>[Assignment] {assign.name}</div>
                                    </Col>
                                </Row>
                            ))

                        ) : null
                    }

                    {
                        forums != null ? (
                            forums.map(fr => (
                                <Row style={{ marginBottom: 10, cursor: 'pointer' }}  key={fr._id}>
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
                                        <a href={`/forums/${fr._id}`}>[Forum] {fr.name}</a>
                                    </Col>
                                </Row>
                            ))

                        ) : null
                    }

                    {
                        exams != null ? (
                            exams.map(ex => (
                                <Row style={{ marginBottom: 10 }} onClick={() => this.setState({ visible: true })} key={ex._id}>
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
                                        <div>[Quiz] {ex.name}</div>
                                    </Col>
                                </Row>
                            ))

                        ) : null
                    }

                </div>
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
                                this.state.timelines.map(({ _id, name, assignments, exams, forums, information }, index) => {
                                    console.log('assignment', assignments, exams, forums, information)
                                    return (
                                        <Draggable key={_id} draggableId={_id} index={index} >
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    {template(_id, name, assignments, exams, forums, information)}
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

                {
                    this.state.timelines.map(({ _id, name, assignments, exams, forums, information }) => (
                        <div key={_id}>
                            {template(_id, name, assignments, exams, forums, information)}
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
                                    <span style={{fontWeight: 600}}>Due date: </span>
                                    <span>{this.transTime(get(this.state.assigmentRequirement, 'setting')?.expireTime)}</span>
                                </div>
                                <div>
                                    <span style={{fontWeight: 600}}>Time remaining: </span>
                                    <span>Remaining 20 hours</span>
                                </div>
                                <div>
                                    <span style={{fontWeight: 600}}>Last modified: </span>
                                    <span>{this.transTime(head(get(this.state.assigmentRequirement, 'submission'))?.submitTime)}</span>
                                </div>
                                <div>
                                    <span>File submissions</span>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Requirement" key="2">
                            <div style={{ fontWeight: "700" }}>[Content requirement]</div>
                            <div dangerouslySetInnerHTML={{__html: get(this.state.assigmentRequirement, 'content')}} />
                            {/* <div>
                                {get(this.state.assigmentRequirement, 'content')}
                            </div> */}
                            <div style={{ fontWeight: "700" }}>File attachment</div>
                        </TabPane>
                        <TabPane tab="Grade" key="3">
                            <div>Grade status</div>
                            <div>
                                <span style={{fontWeight: 600}}>Grade: </span>
                                <span>{get(head(get(this.state.assigmentRequirement, 'submission'))?.feedBack, 'grade')}</span>
                            </div>
                            <div>
                                <span style={{fontWeight: 600}}>Grade on: </span>
                                <span>{this.transTime(get(head(get(this.state.assigmentRequirement, 'submission'))?.feedBack, 'gradeOn'))}</span>
                            </div>
                            <div>
                                <div style={{marginBottom: 10}}>Feedback comments</div>
                                <TextArea rows={2} />
                            </div>
                        </TabPane>
                    </Tabs>
                </Modal>
                <Row className={styles.background} style={{ justifyContent: 'center' }}>
                    {
                        this.state.isTeacher ? contentTeacher : contentNormal
                    }

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
                            <Switch checkedChildren="Off" unCheckedChildren="Off" defaultChecked onChange={e => this.handleSwitchMode(e)} />
                        </div>
                    </Col>
                </Row>
            </>
        )
    }
}

export default withTranslation('translations')(Subject)
