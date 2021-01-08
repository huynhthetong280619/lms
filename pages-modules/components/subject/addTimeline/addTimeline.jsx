import { get, head } from 'lodash';
import { withTranslation } from 'react-i18next';
import { Row, Col, Input, Select, Button, notification } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

class AddTimeline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
        }
    }

    handleSubmit = () => {
        let timeline = {
            name: this.state.name,
            description: this.state.description
        }
        console.log('timeline', timeline)
        this.props.createTimeline(timeline);
    }

    render() {
        const { t } = this.props;

        return <>
            <div style={{
                fontStyle: "italic",
                color: "#cacaca"
            }}>
                {t('setting_timeline')}
            </div>
            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    {t('name')}
                </Col>
                <Col>
                    <Input placeholder="Name timeline" style={{ width: 200 }}
                        value={get(this.state.timeLine, 'name')}
                        onChange={e => {
                            this.setState({
                                name: e.target.value
                            })
                        }} />
                </Col>
            </Row>
            <Row style={{ margin: '10px 0' }}>
                <Col span={6} style={{ fontWeight: 700 }}>
                    {t('description')}
                </Col>
                <Col>
                    <TextArea style={{ width: 200 }}

                        placeholder="Description timeline"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        showCount
                        onChange={e => {
                            this.setState({
                                description: e.target.value
                            })
                        }}
                    />
                </Col>
            </Row>
            <Row style={{ textAlign: 'center', paddingTop: "20px" }}>
                <div>
                    <Button loading={this.props.isLoading} type="primary" onClick={this.handleSubmit} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                </div>
            </Row>
        </>
    }
}


export default withTranslation('translations')(AddTimeline)
