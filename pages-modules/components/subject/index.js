import React from 'react'
import { Row, Col, Popover, Modal, Tooltip, Tabs, Input } from 'antd'
import { Switch } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import styles from './styles.scss'
import './overwrite.css'
import { get } from 'lodash';
import add from '../../../assets/images/contents/add.png'
import forum from '../../../assets/images/contents/forum.png'
import excel from '../../../assets/images/contents/excel.png'
import file from '../../../assets/images/contents/file.png'
import pdf from '../../../assets/images/contents/pdf.png'
import text from '../../../assets/images/contents/text-editor.png'
import timeline from '../../../assets/images/contents/timeline.png'
import word from '../../../assets/images/contents/word.png'
import assignment from '../../../assets/images/contents/assignment.png'
import movement from '../../../assets/images/contents/move.png'
import { withTranslation } from 'react-i18next';

const { TextArea } = Input;
const { TabPane } = Tabs;

class Subject extends React.Component{

    constructor(props){
        super(props);

        this.state= {
            visible: false,
            timelines: []
        }
    }

    componentDidMount(){
        this.setState({
            timelines: get(this.props.subject, 'timelines')
        })
    }

    handleOk = e => {
        console.log(e);
        
    };

     handleCancel = e => {
        console.log(e);
        this.setState({visible: false})
    };

    handleOnDragEnd =async (result) => {
        console.log('handleOnDragEnd', result)
        if (!result.destination) return;
    
        const items = Array.from(this.state.timelines);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
    
       this.setState({
           timelines: items
       });
    
        console.log('items', items);
    }

    render(){

        const {t} = this.props;

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
        
        const template = (id, name) => (
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
                            {name}
                        </Col>
                        <Col span={12} style={{textAlign: 'right'}}>
                        <img src={movement} width="20px" />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                        <Col span={6} style={{ textAlign: "left" }}>
                            <i>
                                <img src={forum} />
                            </i>
                        </Col>
                        <Col span={17} style={{
                            fontSize: '20px',
                            lineHeight: '3.5'
                        }}>
                            <div>Diễn đàn tin tức</div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }} onClick={() => this.setState({visible: true})}>
                        <Col span={6} style={{ textAlign: "left" }}>
                            <i>
                                <img src={assignment} />
                            </i>
                        </Col>
                        <Col span={17} style={{
                            fontSize: '20px',
                            lineHeight: '3.5'
                        }}>
                            <div>[Assignment] Submission file word</div>
                        </Col>
                    </Row>
                </div>
                <Row style={{
                    background: '#cacaca',
                    borderRadius: '30px',
                    padding: '10px 0',
                    width: '15%',
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
                            <span>Due date</span>
                            <span>Tuesday, 20/10/2020</span>
                        </div>
                        <div>
                            <span>Time remaining</span>
                            <span>Remaining 20 hours</span>
                        </div>
                        <div>
                            <span>Last modified</span>
                            <span>Wednesday, 26 February 2020, 12:25 PM</span>
                        </div>
                        <div>
                            <span>File submissions</span>
                        </div>
                        <div>
                            <div>Submission comments</div>
                            <TextArea rows={4} />
                        </div>

                    </div>
                </TabPane>
                <TabPane tab="Requirement" key="2">
                    <div style={{ fontWeight: "700" }}>[Content requirement]</div>
                    <div>
                        - Completeness of certain preceding tasks;</div>
                    <div>- The level of employee competence required to complete the work successfully</div>
                    <div> - The level of creativity required from performers to reach the goals of a task</div>
                    <div style={{ fontWeight: "700" }}>File attachment</div>
                </TabPane>
                <TabPane tab="Grade" key="3">
                    <div>Grade status</div>
                    <div>
                        <span>Grade</span>
                        <span>100.0/100.0</span>
                    </div>
                    <div>
                        <span>Grade on</span>
                        <span>Friday, 17 April 2020, 11:18 PM</span>
                    </div>
                    <div>
                        <span>File submissions</span>
                    </div>
                    <div>
                        <div>Feedback comments</div>
                        <TextArea rows={4} />
                    </div>
                </TabPane>
            </Tabs>
        </Modal>
        <Row className={styles.background} style={{ justifyContent: 'center' }}>
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
                    this.state.timelines.map(({_id, name}, index) => {
                        return (
                            <Draggable key={_id} draggableId={_id} index={index} >
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  {template(_id, name)}
                                </div>
                              )}
                        </Draggable>)
                    })
                }
            </Col>
            )}
            </Droppable>
        </DragDropContext>
        
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
                    <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked />
                </div>
            </Col>
        </Row>
            </>
        )
    }
}

export default withTranslation('translations')(Subject)
