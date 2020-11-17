import { Checkbox, Row, Table, Tag, Space, Col, Popover, Modal, Tabs, Input, DatePicker, Upload, message, Button } from 'antd'
import React, { useState } from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import { InboxOutlined } from '@ant-design/icons'

import options from '../../assets/images/contents/option.png'
import add from '../../assets/images/contents/add.png'
import notificationBelt from '../../assets/images/contents/notificationsbelt.png'
import notificationEmpty from '../../assets/images/contents/notifications.png'
import assignment from '../../assets/images/contents/asignment.png'
import survey from '../../assets/images/contents/survey.png'

const { TabPane } = Tabs;
const { TextArea } = Input;

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
}

const { Dragger } = Upload;

const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags.map(tag => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <a>Delete</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];


const columnsSurvey = [
    {
        title: 'Mã số',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Tên khảo sát',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Hoàn thành',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <a>Review</a>
            </Space>
        ),
    },
];

const dataSurvey = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];



const StudentPage = ({ }) => {
    const [visibleAddStudent, setVisibleAddStudent] = useState(false);
    const [visibleNotification, setVisibleNotification] = useState(false);
    const [visibleAssignment, setVisibleAssignment] = useState(false);
    const [visibleSurvey, setVisibleSurvey] = useState(false);
    const [isHover, setHover] = useState(false)

    const content = (
        <div>
            <div style={{ padding: '10px 0' }} onClick={() => setVisibleAddStudent(true)}><i><img src={add} width="30px" /><span style={{ paddingLeft: '10px' }}>Thêm sinh viên</span></i></div>
            <div style={{ padding: '10px 0' }} onClick={() => setVisibleNotification(true)}><i><img src={notificationBelt} width="30px" /><span style={{ paddingLeft: '10px' }}>Thông báo</span></i></div>
            <div style={{ padding: '10px 0' }} onClick={() => setVisibleAssignment(true)}><i><img src={assignment} width="30px" /><span style={{ paddingLeft: '10px' }}>Bài tập</span></i></div>
            <div style={{ padding: '10px 0' }} onClick={() => setVisibleSurvey(true)}><i><img src={survey} width="30px" /><span style={{ paddingLeft: '10px' }}>Khảo sát</span></i></div>
        </div>
    );

    const handleHoverChange = (visible) => {
        setHover(visible)
    }

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    }


    return <IndexLayout>
        <Modal
            title="ADD STUDENTS"
            centered
            visible={visibleAddStudent}
            onOk={() => setVisibleAddStudent(false)}
            onCancel={() => setVisibleAddStudent(false)}
            width={1000}
        >
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Create notification" key="1">
                    <Row>
                        <Col>Subject</Col>
                        <Col>
                            <Input placeholder="Basic usage" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>Content</Col>
                        <Col>
                            <TextArea rows={4} />
                        </Col>
                    </Row>
                    <Row>
                        <Row>Customize<Checkbox onChange={onChange} /></Row>
                        <Row>
                            <div><span>Begin day</span>
                                <DatePicker onChange={onChange} />
                            </div>
                            <div><span>End day</span>
                                <DatePicker onChange={onChange} />
                            </div>
                        </Row>
                        <Row>
                            <span>Attachment</span>
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                            </Dragger>
                        </Row>

                    </Row>
                    <Row>
                        <div>
                            <Button>Create</Button>
                        </div>
                    </Row>
                </TabPane>
                <TabPane tab="Notifications" key="2">
                    <Row>
                        <div style={{
                            textAlign: 'center',
                            padding: '45px'
                        }}>
                            <i>
                                <img src={notificationEmpty} />
                            </i>
                            <div style={{ color: '#c4c4c4', fontStyle: 'italic' }}>Empty notification</div>
                        </div>

                    </Row>
                </TabPane>
                <TabPane tab="History" key="3">
                    Content of Tab Pane 3
            </TabPane>
            </Tabs>
        </Modal>

        <Modal
            title="NOTIFICATIONS"
            centered
            visible={visibleNotification}
            onOk={() => setVisibleNotification(false)}
            onCancel={() => setVisibleNotification(false)}
            width={1000}
        >
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Create notification" key="1">
                    <Row>
                        <Col>Subject</Col>
                        <Col>
                            <Input placeholder="Basic usage" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>Content</Col>
                        <Col>
                            <TextArea rows={4} />
                        </Col>
                    </Row>
                    <Row>
                        <Row>Customize<Checkbox onChange={onChange} /></Row>
                        <Row>
                            <div><span>Begin day</span>
                                <DatePicker onChange={onChange} />
                            </div>
                            <div><span>End day</span>
                                <DatePicker onChange={onChange} />
                            </div>
                        </Row>
                        <Row>
                            <span>Attachment</span>
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                            </Dragger>
                        </Row>

                    </Row>
                    <Row>
                        <div>
                            <Button>Create</Button>
                        </div>
                    </Row>
                </TabPane>
                <TabPane tab="Notifications" key="2">
                    <Row>
                        <div style={{
                            textAlign: 'center',
                            padding: '45px'
                        }}>
                            <i>
                                <img src={notificationEmpty} />
                            </i>
                            <div style={{ color: '#c4c4c4', fontStyle: 'italic' }}>Empty notification</div>
                        </div>

                    </Row>
                </TabPane>
                <TabPane tab="History" key="3">
                    Content of Tab Pane 3
            </TabPane>
            </Tabs>
        </Modal>

        <Modal
            title="ASSIGNMENTS"
            centered
            visible={visibleAssignment}
            onOk={() => setVisibleAssignment(false)}
            onCancel={() => setVisibleAssignment(false)}
            width={1000}
        >
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Submission" key="1">
                    <div>Submission status</div>
                    <div>Due date: <span>Tuesday, 20/10/2020</span></div>
                    <div>Time remaining: <span>Remaining 20 hours</span></div>
                    <div>Last modified</div>
                    <div>File submission</div>
                    <div>Submission comments</div>
                    <Button>Submit</Button>
                </TabPane>
                <TabPane tab="Requirement" key="2">
                    <div>[Content requirement]</div>
                    <div>
                        - Completeness of certain preceding tasks;
                        - The level of employee competence required to complete the work successfully;
                        - The level of creativity required from performers to reach the goals of a task;
                    </div>
                    <div>File Attachment</div>
                </TabPane>
                <TabPane tab="Grade" key="3">
                    Content of Tab Pane 3
            </TabPane>
            </Tabs>
        </Modal>

        <Modal
            title="SURVEYS"
            centered
            visible={visibleSurvey}
            onOk={() => setVisibleSurvey(false)}
            onCancel={() => setVisibleSurvey(false)}
            width={1000}
        >
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Surveys" key="1">
                <div style={{ width: '90%' }}>
                <Row style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                    <Checkbox onChange={onChange} style={{ color: '#ff0000' }}>Bulk Delete</Checkbox>
                </Row>
                <Row style={{ width: '100%' }}>
                    <Table columns={columnsSurvey} dataSource={dataSurvey} style={{ width: '100%' }} />
                </Row>
            </div>
                </TabPane>
                <TabPane tab="Surveys" key="2">

                </TabPane>
                <TabPane tab="History" key="3">
                    Content of Tab Pane 3
            </TabPane>
            </Tabs>
        </Modal>

        <Row style={{
            width: '80%',
            textAlign: 'center',
            background: '#fff',
            borderRadius: '15px',
            minHeight: '20px'
        }}>
            <Row style={{ width: '100%' }}>
                <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</Col>
                <Col span={4} style={{ padding: '25px 0' }}>
                    <Popover placement="bottom" title="Tùy chọn" content={content} visible={isHover} onVisibleChange={handleHoverChange}>
                        <i>
                            <img src={options} style={{ width: '50px' }} />
                        </i>
                    </Popover>
                </Col>
            </Row>
            <div style={{ width: '90%' }}>
                <Row style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                    <Checkbox onChange={onChange} style={{ color: '#ff0000' }}>Bulk Delete</Checkbox>
                </Row>
                <Row style={{ width: '100%' }}>
                    <Table columns={columns} dataSource={data} style={{ width: '100%' }} />
                </Row>
            </div>
        </Row>

    </IndexLayout>
}

export default StudentPage
