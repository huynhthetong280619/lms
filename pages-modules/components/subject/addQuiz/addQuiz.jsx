import { get, head } from 'lodash';
import { withTranslation } from 'react-i18next';
import { Row, Col, Input, Select, Button, InputNumber } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

class AddQuiz extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            idTimeline: get(head(this.props.lstTimelines), '_id'),
            name: '',
            content: '',
            startTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                    2,
                    0
                )}T${`${new Date().getHours()}`.padStart(
                    2,
                    0
                )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
            expireTime: `${new Date().getFullYear()}-${`${new Date().getMonth() +
                1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
                    2,
                    0
                )}T${`${new Date().getHours()}`.padStart(
                    2,
                    0
                )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
            setting: {
                questionCount: get(head(this.props.lstQuizzes), 'questions'),
                timeToDo: 15,
                code: get(head(this.props.lstQuizzes), '_id'),
                attemptCount: 1
            },
            quizBank: head(this.props.lstQuizzes)
        }
    }

    handleSelectStartTime(day) {
        console.log('handleSelectStartTime', day)
        this.setState({ startTime: day });
    }

    handleSelectExpireTime(day) {
        console.log('handleSelectExpireTime', day)

        this.setState({ expireTime: day });
    }

    handleChangeCodeQuiz(e) {
        console.log(e.target);
        this.setState({ setting: { ...this.state.setting, code: e.target.value } });
        let quiz = this.props.lstQuizzes.find(value => value._id === e.target.value);
        this.setState({ quizBank: quiz });
    }

    handleSubmit = () => {
        const data = {
            name: this.state.name,
            content: this.state.content,
            startTime: this.state.startTime,
            expireTime: this.state.expireTime,
            setting: this.state.setting
        }
        this.props.createQuiz({ quiz: data, idTimeline: this.state.idTimeline });
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
                    <Input placeholder="Name of exam..." style={{ width: 200 }}
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

                        placeholder="Content assignment"
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
                    <span>{t('startTime')}</span>
                </Col>
                <Col>
                    {/* <DayPickerInput value={get(this.props.quiz, 'startTime')} onDayChange={e => this.handleSelectStartTimeQuiz(e)} style={{ width: 200 }} /> */}
                    {/* <DayPickerInputCustomize value={get(this.props.quiz, 'startTime')} onDayChange={e => this.handleSelectStartTimeQuiz(e)} style={{ width: 200 }} /> */}
                    <input type="datetime-local" id="start-time"
                        name="start-time" value={this.state.startTime}
                        min={new Date()} max="2050-06-14T00:00" onChange={e => this.handleSelectStartTime(e.target.value)} />
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
                <Col style={{ fontWeight: 700 }}>
                    {t('settings')}
                </Col>
            </Row>


            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    {t('code')}
                </Col>
                <Col>
                    <Select defaultValue={this.state.setting.code} style={{ width: 200 }} onChange={e => this.handleChangeCodeQuiz(e)}>
                        {
                            this.props.lstQuizzes.map(q => (<Option value={q._id} key={q._id}>{q.name}</Option>))
                        }
                    </Select>
                </Col>
            </Row>

            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    <span>{t('questionCount')}</span>
                </Col>
                <Col>
                    <InputNumber size="small" min={1} max={this.state.quizBank.questions} defaultValue={1} onChange={e => this.setState({ setting: { ...this.state.setting, questionCount: e } })} style={{ width: 200 }} />
                </Col>
            </Row>

            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    <span>{t('timeTodo')}</span>
                </Col>
                <Col>
                    <InputNumber size="small" min={1} max={180} defaultValue={15} onChange={e => this.setState({ setting: { ...this.state.setting, timeToDo: e } })} style={{ width: 200 }} />
                </Col>
            </Row>

            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    <span>{t('attemptQuantity')}</span>
                </Col>
                <Col>
                    <InputNumber size="small" min={1} max={10} defaultValue={1} onChange={e => this.setState({ setting: { ...this.state.setting, attemptCount: e } })} style={{ width: 200 }} />
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


export default withTranslation('translations')(AddQuiz)
