import { withTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Input, Select, Button, Form } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

const AddForum = ({ t, lstTimelines, isLoading, createForum }) => {

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            idTimeline: lstTimelines[0]._id
        })
    }, []);

    const onFinish = (values) => {
        let forum = {
            name: values.forum.name,
            description: values.forum.description
        }
        console.log('forum', forum)
        createForum({ idTimeline: values.idTimeline, forum: forum });
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
                    name={['forum', 'name']}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tiêu đề diễn đàn"
                        }
                    ]}
                    hasFeedback>
                    <Input placeholder="Name of forum..." />
                </Form.Item>

                <Form.Item
                    label={t('content')}
                    name={['forum', 'description']}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mô tả về diễn đàn',
                        }
                    ]}
                    hasFeedback>
                    <TextArea
                        placeholder="Description of forum..."
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


export default withTranslation('translations')(AddForum)
