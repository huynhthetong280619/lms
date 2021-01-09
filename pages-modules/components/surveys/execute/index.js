import React from 'react'
import { Row, Col, Badge, Radio, Button, Checkbox, notification } from 'antd'
import { get } from 'lodash'
import '../overwrite.css'
import survey from '../../../../assets/images/contents/surveylogo.png'
import restClient from '../../../../assets/common/core/restClient'
import Router from 'next/router'
class SurveyExecute extends React.Component {

    state = {
        questions: [],
        answer: {},
        loading: false
    }

    componentDidMount() {
        console.log('this.props.surveyQ.questionnaire', this.props.surveyQ.questionnaire)

        // if (!this.props.questionnaire.questions) {
        //     Router.push({ pathname: "/courses" })
        // }
        console.log('componentDidMount', this.props.questionnaire.questions)
        this.setState({
            questions: this.props.questionnaire.questions || []
        })



        const obj = {};

        if (this.props.questionnaire.questions != null) {
            this.props.questionnaire.questions.map(q => {
                obj[q._id] = null
            })
        }


        this.setState({
            answer: obj,
            callBackResponse: false
        })
    }

    onChoice = (questionAns, questionsId) => {
        console.log('onChange', { ...this.state.answer, [questionsId]: questionAns.target.value })
        this.setState({
            answer: { ...this.state.answer, [questionsId]: questionAns.target.value }
        });
    };

    onChangeMultipleChoice = (questionAns, questionsId) => {
        console.log('checked = ', questionAns, questionsId);
        this.setState({
            answer: { ...this.state.answer, [questionsId]: questionAns }
        });
    }

    onFill = (questionAns, questionsId) => {
        this.setState({
            answer: { ...this.state.answer, [questionsId]: questionAns.target.value }
        });
    }

    submitSurvey = async () => {
        this.setState({ loading: true });
        const questionId = Object.keys(this.state.answer)

        let convert = []
        questionId.map(key => {
            convert.push({
                ['idQuestion']: key,
                ['answer']: this.state.answer[key]
            })
        })



        // Push up to server
        console.log(convert)
        const data = {
            data: convert
        }
        await restClient.asyncPost(`/survey/${this.props.idSurvey}/submit?idSubject=${this.props.idSubject}&idTimeline=${this.props.idTimeline}`, data, this.props.token)
            .then(res => {
                if (!res.hasError) {
                    Router.push(`/surveys/${this.props.idSurvey}?idSubject=${this.props.idSubject}&idTimeline=${this.props.idTimeline}`)
                    notification.success({
                        message: res.data.message,
                        placement: 'topRight'
                    });
                } else {
                    this.setState({ loading: false });
                    notification.error({
                        message: res.data.message,
                        placement: 'topRight'
                    });
                }
            })
    }

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        };
        console.log('answer', this.state.answer)
        return <>
            <Row style={{
                width: '80%',
                textAlign: 'center',
                background: '#fff',
                minHeight: '20px'
            }}>
                <Row style={{ width: '100%' }}>
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject}</Col>
                </Row>
                <div style={{ width: '90%' }}>
                    <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                        <span>
                            <img src={survey} width="80px" />
                        </span>
                        <span style={{ fontWeight: '700' }}>[ SURVEY ] {this.props.survey.name}</span>
                    </div>
                    <div style={{ width: '100%', minHeight: '150px' }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px"

                        }}>

                            {
                                (this.state.questions).map((q, index) => (
                                    q.typeQuestion == 'choice' ?
                                        (<div style={{ marginBottom: '20px', textAlign: 'left' }} key={q._id}>
                                            <div style={{ fontWeight: 600 }}><span>Question {index}: </span>{q.question}</div>
                                            <div>
                                                <Radio.Group onChange={e => this.onChoice(e, q._id)} value={get(this.state.answer, q._id)}>
                                                    {
                                                        q.answer.map(a => (
                                                            <Radio style={radioStyle} value={a._id} key={a._id}>
                                                                {a.content}
                                                            </Radio>
                                                        ))
                                                    }
                                                </Radio.Group>
                                            </div>
                                        </div>) :
                                        (
                                            q.typeQuestion == 'multiple' ? (<div style={{ textAlign: 'left' }} key={q._id}>
                                                <div style={{ fontWeight: 600 }}>
                                                    <span>Question {index}: </span>{q.question}
                                                </div>
                                                <div>
                                                    <Checkbox.Group style={{ width: '100%' }} onChange={e => this.onChangeMultipleChoice(e, q._id)}>
                                                        <Row>
                                                            <Col span={12} style={{ textAlign: 'left' }}>
                                                                <div>
                                                                    {
                                                                        q.answer.map(a => (
                                                                            <div key={a._id}>
                                                                                <Checkbox value={a._id}>{a.content}</Checkbox>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </Col>
                                                            <Col span={12}>
                                                            </Col>
                                                        </Row>
                                                    </Checkbox.Group>
                                                </div>
                                            </div>
                                            )

                                                : <div style={{ textAlign: 'left' }} key={q._id}>
                                                    <div style={{ fontWeight: 600 }}>
                                                        <span>Question {index}: </span>{q.question}
                                                    </div>
                                                    <div>
                                                        <input type="text" onChange={(e) => this.onFill(e, q._id)} />
                                                    </div>
                                                </div>
                                        )
                                )
                                )
                            }

                            {/* 
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <Badge count={2} className="site-badge-count-4" />
                                    <div style={{
                                        display: "inline-block",
                                        marginLeft: "5px"
                                    }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                </div>
                                <div className="ant-row">
                                    <Radio.Group name="radiogroup" defaultValue={1} style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-around"
                                    }}>
                                        <Radio value={1}>Đầy đủ và rất tốt</Radio>
                                        <Radio value={2}>Đầy đủ và tốt</Radio>
                                        <Radio value={3}>Bình thường</Radio>
                                        <Radio value={4}>Không đầy đủ </Radio>
                                    </Radio.Group>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <Badge count={3} className="site-badge-count-4" />
                                    <div style={{
                                        display: "inline-block",
                                        marginLeft: "5px"
                                    }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                </div>
                                <div className="ant-row">
                                    <Radio.Group name="radiogroup" defaultValue={1} style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-around"
                                    }}>
                                        <Radio value={1}>Đầy đủ và rất tốt</Radio>
                                        <Radio value={2}>Đầy đủ và tốt</Radio>
                                        <Radio value={3}>Bình thường</Radio>
                                        <Radio value={4}>Không đầy đủ </Radio>
                                    </Radio.Group>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <Badge count={4} className="site-badge-count-4" />
                                    <div style={{
                                        display: "inline-block",
                                        marginLeft: "5px"
                                    }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                </div>
                                <div className="ant-row">
                                    <Radio.Group name="radiogroup" defaultValue={1} style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-around"
                                    }}>
                                        <Radio value={1}>Đầy đủ và rất tốt</Radio>
                                        <Radio value={2}>Đầy đủ và tốt</Radio>
                                        <Radio value={3}>Bình thường</Radio>
                                        <Radio value={4}>Không đầy đủ </Radio>
                                    </Radio.Group>
                                </div>
                            </div> */}

                        </div>
                        <Row style={{ padding: "25px" }}>
                            <div>
                                <Button type="primary" loading={this.state.loading} style={{ borderRadius: 20 }} onClick={() => this.submitSurvey()}>Submit survey</Button>
                            </div>
                        </Row>
                    </div>
                </div>
            </Row>

        </>
    }
}

export default SurveyExecute
