import React from 'react'
import { useRouter } from 'next/router'
import IndexLayout from '../../pages-modules/layouts/layout'
import { Row, Col, Popover, Modal, Tooltip, Tabs, Input } from 'antd'

import styles from './styles.scss'
import './overwrite.css'

import add from '../../assets/images/contents/add.png'
import forum from '../../assets/images/contents/forum.png'
import excel from '../../assets/images/contents/excel.png'
import file from '../../assets/images/contents/file.png'
import pdf from '../../assets/images/contents/pdf.png'
import text from '../../assets/images/contents/text-editor.png'
import timeline from '../../assets/images/contents/timeline.png'
import word from '../../assets/images/contents/word.png'
import assignment from '../../assets/images/contents/assignment.png'

const { TextArea } = Input;
const { TabPane } = Tabs;

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

const CourseDetail = () => {
    const router = useRouter()
    const [visible, setVisible] = React.useState(false)

    const handleOk = e => {
        console.log(e);
        setVisible(false)
    };

    const handleCancel = e => {
        console.log(e);
        setVisible(false)
    };

    return <IndexLayout>
        <Modal
            title="[ Assignment ] Submission file word"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Submission" key="1">
                    <div>
                        <div>Submission status</div>
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
                    <div>- The level of employee competence required to complete the work successfully;</div>
                    <div> - The level of creativity required from performers to reach the goals of a task;
            </div>
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
                <div>
                    <Row style={{ marginBottom: "10px" }}>
                        <Col span={6} style={{ textAlign: "center" }}>
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
                    <Row style={{ marginBottom: "10px" }} onClick={() => setVisible(true)}>
                        <Col span={6} style={{ textAlign: "center" }}>
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
            </Col>
            <Col span={8}
                style={{
                    margin: '10px',
                    background: '#fff',
                    borderRadius: '10px',
                    minHeight: '200px'
                }}>
            </Col>
        </Row>
    </IndexLayout>
}

export default CourseDetail
