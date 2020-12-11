import React, { Component } from 'react'
import { Button, Col, Row } from 'antd'

import styles from './styles.scss'
import VN_FLAG from '../../../assets/images/contents/VN_FLAG.png'
import ENG_FLAG from '../../../assets/images/contents/England_flag.png'

import { withTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import glb_sv from '../../../assets/global/global.service'

class Footers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            langFlag: VN_FLAG,
            lang: glb_sv.lang
        }
    }

    handleChangeLanguage = (lang) => {
        this.setState({
            lang
        });
        glb_sv.lang = lang
        lang == 'vi' ? this.setState({ langFlag: VN_FLAG }) : this.setState({ langFlag: ENG_FLAG });
        i18n.changeLanguage(lang)
    }

    render() {

        const { t } = this.props;

        return <>
            <Row style={{ color: '#fff', marginBottom: '15px' }}>
                <Col span={10}>
                    <div>{t('systm_onl')}</div>
                    <div>{t('univers_nm')}</div>
                </Col>
                <Col span={10}>
                    <div>{t('term_condt')}</div>
                    <div>{t('policy')}</div>
                </Col>
            </Row>
            <Row style={{ color: '#fff', marginBottom: '15px' }}>
                <Col span={10}>
                    <i></i>
                    <span>www.itonline.hcmute.edu.vn</span>
                </Col>
                <Col span={10}>
                    <div>{t('social_ntw')}</div>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <img src={this.state.langFlag} alt="" style={{ width: 22.5, height: 22.5, marginBottom: 4 }} />
                    <select style={{ marginLeft: 5 }} value={this.state.lang} onChange={e => this.handleChangeLanguage(e.target.value)} className="form-control cursor_ponter form-control-sm acntTopDiv disabled">
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                    </select>
                </Col>
                <Col span={10}></Col>
            </Row>
            <Row style={{ textAlign: 'center', color: '#fff', fontWeight: '700' }}>
                <div>Copyright HCMUTE © 2020</div>
            </Row>
        </>
    }
}

export default withTranslation('translations')(Footers)
