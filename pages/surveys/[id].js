import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import { Row, Col, Button, Tabs, Radio, Input, Progress, Badge } from 'antd'

const { TabPane } = Tabs;

import './overwrite.css'

import survey from '../../assets/images/contents/surveylogo.png'

class SurveyPage extends React.Component {

    state = {
        value: 1,
    };

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const { value } = this.state;
        return <IndexLayout>
            <Row style={{
                width: '80%',
                textAlign: 'center',
                background: '#fff',
                borderRadius: '15px',
                minHeight: '20px'
            }}>
                <Row style={{ width: '100%' }}>
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</Col>
                </Row>
                <div style={{ width: '90%' }}>
                    <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                        <span>
                            <img src={survey} width="80px" />
                        </span>
                        <span style={{ fontWeight: '700' }}>[ SURVEY ] PART 1: CONSOLATE KNOWLEDGE</span>
                    </div>

                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="YOUR RESPONSE" key="1">
                            <div style={{ width: '100%', minHeight: '150px' }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '45px',
                                    marginBottom: "25px",
                                    border: "2px solid #c4c4c4",
                                    borderRadius: "20px"

                                }}>
                                    <div style={{marginBottom: '20px'}}>
                                        <div style={{ textAlign: 'left' }}>
                                            <Badge count={1} className="site-badge-count-4" />
                                            <div style={{
                                                display: "inline-block",
                                                marginLeft: "5px"
                                            }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                        </div>
                                        <div className="ant-row">
                                            <Col span={4} style={{ textAlign: 'left' }}>
                                                <div>Response</div>
                                                <div>
                                                    <Radio.Group onChange={this.onChange} value={value}>
                                                        <Radio style={radioStyle} value={1}>
                                                            Option A
                                            </Radio>
                                                        <Radio style={radioStyle} value={2}>
                                                            Option B
                                            </Radio>
                                                        <Radio style={radioStyle} value={3}>
                                                            Option C
                                            </Radio>
                                                        <Radio style={radioStyle} value={4}>
                                                            More...
                                            {value === 4 ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}
                                                        </Radio>
                                                    </Radio.Group>
                                                </div>
                                            </Col>
                                            <Col span={12} >
                                                <div>Rate</div>
                                                <>
                                                    <Progress percent={30} style={{ height: '30px' }} />
                                                    <Progress percent={50} style={{ height: '30px' }} />
                                                    <Progress percent={70} style={{ height: '30px' }} />
                                                    <Progress percent={100} style={{ height: '30px' }} />
                                                </>
                                            </Col>
                                        </div>
                                    </div>

                                    <div style={{marginBottom: '20px'}}>
                                        <div style={{ textAlign: 'left' }}>
                                            <Badge count={2} className="site-badge-count-4" />
                                            <div style={{
                                                display: "inline-block",
                                                marginLeft: "5px"
                                            }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                        </div>
                                        <div className="ant-row">
                                            <Col span={4} style={{ textAlign: 'left' }}>
                                                <div>Response</div>
                                                <div>
                                                    <Radio.Group onChange={this.onChange} value={value}>
                                                        <Radio style={radioStyle} value={1}>
                                                            Option A
                                            </Radio>
                                                        <Radio style={radioStyle} value={2}>
                                                            Option B
                                            </Radio>
                                                        <Radio style={radioStyle} value={3}>
                                                            Option C
                                            </Radio>
                                                        <Radio style={radioStyle} value={4}>
                                                            More...
                                            {value === 4 ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}
                                                        </Radio>
                                                    </Radio.Group>
                                                </div>
                                            </Col>
                                            <Col span={12} >
                                                <div>Rate</div>
                                                <>
                                                    <Progress percent={30} style={{ height: '30px' }} />
                                                    <Progress percent={50} style={{ height: '30px' }} />
                                                    <Progress percent={70} style={{ height: '30px' }} />
                                                    <Progress percent={100} style={{ height: '30px' }} />
                                                </>
                                            </Col>
                                        </div>
                                    </div>

                                    <div style={{marginBottom: '20px'}}>
                                        <div style={{ textAlign: 'left' }}>
                                            <Badge count={3} className="site-badge-count-4" />
                                            <div style={{
                                                display: "inline-block",
                                                marginLeft: "5px"
                                            }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                        </div>
                                        <div className="ant-row">
                                            <Col span={4} style={{ textAlign: 'left' }}>
                                                <div>Response</div>
                                                <div>
                                                    <Radio.Group onChange={this.onChange} value={value}>
                                                        <Radio style={radioStyle} value={1}>
                                                            Option A
                                            </Radio>
                                                        <Radio style={radioStyle} value={2}>
                                                            Option B
                                            </Radio>
                                                        <Radio style={radioStyle} value={3}>
                                                            Option C
                                            </Radio>
                                                        <Radio style={radioStyle} value={4}>
                                                            More...
                                            {value === 4 ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}
                                                        </Radio>
                                                    </Radio.Group>
                                                </div>
                                            </Col>
                                            <Col span={12} >
                                                <div>Rate</div>
                                                <>
                                                    <Progress percent={30} style={{ height: '30px' }} />
                                                    <Progress percent={50} style={{ height: '30px' }} />
                                                    <Progress percent={70} style={{ height: '30px' }} />
                                                    <Progress percent={100} style={{ height: '30px' }} />
                                                </>
                                            </Col>
                                        </div>
                                    </div>

                                    <div style={{marginBottom: '20px'}}>
                                        <div style={{ textAlign: 'left' }}>
                                            <Badge count={4} className="site-badge-count-4" />
                                            <div style={{
                                                display: "inline-block",
                                                marginLeft: "5px"
                                            }}>Mức độ của nội dung video, slide, tài liệu tham khảo của giáo viên cung cấp?</div>
                                        </div>
                                        <div className="ant-row">
                                            <Col span={4} style={{ textAlign: 'left' }}>
                                                <div>Response</div>
                                                <div>
                                                    <Radio.Group onChange={this.onChange} value={value}>
                                                        <Radio style={radioStyle} value={1}>
                                                            Option A
                                            </Radio>
                                                        <Radio style={radioStyle} value={2}>
                                                            Option B
                                            </Radio>
                                                        <Radio style={radioStyle} value={3}>
                                                            Option C
                                            </Radio>
                                                        <Radio style={radioStyle} value={4}>
                                                            More...
                                            {value === 4 ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}
                                                        </Radio>
                                                    </Radio.Group>
                                                </div>
                                            </Col>
                                            <Col span={12} >
                                                <div>Rate</div>
                                                <>
                                                    <Progress percent={30} style={{ height: '30px' }} />
                                                    <Progress percent={50} style={{ height: '30px' }} />
                                                    <Progress percent={70} style={{ height: '30px' }} />
                                                    <Progress percent={100} style={{ height: '30px' }} />
                                                </>
                                            </Col>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </TabPane>
                        <TabPane tab="VIEW ALL RESPONSE" key="2">
                            Content of Tab Pane 2
                    </TabPane>

                    </Tabs>

                </div>
            </Row>
        </IndexLayout>
    }

}

export default SurveyPage
