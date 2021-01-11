import { get, head } from 'lodash';
import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Row, Col, Input, Select, Button, Checkbox, Form, DatePicker } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

const AddAssignment = ({ lstTimelines, onUploadFile, t, isLoading, createAssignment, notifyError }) => {

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

    const handleAttachmentUpload = async () => {
        onUploadFile();
        const formData = new FormData();
        formData.append('file', fileAttach)
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
            .catch(err => {
                return null;
            });
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
            const objectFile = await handleAttachmentUpload();
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
                notifyError(this.props.t('failure'), this.props.t('err_download_file'));
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
                            message: this.props.t('req_select_week')
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
                            message: this.props.t('req_title_assignment')
                        }
                    ]}
                    hasFeedback>
                    <Input placeholder={this.props.t('name_of_assign')}/>
                </Form.Item>

                <Form.Item
                    label={t('content')}
                    name={['assignment', 'content']}
                    rules={[
                        {
                            required: true,
                            message: this.props.t('req_assign')
                        }
                    ]}
                    hasFeedback
                >
                    <TextArea
                        placeholder={this.props.t('content_req_assign')}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>

                <Form.Item
                    label={t('startTime')}
                    name={['assignment', 'setting', 'startTime']}
                    rules={[
                        {
                            required: true,
                            message: this.props.t('req_begin_time'),
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
                            message: this.props.t('req_end_time'),
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || value.isAfter(getFieldValue(['assignment', 'setting', 'startTime']))) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(this.props.t('condition_start_end'));
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
                                message: this.props.t('req_due_to'),
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || value.isAfter(getFieldValue(['assignment', 'setting', 'expireTime']))) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(this.props.t('condition_start_end'));
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
                            message: this.props.t('size_file')
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
