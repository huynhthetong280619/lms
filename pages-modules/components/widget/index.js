import React from 'react'
import './overwrite.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../fontAwesomeIcon'
import { Modal, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

import { withTranslation } from 'react-i18next';

class Widget extends React.Component {


    showConfirm = () => {
        const { setIsOnMovement, updateTimelinesIndex } = this.props;
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: this.props.t('msg_confrm_update_index'),
            onOk() {
                let status = updateTimelinesIndex()

                if (status) {
                    setIsOnMovement();
                    return;
                }
            },
            onCancel() {
                this.props.setIsOnMovement()
            },
        })
    }

    render() {

        const { openDrawerContent, isOnMovement, setIsOnMovement, turnOnOffEditMode, t } = this.props

        return (
            <div class="container">
                <a onClick={() => openDrawerContent()} disabled={isOnMovement}>
                    <i><FontAwesomeIcon icon="wrench" /></i>
                    <span>{t('setting')}</span>
                </a>
                {
                    !isOnMovement

                        ? <a>
                            <i><FontAwesomeIcon icon="sort-amount-up" onClick={() => setIsOnMovement()} /> </i>
                            <span>{t('arrange')}</span>
                        </a> :
                        <a>
                            <i><FontAwesomeIcon icon="save" onClick={() => this.showConfirm()} /></i>
                            <span>{t('arrange')}</span>
                        </a>
                }

                <a onClick={() => turnOnOffEditMode()} disabled={isOnMovement}>
                    <i><FontAwesomeIcon icon="edit" /></i>
                    <span>{t('update')}</span>
                </a>
            </div>
        )
    }

}

export default withTranslation('translations')(Widget)