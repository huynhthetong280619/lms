import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Input, Select, Button, Form, DatePicker, Checkbox } from 'antd'
import restClient from '../../../../assets/common/core/restClient';
import formatTime from '../../../../assets/common/core/formatTime';
import { notifyError } from '../../../../assets/common/core/notify.js';
import Loading from '../../loading/loading.jsx';
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;

const AddSurvey = ({ lstTimelines, lstSurveys, t, createSurvey, updateSurvey, idSubject, idTimeline, idSurvey, token }) => {

    const [form] = Form.useForm();

    const [bank] = useState(lstSurveys[0]);

    const [survey, setSurvey] = useState(null);

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (survey) {
            //console.log(survey);
            form.setFieldsValue({
                idTimeline: idTimeline,
                survey: { ...survey, isDeleted: !survey.isDeleted }
            })
        }
    }, [survey])

    useEffect(() => {
        if (idSurvey) {
            restClient.asyncGet(`/survey/${idSurvey}/update/?idSubject=${idSubject}&idTimeline=${idTimeline}`, token)
                .then(res => {
                    if (!res.hasError) {
                        setSurvey({
                            ...res.data.survey,
                            expireTime: moment(res.data.survey.expireTime),
                        });
                    } else {
                        notifyError(t('failure'), res.data.message);
                    }
                })

        } else {
            const object = {
                code: bank._id,
                isDeleted: !false,
            }
            form.setFieldsValue({
                idTimeline: lstTimelines[0]._id,
                survey: object
            })
        }
    }, []);

    const onFinish = (fieldsValue) => {

        const data = {
            ...fieldsValue.survey,
            expireTime: formatTime(fieldsValue.survey.expireTime),
            isDeleted: !fieldsValue.survey.isDeleted
        };

        if (!idSurvey) {
            handleCreateSurvey(data, fieldsValue.idTimeline);
        } else {
            handleUpdateSurvey(data, idTimeline);
            //console.log('data', data);
        }
    }

    const handleCreateSurvey = async (survey, idTimelineAdd) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineAdd,
            data: survey
        }
        setLoading(true);
        await restClient.asyncPost('/survey', data, token)
            .then(res => {
                //console.log('createSurvey', res)
                setLoading(false);
                if (!res.hasError) {
                    createSurvey({ survey: res.data.survey, idTimeline: idTimelineAdd })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }

    const handleUpdateSurvey = async (survey, idTimelineUpdate) => {
        const data = {
            idSubject: idSubject,
            idTimeline: idTimelineUpdate,
            data: survey
        }
        setLoading(true);
        await restClient.asyncPut(`/survey/${idSurvey}`, data, token)
            .then(res => {
                //console.log('UpdateSurvey', res)
                setLoading(false);
                if (!res.hasError) {
                    updateSurvey({ survey: res.data.survey, idTimeline: idTimelineUpdate })
                } else {
                    notifyError(t('failure'), res.data.message);
                }
            })
    }


    const formItemLayout = {
        labelCol: {
            span: 8,

        },
        wrapperCol: {
            span: 16,
        },
    };



    return (<>
        <div style={{
            fontStyle: "italic",
            color: "#cacaca"
        }}>
            {t('setting_survey')}
        </div>
        {
            (idSurvey && !survey) ?
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
                                message: t('req_select_week')
                            }
                        ]}
                        hasFeedback>
                        <Select disabled={idSurvey || false}>
                            {
                                lstTimelines.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={t('name')}
                        name={['survey', 'name']}
                        rules={[
                            {
                                required: true,
                                message: t('req_title_survey')
                            }
                        ]}
                        hasFeedback>
                        <Input placeholder={t('name_of_survey')} />
                    </Form.Item>

                    <Form.Item
                        label={t('content')}
                        name={['survey', 'description']}>
                        <TextArea
                            placeholder={t('desc_of_survey')}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    </Form.Item>

                    <Form.Item
                        dependencies={['exam', 'startTime']}
                        label={t('expireTime')}
                        name={['survey', 'expireTime']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: t('req_begin_time'),
                            }
                        ]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>

                    <Form.Item
                        label={t('code_survey')}
                        name={['survey', 'code']}
                        rules={[
                            {
                                required: true,
                                message: t('req_code_survey'),
                            }
                        ]}
                        hasFeedback
                    >
                        <Select>
                            {
                                lstSurveys.map(q => (<Option value={q._id} key={q._id}>{q.name}</Option>))
                            }
                        </Select>
                    </Form.Item>


                    <Form.Item
                        label={t('display')}
                        name={['survey', 'isDeleted']}
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


export default withTranslation('translations')(AddSurvey)
