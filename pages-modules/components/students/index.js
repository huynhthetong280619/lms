import React from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { Drawer, Checkbox, Row, Table, Tag, Space, Col, Form, Modal, Tabs, Input, DatePicker, Upload, message, Button, Select, InputNumber } from 'antd'

import options from '../../../assets/images/contents/option.png'
import add from '../../../assets/images/contents/add.png'
import notificationBelt from '../../../assets/images/contents/notificationsbelt.png'
import notificationEmpty from '../../../assets/images/contents/notifications.png'
import assignment from '../../../assets/images/contents/asignment.png'
import survey from '../../../assets/images/contents/survey.png'
import { withTranslation } from 'react-i18next'
import { get, head } from 'lodash'
import { CSVLink } from "react-csv";
import excel from '../../../assets/images/contents/excel.png'
const { TabPane } = Tabs;
const { TextArea } = Input;
import { ToastContainer, toast } from 'react-toastify';
import './overwrite.css'
import RestClient from '../../../assets/common/core/restClient'
import restClient from '../../../assets/common/core/restClient'
import 'react-toastify/dist/ReactToastify.css';

const { Dragger } = Upload;
const { Option } = Select;
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
        loading: false,
        lstSubmissionCore: [],
        testId: null,
        lstStudentCoreTest: [],
        lstStdnt: [],
        lstClassScore: null,
        visibleDrawer: false,
        codeStudent: ''

    }


    componentDidMount() {
        console.log('componentDidmount', this.state.lstSubmissionCore)
        this.setState({
            lstStdnt: this.props.listStudent,
            lstSubmissionCore: this.props.lstSubmissionCore,
            lstStudentCoreTest: get(head(this.props.lstSubmissionCore), 'submissions'),
            testId: get(head(this.props.lstSubmissionCore), '_id'),
            nameTestId: get(head(this.props.lstSubmissionCore), 'name'),
            lstClassScore: this.props.lstClassScore
        })
    }

    onChangeSelectCodeStudent = (value) => {
        console.log(`selected ${value}`);
    }

    onBlur = () => {
        console.log('blur');
    }

    onFocus = () => {
        console.log('focus');
    }

    onSearch = (val) => {
        console.log('search:', val);
    }

    handleSelectTest = (e) => {
        const result = this.state.lstSubmissionCore.filter(item => get(item, '_id') === e)

        this.setState({
            testId: e,
            nameTestId: get(head(result), 'submissions'),
            lstStudentCoreTest: get(head(result), 'submissions')
        })
    }


    handleDeleteStudent = async (record) => {
        await RestClient.asyncDelete(`/subject/${this.props.idSubject}/remove-student`, {
            idStudent: record.code
        }, token)
            .then(res => {
                console.log('delete', res)
                if (!res.hasError) {
                    const temp = this.state.lstStdnt.filter(item => item.code !== record.code);

                    this.setState({
                        lstStdnt: temp
                    })

                    return;
                }
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


    onAddStudent = () => {

    }

    ratio = {
    }
    setRatio = (obj, ratio) => {
        console.log(obj, ratio)
        // this.setState({
        //     ratio
        // })
        this.ratio[obj._id] = ratio / 100

        console.log(this.ratio)
    }

    putTotalScore = async () => {
        const data = Object.keys(this.ratio).map(e => {
            return {
                _id: e,
                ratio: this.ratio[e]
            }
        })

        console.log('data', data)
        await RestClient.asyncPut(`/subject/${this.props.idSubject}/ratio`, data, this.props.token)
            .then(res => {
                if (!res.hasError) {
                    this.setState({
                        lstClassScore: res.data
                    })
                }
            })
    }

    onClose = () => {
        this.setState({
            visibleDrawer: false
        })
    }

    showDrawer = () => {
        this.setState({
            visibleDrawer: true
        })
    }

    addStudentToClass = async (codeStudent) => {

        await restClient.asyncGet(`/subject/${this.props.idSubject}/add-student`, { idStudent: codeStudent })
            .then(res => {
                if (!res.hasError) {
                    toast.success(`Add student with code ${codeStudent} has added into class`);
                }
            })
    }


    onFinish = (value) => {
        this.addStudentToClass(valude)
    }
    render() {

        const { t } = this.props;

        console.log('render', this.props.listStudent)
        const content = (
            <div>
                <div style={{ padding: '10px 0' }} onClick={() => this.setState({ visibleAddStudent: true })}><i><img src={add} width="30px" /><span style={{ paddingLeft: '10px', cursor: 'pointer' }} onClick={() => this.showDrawer()}>Thêm sinh viên</span></i></div>
                <div style={{ padding: '10px 0' }} onClick={() => this.setState({ visibleNotification: true })}><i><img src={notificationBelt} width="30px" /><span style={{ paddingLeft: '10px' }}>Thông báo</span></i></div>
                <div style={{ padding: '10px 0' }} onClick={() => this.setState({ visibleAssignment: true })}><i><img src={assignment} width="30px" /><span style={{ paddingLeft: '10px' }}>Bài tập</span></i></div>
                <div style={{ padding: '10px 0' }} onClick={() => this.setState({ visibleSurvey: true })}><i><img src={survey} width="30px" /><span style={{ paddingLeft: '10px' }}>Khảo sát</span></i></div>
            </div>
        );

        const columns = [
            {
                title: 'Avatar',
                dataIndex: 'urlAvatar',
                key: 'urlAvatar',
                render: (data) => <img src={data} width="102px" />
            },
            {
                title: t('code_student'),
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: 'Email',
                dataIndex: 'emailAddress',
                key: 'emailAddress'
            },
            {
                title: t('surName'),
                dataIndex: 'surName',
                key: 'surName',
            },
            {
                title: t('firstName'),
                dataIndex: 'firstName',
                key: 'firstName',
            },


            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <Space size="middle">
                        <a onClick={() => this.handleDeleteStudent(record)}>Delete</a>
                    </Space>
                ),
            },
        ];


        const columnsChildGrade = [
            {
                title: "Mã số sinh viên",
                dataIndex: "student",
                key: "student",
                render: data => <span>{data.code}</span>
            },
            {
                title: "Điểm",
                dataIndex: "grade",
                key: "grade",
                render: data => data !== null ? data : <span style={{ color: '#ff4000', fontStyle: 'italic' }}>Chưa nộp bài</span>
            }
        ]



        let columnsClassScore = []
        if (this.state.lstClassScore) {

            columnsClassScore = Object.keys(this.state.lstClassScore.fields).map((c, i) => {
                console.log('c', this.state.lstClassScore)
                if (i > 2 && i < Object.keys(this.state.lstClassScore.fields).length - 1) {
                    this.ratio[this.state.lstClassScore.ratio[c]._id] = this.state.lstClassScore.ratio[c].ratio
                }
                return {
                    title: i > 2 && i < Object.keys(this.state.lstClassScore.fields).length - 1 ? (<div><span>Hệ số <InputNumber
                        defaultValue={100}
                        min={0}
                        max={100}
                        formatter={value => `${value}%`}
                        onChange={(e) => this.setRatio(this.state.lstClassScore.ratio[c], e)}
                        parser={value => value.replace('%', '')}
                    /></span> <div>{this.state.lstClassScore.fields[c]}</div></div>) : this.state.lstClassScore.fields[c],
                    dataIndex: c,
                    key: c,
                    width: 200,
                    render: data => data !== null ? data : <span style={{ fontStyle: 'italic', color: '#ff4000' }}>Chưa nộp bài</span>
                }
            })
        }


        const { selectedRowKeys } = this.state;


        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const hasSelected = selectedRowKeys.length > 0;

        console.log(this.state.lstSubmissionCore)

        const headersCSV = [
            { label: t('code_student'), key: 'student.code' },
            { label: t('grade'), key: 'grade' }
        ]

        const headersCSVClass = [
            { label: t('code_student'), key: '_id' },
            { label: t('Email'), key: 'emailAddress' },
            { label: t('surName'), key: 'surName' },
            { label: t('firstName'), key: 'firstName' },
        ]

        const headersClassScoreCSV = Object.keys(this.props.lstClassScore.fields).map((c, i) => {
            return {
                label: this.props.lstClassScore.fields[c],
                key: c
            }
        })

        
        return (
            <div class="lms-ws-student-page">
             
                <Row style={{
                    width: '85%',
                    textAlign: 'center',
                    background: '#fff',
                    minHeight: '20px',
                    justifyContent: 'center',
                    margin: '0 auto'
                }}>
                    <ToastContainer />
                    <Row style={{ width: '100%' }}>
                        <Col span={24} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject.toUpperCase()}</Col>
                    </Row>

                    <Row style={{ width: '90%', marginBottom: 30 }}>
                        <Tabs defaultActiveKey="1" centered style={{ width: "100%" }}>
                            <TabPane tab="Lớp học" key="1">
                                <div style={{ width: '90%' }}>
                                    <Row style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                                        <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={this.state.loading}>
                                            UnSelectAll
          </Button>
                                    </Row>
                                    <Row style={{ marginBottom: 10 }}>
                                        <div style={{ width: "100%", textAlign: 'left' }}>
                                            <div style={{
                                                display: 'inline',
                                                padding: '5px 10px',
                                                border: '1px solid #cacaca',
                                                borderRadius: '20px',
                                            }}>
                                                <span>{t('export_excel')}</span>
                                                <CSVLink
                                                    filename={"Danh Sách lớp.csv"}
                                                    data={this.state.lstStdnt}
                                                    headers={headersCSVClass}
                                                    target="_blank"
                                                    style={{ color: "inherit", marginLeft: 5 }}
                                                >
                                                    <span
                                                        id="Tooltip_history_csv"
                                                        className="left5"
                                                        placement="top"
                                                        style={{ padding: 0, marginTop: 3 }}
                                                    >
                                                        <img src={excel} width={20} />
                                                    </span>
                                                </CSVLink>
                                            </div>
                                            <Button type="primary" style={{ marginLeft: 10 }} onClick={() => this.showDrawer()}>{t('add_student')}</Button>
                                        </div>

                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.lstStdnt} style={{ width: '100%' }} pagination={false} />
                                    </Row>
                                </div>

                            </TabPane>
                            <TabPane tab="Bài kiểm tra" key="2">
                                <Row style={{ marginBottom: 20 }}>
                                    <Select defaultValue={this.state.testId} style={{ width: 200 }} onChange={e => this.handleSelectTest(e)}>
                                        {
                                            (this.state.lstSubmissionCore || []).map(q => (<Option value={q._id} key={q._id} style={{ width: '100%' }}>{q.name}</Option>))
                                        }
                                    </Select>
                                </Row>
                                <Row style={{ marginBottom: 10 }}>
                                    <div style={{ width: "100%", textAlign: 'left' }}>
                                        <div style={{
                                            display: 'inline',
                                            padding: '5px 10px',
                                            border: '1px solid #cacaca',
                                            borderRadius: '20px',
                                        }}>
                                            <span>{t('export_excel')}</span>
                                            <CSVLink
                                                filename={this.state.nameTestId + ".csv"}
                                                data={this.state.lstStudentCoreTest}
                                                headers={headersCSV}
                                                target="_blank"
                                                style={{ color: "inherit", marginLeft: 5 }}
                                            >
                                                <span
                                                    id="Tooltip_history_csv"
                                                    className="left5"
                                                    placement="top"
                                                    style={{ padding: 0, marginTop: 3 }}
                                                >
                                                    <img src={excel} width={20} />
                                                </span>
                                            </CSVLink>
                                        </div>
                                    </div>

                                </Row>
                                <Row style={{ border: '2px solid #cacaca' }}>
                                    <Table pagination={false} columns={columnsChildGrade} dataSource={this.state.lstStudentCoreTest} style={{ width: '100%' }} />
                                </Row>
                            </TabPane>
                            <TabPane tab="Bảng điểm" key="3">
                                <Row style={{ marginBottom: 10 }}>
                                    <div style={{ width: "100%", textAlign: 'left' }}>
                                        <div style={{
                                            display: 'inline',
                                            padding: '5px 10px',
                                            border: '1px solid #cacaca',
                                            borderRadius: '20px',
                                        }}>
                                            <span>{t('export_excel')}</span>
                                            <CSVLink
                                                filename={"Bảng điểm lớp học.csv"}
                                                data={this.props.lstClassScore.data}
                                                headers={headersClassScoreCSV}
                                                target="_blank"
                                                style={{ color: "inherit", marginLeft: 5 }}
                                            >
                                                <span
                                                    id="Tooltip_history_csv"
                                                    className="left5"
                                                    placement="top"
                                                    style={{ padding: 0, marginTop: 3 }}
                                                >
                                                    <img src={excel} width={20} />
                                                </span>
                                            </CSVLink>
                                        </div>
                                    </div>
                                </Row>
                                <Row style={{ border: '2px solid #cacaca' }}>
                                    <Button style={{
                                        margin: '5px',
                                        background: '#ff4000',
                                        border: 0,
                                        color: '#fff',
                                        borderRadius: '20px'
                                    }} onClick={() => this.putTotalScore()}>{t('cfrm_table_points')}</Button>
                                    <Table pagination={false} columns={columnsClassScore} dataSource={this.props.lstClassScore.data} style={{ width: '100%' }} scroll={{ y: 240, x: 700 }} />
                                </Row>
                            </TabPane>
                        </Tabs>
                    </Row>

                </Row>
                <Drawer
                    title={t('add_student')}
                    placement="right"
                    closable={false}
                    onClose={() => this.onClose()}
                    width={440}
                    visible={this.state.visibleDrawer}
                >
                    <Form onFinish={this.onFinish}>
                        <Form.Item label={t('code_student')} name="codeStudent" rules={[
                            {
                                required: true,
                                message: this.props.t('req_code_student'),
                            },
                        ]}>
                            <Input type="text" onChange={(e) => this.setState({ codeStudent: e.target.value.trim() })} placeholder="Student code..." style={{
                                marginBottom: 10
                            }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" /*onClick={() => this.addStudentToClass()}*/> {t('add_student')} </Button>
                        </Form.Item>
                    </Form>

                </Drawer>
            </div>
        )
    }
}
export default withTranslation('translations')(Student)
