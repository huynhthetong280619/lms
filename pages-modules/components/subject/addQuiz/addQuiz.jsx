import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import restClient from '../../../../assets/common/core/restClient';
import formatTime from '../../../../assets/common/core/formatTime';
import Loading from '../../loading/loading.jsx';
import moment from 'moment'
import { notifyError } from '../../../../assets/common/core/notify.js';
import { Input, Select, Button, InputNumber, DatePicker, Checkbox, Form } from 'antd'
const { Option } = Select;
const { TextArea } = Input;


const AddQuiz = ({ lstTimelines, lstQuizzes, t, createQuiz, updateQuiz, idSubject, idTimeline, idExam, token }) => {

    const [form] = Form.useForm();

    const [quizBank, setQuizBank] = useState(lstQuizzes[0]);

    const [exam, setExam] = useState(null);

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (exam) {
            console.log(exam);
            form.setFieldsValue({
                idTimeline: idTimeline,
                exam: { ...exam, isDeleted: !exam.isDeleted }
            })
        }
    }, [exam])

    useEffect(() => {
        if (idExam) {
            restClient.asyncGet(`/exam/${idExam}/update/?idSubject=${idSubject}&idTimeline=${idTimeline}`, token)
                .then(res => {
                    if (!res.hasError) {
                        const ex = res.data.exam;
                        console.log('Exam', ex);
                        setExam({
                            ...ex,
                            startTime: moment(ex.startTime),
                            expireTime: moment(ex.expireTime),
                        });
                    } else {
                        notifyError('Error', res.data.message);
                    }
                })

        } else {

            const object = {
                setting: {
                    code: quizBank._id,
                    questionCount: 1,
                    attemptCount: 3,
                    timeToDo: 15,
                },
                isDeleted: !false,
            }
            form.setFieldsValue({
                idTimeline: lstTimelines[0]._id,
                exam: object
            })
        }
    }, []);

    const handleCreateExam = async (ex, idTimelineAdd) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineAdd,
            data: ex
        }
        setLoading(true);
        await restClient.asyncPost('/exam', data, token)
            .then(res => {
                console.log('handleCreateExam', res)
                setLoading(false);
                if (!res.hasError) {
                    createQuiz({ exam: res.data.exam, idTimeline: idTimelineAdd })
                } else {
                    notifyError("Thất bại", res.data.message);
                }
            })
    }

    const handleUpdateExam = async (ex, idTimelineUpdate) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineUpdate,
            data: ex
        }
        setLoading(true);
        await restClient.asyncPut(`/exam/${idExam}`, data, token)
            .then(res => {
                console.log('handleUpdateExam', res)
                setLoading(false);
                if (!res.hasError) {
                    updateQuiz({ exam: res.data.exam, idTimeline: idTimelineUpdate })
                } else {
                    notifyError("Thất bại", res.data.message);
                }
            })
    }

    const onFinish = (fieldsValue) => {
        const data = {
            ...fieldsValue.exam,
            isDeleted: !fieldsValue.exam.isDeleted,
            startTime: formatTime(fieldsValue.exam.startTime),
            expireTime: formatTime(fieldsValue.exam.expireTime)
        };
        console.log(data);
        //createQuiz({ quiz: data, idTimeline: fieldsValue.idTimeline });
        if (!idExam) {
            handleCreateExam(data, fieldsValue.idTimeline);
        } else {
            handleUpdateExam(data, idTimeline);
        }
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
            {
                (idExam && !exam) ?
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
                            <Select disabled={idExam || false}>
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
                                    message: "Vui lòng nhập tiêu đề bài kiểm tra"
                                }
                            ]}
                            hasFeedback>
                            <Input placeholder="Name of exam..." />
                        </Form.Item>

                        <Form.Item
                            label={t('content')}
                            name={['exam', 'content']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập yêu cầu bài kiểm tra',
                                }
                            ]}
                            hasFeedback>
                            <TextArea
                                placeholder="Content of exam..."
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={t('startTime')}
                            name={['exam', 'startTime']}
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
                            dependencies={['exam', 'startTime']}
                            label={t('expireTime')}
                            name={['exam', 'expireTime']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thời gian kết thúc',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || value.isAfter(getFieldValue(['exam', 'startTime']))) {
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
                            label={t('code')}
                            name={['exam', 'setting', 'code']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn đề',
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
                                    message: 'Vui lòng chọn số lượng câu hỏi',
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
                                    message: 'Vui lòng chọn thời gian làm bài',
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
                                    message: 'Vui lòng chọn số lần tham gia',
                                }
                            ]}
                            hasFeedback>
                            <InputNumber min={1} max={10}
                                formatter={value => `${value} lần`}
                                parser={value => value.replace(' lần', '')}
                            />

                        </Form.Item>


                        <Form.Item
                            label={t('display')}
                            name={['exam', 'isDeleted']}
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


export default withTranslation('translations')(AddQuiz)
