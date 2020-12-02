import React from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { Checkbox, Row, Table, Tag, Space, Col, Popover, Modal, Tabs, Input, DatePicker, Upload, message, Button } from 'antd'

import options from '../../../assets/images/contents/option.png'
import add from '../../../assets/images/contents/add.png'
import notificationBelt from '../../../assets/images/contents/notificationsbelt.png'
import notificationEmpty from '../../../assets/images/contents/notifications.png'
import assignment from '../../../assets/images/contents/asignment.png'
import survey from '../../../assets/images/contents/survey.png'
import {withTranslation} from 'react-i18next'
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
        title: 'Avatar',
        dataIndex: 'urlAvatar',
        key: 'urlAvatar',
        render: (data) => <img src={data} width="102px"/>
    },
    {
        title: 'MSSV',
        dataIndex: '_id',
        key: '_id',
    },
    {
        title: 'Email',
        dataIndex: 'emailAddress',
        key: 'emailAddress'
    },
    {
        title: 'Sure Name',
        dataIndex: 'surName',
        key: 'surName',
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
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



class Student extends React.Component {

    state = {
        visibleAddStudent: false,
        visibleNotification: false,
        visibleAssignment: false,
        visibleSurvey: false,
        isHover: false,
        lstStdnt: [],
        selectedRowKeys: [],
        loading: false
    }


    componentDidMount(){
        this.setState({
            lstStdnt: this.props.listStudent
        })
    }
    handleHoverChange = (visible) => {
        this.setState({ isHover: visible })
    }


    onChange = (date, dateString) => {
        console.log(date, dateString);
    }

    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }, 1000);
      };

      onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      };

    render() {

        console.log('render', this.props.listStudent)
        const content = (
            <div>
                <div style={{ padding: '10px 0' }} onClick={() => this.setState({ visibleAddStudent: true })}><i><img src={add} width="30px" /><span style={{ paddingLeft: '10px' }}>Thêm sinh viên</span></i></div>
                <div style={{ padding: '10px 0' }} onClick={() => this.setState({ visibleNotification: true })}><i><img src={notificationBelt} width="30px" /><span style={{ paddingLeft: '10px' }}>Thông báo</span></i></div>
                <div style={{ padding: '10px 0' }} onClick={() => this.setState({ visibleAssignment: true })}><i><img src={assignment} width="30px" /><span style={{ paddingLeft: '10px' }}>Bài tập</span></i></div>
                <div style={{ padding: '10px 0' }} onClick={() => this.setState({ visibleSurvey: true })}><i><img src={survey} width="30px" /><span style={{ paddingLeft: '10px' }}>Khảo sát</span></i></div>
            </div>
        );

        const {selectedRowKeys } = this.state;


        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
          };
        
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <>
                <Modal
                    title="ADD STUDENTS"
                    centered
                    visible={this.state.visibleAddStudent}
                    onOk={() => this.setState({ visibleAddStudent: false })}
                    onCancel={() => this.setState({ visibleAddStudent: false })}
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
                                <Row>Customize<Checkbox onChange={this.onChange} /></Row>
                                <Row>
                                    <div><span>Begin day</span>
                                        <DatePicker onChange={this.onChange} />
                                    </div>
                                    <div><span>End day</span>
                                        <DatePicker onChange={this.onChange} />
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
                    visible={this.state.visibleNotification}
                    onOk={() => this.setState({ visibleNotification: false })}
                    onCancel={() => this.setState({ visibleNotification: false })}
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
                                <Row>Customize<Checkbox onChange={this.onChange} /></Row>
                                <Row>
                                    <div><span>Begin day</span>
                                        <DatePicker onChange={this.onChange} />
                                    </div>
                                    <div><span>End day</span>
                                        <DatePicker onChange={this.onChange} />
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
                    visible={this.state.visibleAssignment}
                    onOk={() => this.setState({ visibleAssignment: false })}
                    onCancel={() => this.setState({ visibleAssignment: false })}
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
                    visible={this.state.visibleSurvey}
                    onOk={() => this.setState({ visibleSurvey: false })}
                    onCancel={() => this.setState({ visibleSurvey: false })}
                    width={1000}
                >
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="Surveys" key="1">
                            <div style={{ width: '90%' }}>
                                <Row style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                                    <Checkbox onChange={this.onChange} style={{ color: '#ff0000' }}>Bulk Delete</Checkbox>
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
                            <Popover placement="bottom" title="Tùy chọn" content={content} visible={this.state.isHover} onVisibleChange={this.handleHoverChange}>
                                <i>
                                    <img src={options} style={{ width: '50px' }} />
                                </i>
                            </Popover>
                        </Col>
                    </Row>
                    <div style={{ width: '90%' }}>
                        <Row style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                            <Checkbox onChange={this.onChange} style={{ color: '#ff0000' }}>Bulk Delete</Checkbox>
                        </Row>
                        <Row style={{ width: '100%' }}>
                            <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.lstStdnt} style={{ width: '100%' }} />
                        </Row>
                    </div>
                </Row>
            </>
        )
    }
}
export default withTranslation('translations')(Student)
