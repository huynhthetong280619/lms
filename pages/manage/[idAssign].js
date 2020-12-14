const { default: Manage } = require("../../pages-modules/components/manage")
import IndexLayout from '../../pages-modules/layouts/layout';
import restClient from '../../assets/common/core/restClient'
import { get } from 'lodash'

const DetailPage = ({ lstSubmission, idAssign, idSubject,
    idTimeline }) => {

    return (
        <IndexLayout>
            <Manage lstSubmission={lstSubmission} idAssign={idAssign} idSubject={idSubject}
                idTimeline={idTimeline} />
        </IndexLayout>
    )
}

DetailPage.getInitialProps = async (ctx) => {

    const { idAssign, idSubject, idTimeline } = ctx.query

    const lstSubmission = await restClient.asyncGet(`/assignment/${idAssign}?idSubject=${idSubject}&idTimeline=${idTimeline}`)

    return {
        lstSubmission: get(lstSubmission, 'data'),
        idAssign,
        idSubject,
        idTimeline
    }

}

export default DetailPage;
