import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Input, Select, Button, Form, notification } from 'antd'
import restClient from '../../../../assets/common/core/restClient';
const { Option } = Select;

const AddFile = ({ t, isLoading, lstTimelines, onUploadFile, onCancelUploadFile, createFile }) => {

    const [form] = Form.useForm();
    const [fileAttach, setFileAttach] = useState(null);

    useEffect(() => {
        form.setFieldsValue({
            idTimeline: lstTimelines[0]._id,
        })
    }, []);

    const handleProcessFile = (e) => {
        setFileAttach(e.target.files[0])
    }


    const formItemLayout = {
        labelCol: {
            span: 8,

        },
        wrapperCol: {
            span: 16,
        },
    };

    const onFinish = async (values) => {
        console.log('fileAttach', fileAttach);
        if (fileAttach) {
            onUploadFile();
            const objectFile = await restClient.asyncUploadFile(fileAttach);
            if (objectFile) {
                createFile({ file: objectFile, idTimeline: values.idTimeline });
            } else {
                onCancelUploadFile();
                notification.error({ message: "Thất bại", description: 'Gặp lỗi khi tải file vui lòng thử lại' });
            }
        } else {
            notification.warning({ message: "Chú ý", description: 'Vui lòng chọn file trước khi upload' });
        }
    }

    return (
        <>
            <div style={{
                fontStyle: "italic",
                color: "#cacaca"
            }}>
                {t('setting_file')}
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


export default withTranslation('translations')(AddFile)
