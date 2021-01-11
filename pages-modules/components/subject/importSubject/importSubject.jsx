import { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Input, Select, Button, Form, notification } from 'antd'

const ImportSubject = ({ t, isLoading, handleImportSubject }) => {

    const [form] = Form.useForm();
    const [fileAttach, setFileAttach] = useState(null);


    const handleProcessFile = (e) => {
        setFileAttach(e.target.files[0])
    }

    const readFileAsDataURL = async (file) => {
        let result_base64 = await new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.readAsText(file);
        });
        return result_base64;
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
            let text = await readFileAsDataURL(fileAttach)
            let data = null;
            try {
                data = JSON.parse(text);
            }
            catch (error) {
                notification.error({
                    message: 'Chú ý',
                    description: 'Vui lòng chọn file có nội dung được quy định'
                });
                return;
            }

            values = {
                quizBank: data.quizBank || null,
                surveyBank: data.surveyBank || null,
                timelines: data.timelines || null,
                studentIds: data.studentIds || null,
            }
            console.log(data);
            if (!values.quizBank && !values.surveyBank && !values.timelines && !values.studentIds) {
                notification.error({
                    message: 'Chú ý',
                    description: 'Vui lòng chọn file có nội dung được quy định'
                })
            } else {
                handleImportSubject(values);
            }

        } else {
            notification.error({
                message: 'Chú ý',
                description: 'Vui lòng chọn file'
            })
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
                    label={t('fileAttach')}
                >
                    <Input type="file" accept='.json' style={{ overflow: 'hidden' }} onChange={e => handleProcessFile(e)} />
                </Form.Item>

                <Form.Item wrapperCol={{ ...formItemLayout.wrapperCol, offset: 6 }}>
                    <Button type="primary" loading={isLoading} htmlType="submit">
                        {t('import_subject')}</Button>
                </Form.Item>

            </Form>
        </>
    )
}


export default withTranslation('translations')(ImportSubject)
