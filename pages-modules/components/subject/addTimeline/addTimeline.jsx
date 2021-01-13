import { get, head } from 'lodash';
import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Row, Col, Input, Select, Button, notification, Form } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

const AddTimeline = ({ t, createTimeline, isLoading }) => {

    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: {
            span: 8,

        },
        wrapperCol: {
            span: 16,
        },
    };

    const onFinish = (values) => {
        let timeline = {
            name: values.name,
            description: values.description
        }
        createTimeline(timeline);
    }

    return (
        <>
            <div style={{
                fontStyle: "italic",
                color: "#cacaca"
            }}>
                {t('setting_timeline')}
            </div>
            <Form
                {...formItemLayout}
                onFinish={onFinish}
                form={form}
            >
                <Form.Item
                    label={t('name')}
                    name={'name'}
                    rules={[
                        {
                            required: true,
                            message: t('require_title_week')
                        }
                    ]}
                    hasFeedback>
                    <Input placeholder={t('name_of_timeline')} />
                </Form.Item>

                <Form.Item
                    label={t('content')}
                    name={'description'}
                    rules={[
                        {
                            required: true,
                            message: t('require_desc_week'),
                        }
                    ]}
                    hasFeedback>
                    <TextArea
                        placeholder={t('desc_of_timeline')}
                        autoSize={{ minRows: 3, maxRows: 5 }}
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


export default withTranslation('translations')(AddTimeline)
