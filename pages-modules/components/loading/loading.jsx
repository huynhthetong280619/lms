import { withTranslation } from 'react-i18next'
import { Spin, Alert } from 'antd'

const Loading = ({t}) => {
    return (
        <Spin spinning>
            <Alert
                message={t('get_data_server')}
                description={t('reason_get_server')}
                type="info"
            />
        </Spin>
    )
}
export default withTranslation('translations')(Loading);