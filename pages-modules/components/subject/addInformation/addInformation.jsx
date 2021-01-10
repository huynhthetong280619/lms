import { get, head } from 'lodash';
import { withTranslation } from 'react-i18next';
import { Row, Col, Input, Select, Button, notification, Form } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

const AddInformation = ({ t, lstTimelines, isLoading, createInformation }) => {

    const [form] = Form.useForm();
    const onFinish = (values) => {
        let information = {
            name: values.information.name,
            content: values.information.content
        }
        console.log('information', information)
        createInformation({ idTimeline: values.idTimeline, information: information });
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
                    name={['information', 'name']}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tiêu đề thông báo"
                        }
                    ]}
                    hasFeedback>
                    <Input placeholder="Name of announcement..." />
                </Form.Item>

                <Form.Item
                    label={t('content')}
                    name={['information', 'content']}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập nội dung thông báo',
                        }
                    ]}
                    hasFeedback>
                    <TextArea
                        placeholder="Content of announcement..."
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


export default withTranslation('translations')(AddInformation)
