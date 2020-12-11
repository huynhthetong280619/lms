import { get } from 'lodash'
import React from 'react'
import restClient from '../../../assets/common/core/restClient'
import Forum from '../../../pages-modules/components/forums'
import IndexLayout from '../../../pages-modules/layouts/layout'

const ForumPage = ({forum, idForum, idSubject, idTimeline}) => {
    return <IndexLayout>
        <Forum forum={forum} idForum={idForum} idTimeline={idTimeline} idSubject={idSubject}/>
    </IndexLayout>
}

ForumPage.getInitialProps = async (ctx) => {
    console.log('ForumPage', ctx);
    const {idForum, idSubject, idTimeline} = ctx.query

    const res = await restClient.asyncGet(`/forum/${idForum}?idSubject=${idSubject}&idTimeline=${idTimeline}`)
    console.log('ForumPage', res)
    return {
        forum: get(res, 'data'),
        idForum,
        idSubject,
        idTimeline
    }
}

export default ForumPage
