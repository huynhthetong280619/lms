import React from 'react'
import './overwrite.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../fontAwesomeIcon'
import { Modal, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

class Widget extends React.Component {


    showConfirm = () => {
        const { setIsOnMovement, updateTimelinesIndex } = this.props;
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: "Vị trí timeline sẽ được cập nhật sau khi thay đổi.Bạn có chắc chắn không ?",
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

        const { openDrawerContent, isOnMovement, setIsOnMovement, turnOnOffEditMode } = this.props

        console.log('isOnMovement', isOnMovement)
        return (
            <div class="container">
                <a onClick={() => openDrawerContent()} disabled={isOnMovement}>
                    <i><FontAwesomeIcon icon="wrench" /></i>
                    <span>Setting</span>
                </a>
                {
                    !isOnMovement

                        ? <a>
                            <i><FontAwesomeIcon icon="sort-amount-up" onClick={() => setIsOnMovement()} /> </i>
                            <span>Arrange</span>
                        </a> :
                        <a>
                            <i><FontAwesomeIcon icon="save" onClick={() => this.showConfirm()} /></i>
                            <span>Arrange</span>
                        </a>
                }

                <a onClick={() => turnOnOffEditMode()} disabled={isOnMovement}>
                    <i><FontAwesomeIcon icon="edit" /></i>
                    <span>Update</span>
                </a>
            </div>
        )
    }

}

export default Widget