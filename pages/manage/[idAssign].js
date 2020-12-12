const { default: Manage } = require("../../pages-modules/components/manage")
import IndexLayout from '../../pages-modules/layouts/layout';
import restClient from '../../assets/common/core/restClient'
import {get} from 'lodash'

const DetailPage = ({lstSubmission}) => {

    return (
        <IndexLayout>
            <Manage lstSubmission={lstSubmission}/>
        </IndexLayout>
    )
}

DetailPage.getInitialProps = async (ctx) => {

    const {idAssign, idSubject, idTimeline} = ctx.query

    const lstSubmission =await restClient.asyncGet(`/assignment/${idAssign}?idSubject=${idSubject}&idTimeline=${idTimeline}`)

    return {
        lstSubmission: get(lstSubmission, 'data')
    }

}

export default DetailPage;
