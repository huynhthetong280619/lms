import React from 'react'
import './overwrite.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../fontAwesomeIcon'
class Widget extends React.Component {

    render() {

        const { openDrawerContent } = this.props
        return (
            <div class="container">
                <a onClick={() => openDrawerContent()}>
                    <i><FontAwesomeIcon icon="plus-square" /></i>
                    <span>Setting</span>
                </a>
                <a href="#">
                    <i><FontAwesomeIcon icon="sort-amount-up" /></i>
                    <span>Arrange</span>
                </a>
            </div>
        )
    }

}

export default Widget