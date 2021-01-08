import { get } from 'lodash'
import React from 'react'
import restClient from '../../../assets/common/core/restClient'
import Forum from '../../../pages-modules/components/forums'
import IndexLayout from '../../../pages-modules/layouts/layout'
import { parseCookies } from '../../../assets/helpers'

const ForumPage = ({ forum, idForum, idSubject, idTimeline, subject, token }) => {
    const nameSubject = get(subject, 'name')
    return <IndexLayout>
        <Forum forum={forum} idForum={idForum} idTimeline={idTimeline} idSubject={idSubject} nameSubject={nameSubject} token={token} />
    </IndexLayout>
}

ForumPage.getInitialProps = async (ctx) => {
    const data = parseCookies(ctx.req);
    const token = data.token
    console.log('ForumPage', ctx);
    const { idForum, idSubject, idTimeline } = ctx.query

    const [forum, subject] = await Promise.all([restClient.asyncGet(`/forum/${idForum}?idSubject=${idSubject}&idTimeline=${idTimeline}`, token), restClient.asyncGet(`/subject/${idSubject}`, token)])

    return {
        forum: get(forum, 'data'),
        idForum,
        idSubject,
        idTimeline,
        subject: get(subject, 'data').subject,
        token
    }
}

export default ForumPage
