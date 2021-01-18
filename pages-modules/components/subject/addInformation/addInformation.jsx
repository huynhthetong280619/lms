import { withTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Input, Select, Button, Form, notification } from 'antd'
import restClient from '../../../../assets/common/core/restClient';
import { notifyError } from '../../../../assets/common/core/notify';
import Loading from '../../loading/loading.jsx';
const { Option } = Select;
const { TextArea } = Input;

const AddInformation = ({ t, lstTimelines, isLoading, createInformation, idSubject, idTimeline, idInformation, token }) => {

    const [form] = Form.useForm();
    const [information, setInformation] = useState(null);

    useEffect(() => {
        if (idInformation) {
            restClient.asyncGet(`/information/${idInformation}?idSubject=${idSubject}&idTimeline=${idTimeline}`, token)
                .then(res => {
                    if (!res.hasError) {
                        setInformation(res.data.information);
                        form.setFieldsValue({
                            idTimeline: idTimeline,
                            information: res.data.information
                        })
                    } else {
                        notifyError(t('failure'), res.data.message );
                    }
                })

        } else {
            form.setFieldsValue({
                idTimeline: lstTimelines[0] ? lstTimelines[0]._id : null
            })
        }
    }, []);

    const onFinish = (values) => {
        let information = {
            name: values.information.name,
            content: values.information.content
        }
        //console.log('information', information)
        if (!idInformation) {
            createInformation({ idTimeline: values.idTimeline, information: information });
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
                {t('setting_inform')}
            </div>
            {
                (idInformation && !information) ?
                    <Loading />
                    : (
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
                                        message: t('req_select_week')
                                    }
                                ]}
                                hasFeedback
                            >
                                <Select disabled={idInformation || false}>
                                    {
                                        lstTimelines.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={t('name')}
                                name={['information', 'name']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_title_announce')
                                    }
                                ]}
                                hasFeedback>
                                <Input placeholder={t('name_of_announce')} />
                            </Form.Item>

                            <Form.Item
                                label={t('content')}
                                name={['information', 'content']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('req_content_announce'),
                                    }
                                ]}
                                hasFeedback>
                                <TextArea
                                    placeholder={t('content_announce')}
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                />
                            </Form.Item>

                            <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 6 }}>
                                <Button type="primary" loading={isLoading} htmlType="submit">
                                    {t('submit')}</Button>
                            </Form.Item>
                        </Form>
                    )}
        </>
    )
}


export default withTranslation('translations')(AddInformation)
