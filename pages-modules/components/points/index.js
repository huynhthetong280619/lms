import { withTranslation } from 'react-i18next'
import { get, head } from 'lodash'
import { CSVLink } from "react-csv";
import excel from '../../../assets/images/contents/excel.png'
import {  Row,Col, Table, Select , Tag, Space  } from 'antd'
import glb_sv from '../../../assets/global/global.service'
import statisticsPoint from '../../../assets/images/contents/statistics-point.png'

const columnsGrade = [
    {
        title: "Tên bài kiểm tra",
        dataIndex: "name",
        key: "name"
    },
    {
        title: "Điểm",
        dataIndex: "grade",
        key: "grade",
        render: data => (data == null ? (<span style={{color: '#ff4000', fontStyle: 'italic'}}>Chưa nộp bài</span>) : data)
    }
]

class Points extends React.Component {

    constructor(props){
        super(props)
        this.state ={
            lstSubmissionCore: [],
        }
    }

    componentDidMount(){
        console.log('componentDidMount', this.props.lstSubmissionCore)
        this.setState({
            lstSubmissionCore: this.props.lstSubmissionCore,
        })
    }

    render() {

        return <>
            <Row style={{
                width: '80%',
                textAlign: 'center',
                background: '#fff',
                borderRadius: '15px',
                minHeight: '20px'
            }}>
                <Row style={{ width: '100%' }}>
                    <Col span={20} style={{ padding: '25px', fontSize: '2em' }}>{this.props.nameSubject}</Col>
                </Row>
                <div style={{ width: '90%' }}>
                    <div style={{ textAlign: 'left', width: '100%', padding: '10px 0' }}>
                        <span>
                            <img src={statisticsPoint} width="80px" />
                        </span>
                        <span style={{ fontWeight: '700' }}>[Statistics-Point] Thống kế điểm kiểm tra</span> 
                    </div>
                    <div style={{ width: '100%', minHeight: '150px' }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '45px',
                            marginBottom: "25px",
                            border: "2px solid #c4c4c4",
                            borderRadius: "20px"

                        }}>
                               
                            <Row style={{ border: '2px solid #cacaca' }}>
                                <Table rowKey="name" pagination={false} columns={columnsGrade} dataSource={this.state.lstSubmissionCore} scroll={{ y: 240 }} style={{ width: '100%' }} />
                            </Row>

                        </div>
                    </div>
                </div>
            </Row>

        </>
    }
}


export default withTranslation('translations')(Points)
