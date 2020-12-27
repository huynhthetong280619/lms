import restClient from "../../assets/common/core/restClient";
import ViewOnline from "../../pages-modules/components/view";
import { get } from 'lodash'
const { default: IndexLayout } = require("../../pages-modules/layouts/layout")
import { parseCookies } from '../../assets/helpers'
const ViewPage = ({ detailFile }) => {
    return (
        <IndexLayout>
            <ViewOnline detailFile={detailFile} />
        </IndexLayout>
    )
}

ViewPage.getInitialProps = async (ctx) => {
    const data = parseCookies(ctx.req);
    const token = data.token
    console.log('ViewPage', ctx)
    const { idSubject, idTimeline, idFile } = ctx.query;

    const detailFile = await restClient.asyncGet(`/timeline/${idTimeline}/file/${idFile}?idSubject=${idSubject}`, token);
    console.log(detailFile)
    return {
        detailFile: get(detailFile, 'data').file
    }
}

export default ViewPage;