import { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Input, Select, Button, Form, notification } from 'antd'
const { Option } = Select;

const AddFile = ({ t, isLoading, lstTimelines, onUploadFile, createFile }) => {

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
    const handleUpload = async () => {
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
                console.log('Upload attachment', err);
                return null;
            });
    }



    const onFinish = async (values) => {
        console.log('fileAttach', fileAttach);

        if (fileAttach) {
            const objectFile = await handleUpload();
            if (objectFile) {
                createFile({ file: objectFile, idTimeline: values.idTimeline });
            } else {
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
