import { get, head } from 'lodash';
import { withTranslation } from 'react-i18next';
import { Row, Col, Input, Select, Button, notification } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

class AddFile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lstTimelines: this.props.lstTimelines,
            idTimeline: get(head(this.props.lstTimelines), '_id'),
            fileData: null
        }
    }

    handleProcessFile = (e) => {
        this.setState({
            fileData: e.target.files[0]
        })
    }

    handleUpload = async () => {
        this.props.onUploadFile();
        const formData = new FormData();
        formData.append('file', this.state.fileData)
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

    handleSubmit = async () => {
        if (this.state.fileData) {
            const objectFile = await this.handleUpload();
            if (objectFile) {
                this.props.createFile({ file: objectFile, idTimeline: this.state.idTimeline });
            } else {
                notification.error({ message: "Thất bại", description: 'Gặp lỗi khi tải file vui lòng thử lại' });
            }
        } else {
            notification.warning({ message: "Chú ý", description: 'Vui lòng chọn file trước khi upload' });
        }

    }

    render() {
        const { t } = this.props;

        return <>
            <div style={{
                fontStyle: "italic",
                color: "#cacaca"
            }}>
                {t('setting_file')}
            </div>
            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    {t('timeline')}
                </Col>
                <Col>
                    <Select defaultValue={this.state.idTimeline} style={{ width: 200 }} onChange={e => this.setState({ idTimeline: e })}>
                        {
                            this.state.lstTimelines.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                        }
                    </Select>
                </Col>
            </Row>
            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    {t('fileAttach')}
                </Col>
                <Col>
                    <Input type="file" onChange={e => this.handleProcessFile(e)} style={{ width: 200, borderRadius: 20, overflow: 'hidden' }} />
                </Col>
            </Row>
            <Row style={{ textAlign: "center" }}>
                <div>
                    <Button type="primary" loading={this.props.isLoading} onClick={this.handleSubmit} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                </div>
            </Row>
        </>
    }
}


export default withTranslation('translations')(AddFile)
