import { get, head } from 'lodash';
import { withTranslation } from 'react-i18next';
import { Row, Col, Input, Select, Button, InputNumber } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

class AddSurvey extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            idTimeline: get(head(this.props.lstTimelines), '_id'),
            name: '',
            description: '',       
            expireTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                    2,
                    0
                )}T${`${new Date().getHours()}`.padStart(
                    2,
                    0
                )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
            code: get(head(this.props.lstSurveys), '_id')
        }
    }

    handleSelectExpireTime(day) {
        console.log('handleSelectExpireTime', day)

        this.setState({ expireTime: day });
    }

    handleSubmit = () => {
        const data = {
            name: this.state.name,
            description: this.state.description,
            expireTime: this.state.expireTime,
            code: this.state.code
        }
        this.props.createSurvey({ survey: data, idTimeline: this.state.idTimeline });
    }

    render() {
        const { t } = this.props;

        return <>
            <div style={{
                fontStyle: "italic",
                color: "#cacaca"
            }}>
                {t('setting_quiz')}
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
                    <Input placeholder="Name of survey..." style={{ width: 200 }}
                        onChange={e => {
                            this.setState({ name: e.target.value })
                        }} />
                </Col>

            </Row>

            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    {t('content')}
                </Col>
                <Col>
                    <TextArea style={{ width: 200 }}

                        placeholder="Content of survey..."
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        showCount
                        onChange={e => {
                            this.setState({ content: e.target.value })
                        }}
                    />
                </Col>

            </Row>
            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    <span>{t('expireTime')}</span>
                </Col>
                <Col>
                    {/* <DayPickerInputCustomize value={get(this.props.quiz, 'expireTime')} onDayChange={e => this.handleSelectExpireTimeQuiz(e)} style={{ width: 200 }} /> */}
                    <input type="datetime-local" id="expire-time"
                        name="expire-time" value={this.state.expireTime}
                        min="2001-06-07T00:00" max="2050-06-14T00:00" onChange={e => this.handleSelectExpireTime(e.target.value)} />
                </Col>
            </Row>

            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    {t('code')}
                </Col>
                <Col>
                    <Select defaultValue={this.state.code} style={{ width: 200 }} onChange={e => this.setState({code:e})}>
                        {
                            this.props.lstSurveys.map(survey => (<Option value={survey._id} key={survey._id}>{survey.name}</Option>))
                        }
                    </Select>
                </Col>
            </Row>

            <Row style={{ textAlign: 'center', paddingTop: "20px" }}>
                <div>
                    <Button type="primary" loading={this.props.isLoading} onClick={this.handleSubmit} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                </div>
            </Row>
        </>
    }
}


export default withTranslation('translations')(AddSurvey)
