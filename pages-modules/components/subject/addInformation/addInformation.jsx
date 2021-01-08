import { get, head } from 'lodash';
import { withTranslation } from 'react-i18next';
import { Row, Col, Input, Select, Button, notification } from 'antd'
const { Option } = Select;
const { TextArea } = Input;

class AddInformation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lstTimelines: this.props.lstTimelines,
            idTimeline: get(head(this.props.lstTimelines), '_id'),
            name: '',
            content: '',
        }
    }

    handleSubmit = () => {
        let information = {
            name: this.state.name,
            content: this.state.content
        }
        console.log('information', information)
        this.props.createInformation({ idTimeline: this.state.idTimeline, information: information });
    }

    render() {
        const { t } = this.props;

        return <>
            <div style={{
                fontStyle: "italic",
                color: "#cacaca"
            }}>
                {t('setting_inform')}
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
                    {t('name')}
                </Col>
                <Col>
                    <Input placeholder="Name of announcement..." style={{ width: 200 }}
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
                        placeholder="Content of announcement..."
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
            <Row style={{ textAlign: 'center', paddingTop: "20px" }}>
                <div>
                    <Button type="primary" loading={this.props.isLoading} onClick={this.handleSubmit} style={{ borderRadius: 20 }}>{t('submit')}</Button>
                </div>
            </Row>
        </>
    }
}


export default withTranslation('translations')(AddInformation)
