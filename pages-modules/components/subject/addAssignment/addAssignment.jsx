import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import restClient from '../../../../assets/common/core/restClient';
import { Row, Col, Input, Select, Button, Checkbox, Form, DatePicker } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

const AddAssignment = ({ lstTimelines, onUploadFile, onCancelUploadFile, t, isLoading, createAssignment, notifyError }) => {

    const [form] = Form.useForm();
    const [isOverDue, setIsOverDue] = useState(false);
    const [fileAttach, setFileAttach] = useState(null);

    const handleOnchangeOverDue = (e) => {
        setIsOverDue(e.target.checked);
    }

    useEffect(() => {
        const object = {
            setting: {
                isOverDue: false,
                fileSize: 5,
            }
        }
        form.setFieldsValue({
            idTimeline: lstTimelines[0]._id,
            assignment: object
        })
    }, []);

    const handleProcessFile = (e) => {
        setFileAttach(e.target.files[0]);

    }

    const onFinish = async (fieldsValue) => {
        console.log('fileAttach', fileAttach);
        const idTimeline = fieldsValue.idTimeline;
        const assignment = fieldsValue.assignment;
        const setting = {
            ...assignment.setting,
            startTime: assignment.setting.startTime.format('YYYY-MM-DDTHH:mm:ss'),
            expireTime: assignment.setting.expireTime.format('YYYY-MM-DDTHH:mm:ss'),
            overDueDate: assignment.setting.isOverDue ? assignment.setting.overDueDate.format('YYYY-MM-DDTHH:mm:ss') : null
        };
        console.log('setting', setting);
        let file = []
        let data = null;
        if (fileAttach) {
            onUploadFile();
            const objectFile = await restClient.asyncUploadFile(fileAttach);
            if (objectFile) {
                file.push(objectFile);
                data = {
                    name: assignment.name,
                    content: assignment.content,
                    setting: setting,
                    file: file
                }
                createAssignment({ assignment: data, idTimeline: idTimeline });
            } else {
                onCancelUploadFile();
                notifyError("Thất bại", 'Gặp lỗi khi tải file vui lòng thử lại');
            }

        } else {
            data = {
                name: assignment.name,
                content: assignment.content,
                setting: setting
            }
            createAssignment({ assignment: data, idTimeline: idTimeline });
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

            <Form
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
                    <Select >
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
                            validator(rule, value) {
                                if (!value || value.isAfter(getFieldValue(['assignment', 'setting', 'startTime']))) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!');
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
                                validator(rule, value) {
                                    if (!value || value.isAfter(getFieldValue(['assignment', 'setting', 'expireTime']))) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject('Thời gian quá hạn phải lớn hơn thời gian kết thúc!');
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

                <Form.Item
                    label={t('fileAttach')}
                >
                    <Input type="file" style={{ overflow: 'hidden' }} onChange={e => handleProcessFile(e)} />
                </Form.Item>

                <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 6 }}>
                    <Button type="primary" loading={isLoading} htmlType="submit">
                        {t('submit')}</Button>
                </Form.Item>

            </Form>
        </>
    )
}


export default withTranslation('translations')(AddAssignment)
