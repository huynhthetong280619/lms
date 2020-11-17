import React from 'react'
import { useRouter } from 'next/router'
import IndexLayout from '../../pages-modules/layouts/layout'
import { Row, Col, Popover, Button } from 'antd'

import styles from './styles.scss'
import './overwrite.css'

import add from '../../assets/images/contents/add.png'
import forum from '../../assets/images/contents/forum.png'
import excel from '../../assets/images/contents/excel.png'
import file from '../../assets/images/contents/file.png'
import pdf from '../../assets/images/contents/pdf.png'
import text from '../../assets/images/contents/text-editor.png'
import timeline from '../../assets/images/contents/timeline.png'
import word from '../../assets/images/contents/word.png'

const content = (
    <div>
      <span style={{margin: '0 10px'}}>
          <i>
              <img src={pdf} style={{width: '50px' }}/>
          </i>
      </span>
      <span style={{margin: '0 10px'}}>
          <i>
              <img src={word} style={{width: '50px' }}/>
          </i>
      </span>
      <span style={{margin: '0 10px'}}>
          <i>
              <img src={excel} style={{width: '50px' }}/>
          </i>
      </span>
      <span style={{margin: '0 10px'}}>
          <i>
              <img src={text} style={{width: '50px' }}/>
          </i>
      </span>
      <span style={{margin: '0 10px'}}>
          <i>
              <img src={timeline} style={{width: '50px' }}/>
          </i>
      </span>
      <span style={{margin: '0 10px'}}>
          <i>
              <img src={file} style={{width: '50px' }}/>
          </i>
      </span>
    </div>
  );

const CourseDetail = () => {
    const router = useRouter()

    return <IndexLayout>
        <Row className={styles.background} style={{ justifyContent: 'center' }}>
            <Col span={12}
                style={{
                    margin: '10px',
                    background: '#fff',
                    borderRadius: '10px',
                    minHeight: '200px'
                }}>
                <div>
                    <div style={{
                        textAlign: 'center',
                        padding: '10px 0'
                    }}>
                        <i>
                        </i>
                        <span style={{ padding: '25px', fontSize: '2em' }}>NGÔN NGỮ LẬP TRÌNH TIÊN TIẾN</span>
                    </div>
                </div>
                <div>
                    <Row>
                        <Col span={4}>
                            <i>
                                <img src={forum} />
                            </i>
                        </Col>
                        <Col span={8} style={{
                            fontSize: '20px',
                            lineHeight: '3.5'
                        }}>
                            <div>Diễn đàn tin tức</div>
                        </Col>
                    </Row>
                    <Row style={{
                        background: '#cacaca',
                        borderRadius: '30px',
                        padding: '10px 0',
                        width: '15%'
                    }}>
                        <Popover content={content} title="Thêm nội dung">
                        <div>
                            <i>
                            <img src={add} style={{width: '25px'}}/>
                            </i>
                        </div>
                        </Popover>
                    </Row>
                </div>
            </Col>
            <Col span={8}
                style={{
                    margin: '10px',
                    background: '#fff',
                    borderRadius: '10px',
                    minHeight: '200px'
                }}>
            </Col>
        </Row>
    </IndexLayout>
}

export default CourseDetail
