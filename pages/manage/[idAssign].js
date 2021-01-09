const { default: Manage } = require("../../pages-modules/components/manage")
import IndexLayout from '../../pages-modules/layouts/layout';
import restClient from '../../assets/common/core/restClient'
import { get } from 'lodash'
import { parseCookies } from '../../assets/helpers'

const DetailPage = ({ assignment, idAssign, idSubject,
    idTimeline, token }) => {

    return (
        <IndexLayout>
            <Manage assignment={assignment} idAssign={idAssign} idSubject={idSubject}
                idTimeline={idTimeline} token={token} />
        </IndexLayout>
    )
}

DetailPage.getInitialProps = async (ctx) => {

    const data = parseCookies(ctx.req);
    const token = data.token
    const { idAssign, idSubject, idTimeline } = ctx.query

    const res = await restClient.asyncGet(`/assignment/${idAssign}?idSubject=${idSubject}&idTimeline=${idTimeline}`, token)
    const assignment = get(res, 'data').assignment;
    return {
        assignment: assignment,
        idAssign,
        idSubject,
        idTimeline,
        token
    }

}

export default DetailPage;
