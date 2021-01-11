import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Input, Select, Button, Form, DatePicker } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

const AddSurvey = ({ lstTimelines, lstSurveys, t, isLoading, createSurvey }) => {

    const [form] = Form.useForm();

    const [bank] = useState(lstSurveys[0]);

    useEffect(() => {
        const object = {
            code: bank._id,
        }
        form.setFieldsValue({
            idTimeline: lstTimelines[0]._id,
            survey: object
        })
    }, []);

    const onFinish = (fieldsValue) => {

        const data = {
            ...fieldsValue.survey,
            expireTime: fieldsValue.survey.expireTime.format('YYYY-MM-DDTHH:mm:ss')
        };
        createSurvey({ survey: data, idTimeline: fieldsValue.idTimeline });
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
                name={['survey', 'name']}
                rules={[
                    {
                        required: true,
                        message: this.props.t('req_title_survey')
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
                        message: this.props.t('req_end_time_survey'),
                    }
                ]}
            >
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>

            <Form.Item
                label={t('code')}
                name={['survey', 'code']}
                rules={[
                    {
                        required: true,
                        message: this.props.t('req_code_survey'),
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

            <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 6 }}>
                <Button type="primary" loading={isLoading} htmlType="submit">
                    {t('submit')}</Button>
            </Form.Item>

        </Form>
    </>
    )
}


export default withTranslation('translations')(AddSurvey)
