import { get } from 'lodash'
import React from 'react'
import restClient from '../../../assets/common/core/restClient'
import Forum from '../../../pages-modules/components/forums'
import IndexLayout from '../../../pages-modules/layouts/layout'

const ForumPage = ({forum, idForum, idSubject, idTimeline, subject}) => {
    const nameSubject = get(subject, 'name')
    return <IndexLayout>
        <Forum forum={forum} idForum={idForum} idTimeline={idTimeline} idSubject={idSubject} nameSubject={nameSubject}/>
    </IndexLayout>
}

ForumPage.getInitialProps = async (ctx) => {
    console.log('ForumPage', ctx);
    const {idForum, idSubject, idTimeline} = ctx.query

    const [forum, subject] = await Promise.all([restClient.asyncGet(`/forum/${idForum}?idSubject=${idSubject}&idTimeline=${idTimeline}`), restClient.asyncGet(`/subject/${idSubject}`)])

    return {
        forum: get(forum, 'data'),
        idForum,
        idSubject,
        idTimeline,
        subject: get(subject, 'data')
    }
}

export default ForumPage
