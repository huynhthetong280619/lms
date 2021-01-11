import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import restClient from '../../../../assets/common/core/restClient';
import formatTime from '../../../../assets/common/core/formatTime';
import { Input, Select, Button, Checkbox, Form, DatePicker, notification } from 'antd'
import downloadFile from '../../../../assets/common/core/downloadFile.js';
import Loading from '../../loading/loading.jsx';
import moment from 'moment'
import file from '../../../../assets/images/contents/file.png'
import word from '../../../../assets/images/contents/word.png'
import rar from '../../../../assets/images/contents/rar.png'
import pdf from '../../../../assets/images/contents/pdf.png'
const { Option } = Select;
const { TextArea } = Input;

const AddAssignment = ({ lstTimelines, t, createAssignment, updateAssignment, idSubject, idTimeline, idAssignment, token }) => {

    const [form] = Form.useForm();
    const [isOverDue, setIsOverDue] = useState(false);
    const [fileAttach, setFileAttach] = useState(null);

    const [assignment, setAssignment] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const handleOnchangeOverDue = (e) => {
        setIsOverDue(e.target.checked);
    }


    useEffect(() => {
        if (assignment) {
            console.log(assignment);
            form.setFieldsValue({
                idTimeline: idTimeline,
                assignment: { ...assignment, isDeleted: !assignment.isDeleted }
            })
        }
    }, [assignment])

    useEffect(() => {
        if (idAssignment) {
            restClient.asyncGet(`/assignment/${idAssignment}/update/?idSubject=${idSubject}&idTimeline=${idTimeline}`, token)
                .then(res => {
                    if (!res.hasError) {
                        const assign = res.data.assignment;
                        setAssignment({
                            ...assign,
                            setting: {
                                ...assign.setting,
                                startTime: moment(assign.setting.startTime),
                                expireTime: moment(assign.setting.expireTime),
                                overDueDate: assign.setting.isOverDue ? moment(assign.setting.overDueDate) : null,
                            },
                        });
                    } else {
                        notification.error({ message: 'Error', description: res.data.message });
                    }
                })

        } else {
            const object = {
                setting: {
                    isOverDue: false,
                    fileSize: 5,
                },
                isDeleted: !false,
            }
            form.setFieldsValue({
                idTimeline: lstTimelines[0]._id,
                assignment: object
            })
        }
    }, []);

    const handleProcessFile = (e) => {
        setFileAttach(e.target.files[0]);

    }

    const handleCreateAssignment = async (assignment, idTimelineAdd) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineAdd,
            data: assignment
        }
        setLoading(true);
        await restClient.asyncPost('/assignment', data, token)
            .then(res => {
                console.log('handleCreateAssignment', res)
                setLoading(false);
                if (!res.hasError) {
                    createAssignment({ assignment: res.data.assignment, idTimeline: idTimelineAdd })
                } else {
                    notification.error({ message: "Thất bại", description: res.data.message });
                }
            })
    }

    const handleUpdateAssignment = async (assignment, idTimelineUpdate) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineUpdate,
            data: assignment
        }
        setLoading(true);
        await restClient.asyncPut(`/assignment/${idAssignment}`, data, token)
            .then(res => {
                console.log('handleUpdateAssignment', res)
                setLoading(false);
                if (!res.hasError) {
                    updateAssignment({ assignment: res.data.assignment, idTimeline: idTimelineUpdate })
                } else {
                    notification.error({ message: "Thất bại", description: res.data.message });
                }
            })
    }

    const onFinish = async (fieldsValue) => {
        setLoading(true);
        console.log('fileAttach', fileAttach);
        const assign = fieldsValue.assignment;
        const setting = {
            ...assign.setting,
            startTime: formatTime(assign.setting.startTime),
            expireTime: formatTime(assign.setting.expireTime),
            overDueDate: assign.setting.isOverDue ? formatTime(assign.setting.overDueDate) : null
        };
        console.log('setting', setting);
        let file = []
        let data = null;
        if (fileAttach) {
            const objectFile = await restClient.asyncUploadFile(fileAttach);
            if (objectFile) {
                file.push(objectFile);
                data = {
                    name: assign.name,
                    content: assign.content,
                    setting: setting,
                    file: file
                }
                if (!idAssignment) {
                    handleCreateAssignment(data, fieldsValue.idTimeline);
                } else {
                    data = { ...data, file: assignment.attachments.concat(file) }
                    handleUpdateAssignment(data, idTimeline)
                }
            } else {
                setLoading(false);
                notification.error({
                    message: 'Thất bại',
                    description: 'Gặp lỗi khi tải file vui lòng thử lại'
                });
            }

        } else {
            data = {
                name: assign.name,
                content: assign.content,
                setting: setting
            }
            if (!idAssignment) {
                handleCreateAssignment(data, fieldsValue.idTimeline);
            } else {
                handleUpdateAssignment(data, idTimeline)
            }
        }
    }


    const formItemLayout = {
        labelCol: {
            span: 8,

        },
        wrapperCol: {
            span: 16,
        },
    };

    return (
        <>
            <div style={{
                fontStyle: "italic",
                color: "#cacaca"
            }}>
                {t('setting_assignment')}
            </div>

            {
                (idAssignment && !assignment) ?
                    <Loading />
                    : (<Form
                        {...formItemLayout}
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            label={t('timeline')}
                            name="idTimeline"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn tuần"
                                }
                            ]}
                            hasFeedback>
                            <Select disabled={idAssignment || null}>
                                {
                                    lstTimelines.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('name')}
                            name={['assignment', 'name']}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tiêu đề bài tập"
                                }
                            ]}
                            hasFeedback>
                            <Input placeholder="Name of assignment..." />
                        </Form.Item>

                        <Form.Item
                            label={t('content')}
                            name={['assignment', 'content']}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập yêu cầu bài tập"
                                }
                            ]}
                            hasFeedback
                        >
                            <TextArea
                                placeholder="Requirement of assignment..."
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('startTime')}
                            name={['assignment', 'setting', 'startTime']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thời gian bắt đầu',
                                }
                            ]}
                            hasFeedback>
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>

                        <Form.Item
                            dependencies={['assignment', 'setting', 'startTime']}
                            label={t('expireTime')}
                            name={['assignment', 'setting', 'expireTime']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thời gian kết thúc',
                                },
                                ({ getFieldValue }) => ({
                                    validator(value) {
                                        const expireTime = getFieldValue(['assignment', 'setting', 'expireTime']);
                                        if (!expireTime || expireTime.isAfter(getFieldValue(['assignment', 'setting', 'startTime']))) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!');
                                        }
                                    },
                                }),
                            ]}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>

                        <Form.Item
                            label={t('isOverDue')}
                            name={['assignment', 'setting', 'isOverDue']}
                            valuePropName="checked"
                        >
                            <Checkbox onChange={e => handleOnchangeOverDue(e)} />
                        </Form.Item>

                        {isOverDue && (
                            <Form.Item
                                label={t('overDueDate')}
                                name={['assignment', 'setting', 'overDueDate']}
                                hasFeedback
                                dependencies={['assignment', 'setting', 'expireTime']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn thời gian quá hạn',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(value) {
                                            const overDueDate = getFieldValue(['assignment', 'setting', 'overDueDate']);
                                            if (!overDueDate || overDueDate.isAfter(getFieldValue(['assignment', 'setting', 'expireTime']))) {
                                                return Promise.resolve();
                                            } else {
                                                return Promise.reject('Thời gian quá hạn phải lớn hơn thời gian kết thúc!');
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                        )}

                        <Form.Item
                            label={t('fileSize')}
                            name={['assignment', 'setting', 'fileSize']}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn kích thước file"
                                }
                            ]}
                            hasFeedback>
                            <Select  >
                                <Option value="5">5</Option>
                                <Option value="10">10</Option>
                                <Option value="15">15</Option>
                                <Option value="20">20</Option>
                            </Select>
                        </Form.Item>

                        {assignment &&
                            (assignment.attachments.map(f => {
                                return <Form.Item
                                    label={t('fileAttach')}>
                                    <span style={{
                                        verticalAlign: '-webkit-baseline-middle',
                                        border: '1px dashed #cacaca',
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                    }}>
                                        {f.type.includes('doc')
                                            ? <img src={word} width={20} /> : <img src={pdf} width={20} />}
                                        <a style={{ marginLeft: 10 }}>
                                            <span onClick={() => downloadFile(f)}>{f.name}.{f.type}</span>
                                        </a>
                                    </span>
                                </Form.Item>
                            })
                            )}

                        <Form.Item
                            label={t('addFileAttach')}
                        >
                            <Input type="file" style={{ overflow: 'hidden' }} onChange={e => handleProcessFile(e)} />
                        </Form.Item>

                        <Form.Item
                            label={t('display')}
                            name={['assignment', 'isDeleted']}
                            valuePropName="checked"
                        >
                            <Checkbox />
                        </Form.Item>

                        <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 6 }}>
                            <Button type="primary" loading={isLoading} htmlType="submit">
                                {t('submit')}</Button>
                        </Form.Item>

                    </Form>)}
        </>
    )
}


export default withTranslation('translations')(AddAssignment)
