import { get, head } from 'lodash';
import { withTranslation } from 'react-i18next';
import { Row, Col, Input, Select, Button, Checkbox } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

const date = `${new Date().getFullYear()}-${`${new Date().getMonth() +
    1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
        2,
        0
    )}T${`${new Date().getHours()}`.padStart(
        2,
        0
    )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`;

class AddAssignment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            idTimeline: get(head(this.props.lstTimelines), '_id'),
            name: '',
            content: '',
            setting: {
                startTime: date,
                expireTime: date,
                isOverDue: false,
                overDueDate: null,
                fileSize: '5'
            },
            fileData: null
        }
    }

    handleSelectStartTime(day) {
        console.log('handleSelectStartTime', day)
        this.setState({ setting: { ...this.state.setting, startTime: day } });
    }

    handleSelectExpireTime(day) {
        console.log('handleSelectExpireTime', day)

        this.setState({ setting: { ...this.state.setting, expireTime: day } });
    }

    handleIsOverDue = (status) => {
        console.log('handleIsOverDue', status.target.checked)
        this.setState({
            setting: {
                ...this.state.setting, isOverDue: status.target.checked,
                overDueDate: status.target.checked ? date : null
            }
        });
    }

    handleSelectOverDueDate(day) {
        this.setState({ setting: { ...this.state.setting, overDueDate: day } });
    }

    handleFileSize(size) {
        this.setState({ setting: { ...this.state.setting, fileSize: size } });
    }

    handleProcessFile = (e) => {
        this.setState({
            fileData: e.target.files[0]
        })

    }

    handleAttachmentUpload = async () => {
        this.props.onUploadFileAssignment();
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
        let file = []
        let data = null;
        if (this.state.fileData) {
            const objectFile = await this.handleAttachmentUpload();
            if (objectFile) {
                file.push(objectFile);
                data = {
                    name: this.state.name,
                    content: this.state.content,
                    setting: this.state.setting,
                    file: file
                }
                this.props.createAssignment({ assignment: data, idTimeline: this.state.idTimeline });
            } else {
                this.props.notifyError("Thất bại", 'Gặp lỗi khi tải file vui lòng thử lại');
            }

        } else {
            data = {
                name: this.state.name,
                content: this.state.content,
                setting: this.state.setting
            }
            this.props.createAssignment({ assignment: data, idTimeline: this.state.idTimeline });
        }

    }

    render() {
        const { t } = this.props;

        return <>
            <div style={{
                fontStyle: "italic",
                color: "#cacaca"
            }}>
                {t('setting_assignment')}
            </div>
            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    {t('timeline')}
                </Col>
                <Col>
                    <Select defaultValue={this.state.idTimeline} style={{ width: 200 }} onChange={e => this.setState({ idTimeline: e })}>
                        {
                            this.props.lstTimelines.map(tl => (<Option value={tl._id} key={tl._id}>{tl.name}</Option>))
                        }
                    </Select>
                </Col>
            </Row>

            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    {t('name')}
                </Col>
                <Col>
                    <Input placeholder="Name of assignment..." style={{ width: 200 }}
                        onChange={e => {
                            this.setState({
                                name: e.target.value
                            })
                        }} />
                </Col>

            </Row>

            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    {t('content')}
                </Col>
                <Col>
                    <TextArea style={{ width: 200 }}
                        placeholder="Content of assignment..."
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        showCount
                        onChange={e => {
                            this.setState({
                                content: e.target.value
                            })
                        }}
                    />
                </Col>
            </Row>
            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    <span>{t('startTime')}</span>
                </Col>
                <Col>
                    <input type="datetime-local" id="start-time"
                        name="start-time" value={get(this.state.setting, 'startTime')}
                        min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectStartTime(e.target.value)} />
                    {/* <DayPickerInputCustomize  onDayChange={e => this.handleSelectStartTime(e)} style={{ width: 200 }} /> */}
                </Col>
            </Row>
            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    <span>{t('expireTime')}</span>
                </Col>
                <Col>
                    <input type="datetime-local" id="start-time"
                        name="start-time" value={get(this.state.setting, 'expireTime')}
                        min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectExpireTime(e.target.value)} />
                    {/* <DayPickerInputCustomize value={get(this.state.assignment.setting, 'expireTime')} onDayChange={e => this.handleSelectExpireTime(e)} style={{ width: 200 }} /> */}
                </Col>
            </Row>
            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    <span>{t('isOverDue')}</span>
                </Col>
                <Col>
                    <Checkbox onChange={e => this.handleIsOverDue(e)} style={{ width: 200 }} />
                </Col>
            </Row>

            {
                this.state.setting.isOverDue && (
                    <Row style={{ margin: '10px 0' }}>
                        <Col span={6} style={{ fontWeight: 700 }}>
                            <span>{t('overDueDate')}</span>
                        </Col>
                        <Col>
                            <input type="datetime-local" id="start-time"
                                name="start-time" value={get(this.state.setting, 'overDueDate')}
                                min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectOverDueDate(e.target.value)} />
                            {/* <DayPickerInputCustomize value={get(this.state.assignment.setting, 'overDueDate')} onDayChange={e => this.handleSelectoverDueDate(e)} style={{ width: 200 }} /> */}
                        </Col>
                    </Row>
                )
            }

            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    <span>{t('fileSize')}</span>
                </Col>
                <Col>
                    <Select defaultValue="5" style={{ width: 200 }} onChange={e => this.handleFileSize(e)} >
                        <Option value="5">5</Option>
                        <Option value="10">10</Option>
                        <Option value="15">
                            15
                    </Option>
                        <Option value="20">20</Option>
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
            <Row style={{ textAlign: 'center', paddingTop: "20px" }}>
                <div>
                    <Button type="primary" onClick={this.handleSubmit} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                </div>
            </Row>
        </>
    }
}


export default withTranslation('translations')(AddAssignment)
