import React from 'react'
import { withTranslation } from 'react-i18next'
import './overwrite.css'

class CountDownTest extends React.Component {

    render() {

        const { hours, minutes, seconds, t } = this.props;

        return (
            <div id="time">
                <div><span id="hour">{hours}</span><span>{t('quiz_hours')}</span></div>
                <div><span id="minute">{minutes}</span><span>{t('quiz_minutes')}</span></div>
                <div><span id="second">{seconds}</span><span>{t('quiz_seconds')}</span></div>
            </div>
        )
    }
}

export default withTranslation('translations')(CountDownTest)