import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import { Row, Col, Button, Table } from 'antd'

const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];


const QuizPage = () => {
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
                <div style={{ width: '100%', minHeight: '150px' }}>
                    <div style={{
                        textAlign: 'center',
                        padding: '45px',
                        marginBottom: "25px",
                        border: "2px solid #c4c4c4",
                        borderRadius: "20px"

                    }}>
                        <div>TEST PART 1</div>
                        <div>
                            <div>Attemp allowed: 2</div>
                            <div>Open: 16 Oct 2020, 12:38 AM</div>
                            <div>Closed: 16 oct 2020, 12:38 AM</div>
                            <div>Status: Opening</div>
                            <div>Grading method: Highest grade</div>
                        </div>
                        <div>
                            <Button>Take quiz</Button>
                        </div>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        padding: '45px',
                        marginBottom: "25px",
                        border: "2px solid #c4c4c4",
                        borderRadius: "20px"

                    }}>
                        <Table dataSource={dataSource} columns={columns} />
                    </div>
                </div>
            </div>
        </Row>
    </IndexLayout>
}

export default QuizPage
