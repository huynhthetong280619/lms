import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Input, Select, Button, InputNumber, DatePicker, Form } from 'antd'
const { Option } = Select;
const { TextArea } = Input;


const AddQuiz = ({ lstTimelines, lstQuizzes, t, isLoading, createQuiz }) => {

    const [form] = Form.useForm();

    const [quizBank, setQuizBank] = useState(lstQuizzes[0]);

    useEffect(() => {
            const object = {
                setting: {
                    code: quizBank._id,
                    questionCount: 1,
                    attemptCount: 3,
                    timeToDo: 15,
                }
            }
            form.setFieldsValue({
                idTimeline: lstTimelines[0]._id,
                exam: object
            })
    }, []);

    const onFinish = (fieldsValue) => {
        const data = {
            ...fieldsValue.exam,
            startTime: fieldsValue.exam.startTime.format('YYYY-MM-DDTHH:mm:ss'),
            expireTime: fieldsValue.exam.expireTime.format('YYYY-MM-DDTHH:mm:ss')
        };
        createQuiz({ quiz: data, idTimeline: fieldsValue.idTimeline });
    }

    const handleChangeQuizBank = value => {
        const data = lstQuizzes.find(quiz => quiz._id === value);
        setQuizBank(data);
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
                {t('setting_quiz')}
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
                    name={['exam', 'name']}
                    rules={[
                        {
                            required: true,
                            message: this.props.t('req_title_quiz')
                        }
                    ]}
                    hasFeedback>
                    <Input placeholder={t('name_of_quiz')} />
                </Form.Item>

                <Form.Item
                    label={t('content')}
                    name={['exam', 'content']}
                    rules={[
                        {
                            required: true,
                            message: this.props.t('req_quiz'),
                        }
                    ]}
                    hasFeedback>
                    <TextArea
                        placeholder="Content assignment"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>

                <Form.Item
                    label={t('startTime')}
                    name={['exam', 'startTime']}
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
                    dependencies={['exam', 'startTime']}
                    label={t('expireTime')}
                    name={['exam', 'expireTime']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: this.props.t('req_end_time'),
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || value.isAfter(getFieldValue(['exam', 'startTime']))) {
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
                    label={t('code')}
                    name={['exam', 'setting', 'code']}
                    rules={[
                        {
                            required: true,
                            message: this.props.t('req_code_quiz'),
                        }
                    ]}
                    hasFeedback
                >
                    <Select onChange={handleChangeQuizBank} >
                        {
                            lstQuizzes.map(q => (<Option value={q._id} key={q._id}>{q.name}</Option>))
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    label={t('questionCount')}
                    name={['exam', 'setting', 'questionCount']}
                    rules={[
                        {
                            required: true,
                            message: this.props.t('qty_question'),
                        }
                    ]}
                    hasFeedback>
                    <InputNumber min={1} max={quizBank.questions} />

                </Form.Item>
                <Form.Item
                    label={t('timeTodo')}
                    name={['exam', 'setting', 'timeToDo']}
                    rules={[
                        {
                            required: true,
                            message: this.props.t('time_take_quiz'),
                        }
                    ]}
                    hasFeedback>
                    <InputNumber min={1} max={180}
                        formatter={value => `${value} phút`}
                        parser={value => value.replace(' phút', '')} />

                </Form.Item>

                <Form.Item
                    label={t('attemptQuantity')}
                    name={['exam', 'setting', 'attemptCount']}
                    rules={[
                        {
                            required: true,
                            message: this.props.t('count_attempt'),
                        }
                    ]}
                    hasFeedback>
                    <InputNumber min={1} max={10}
                        formatter={value => `${value} lần`}
                        parser={value => value.replace(' lần', '')}
                    />

                </Form.Item>


                <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 6 }}>
                    <Button type="primary" loading={isLoading} htmlType="submit">
                    {t('submit')}</Button>
                </Form.Item>

            </Form>
        </>
    )
}


export default withTranslation('translations')(AddQuiz)
