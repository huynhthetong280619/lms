import React from 'react'
import Discussion from '../../../pages-modules/components/discuss'
import IndexLayout from '../../../pages-modules/layouts/layout'
import restClient from '../../../assets/common/core/restClient'
import { get } from 'lodash'

const DiscussionPage = ({ lstDiscussion, idTopic, idSubject, idTimeline, idForum, detailTopic, subject }) => {
    console.log('lstDiscussion', lstDiscussion)
    const nameSubject = get(subject, 'name')

    console.log('Discussion', nameSubject)
    return <IndexLayout>
        <Discussion lstDiscussion={lstDiscussion} idTopic={idTopic} idSubject={idSubject} idTimeline={idTimeline} idForum={idForum} detailTopic={detailTopic} nameSubject={nameSubject} />
    </IndexLayout>

}

DiscussionPage.getInitialProps = async (ctx) => {
    const { idTopic, idSubject, idTimeline, idForum } = ctx.query

    const [lstDiscussion, detailTopic, subject] = await Promise.all([restClient.asyncGet(`/discussion?idSubject=${idSubject}&idTimeline=${idTimeline}&idForum=${idForum}&idTopic=${idTopic}`),
    restClient.asyncGet(`/topic/${idTopic}?idSubject=${idSubject}&idTimeline=${idTimeline}&idForum=${idForum}`), restClient.asyncGet(`/subject/${idSubject}`)
    ])

    console.log('DiscussionPage', subject, lstDiscussion, detailTopic)
    return {
        lstDiscussion: get(lstDiscussion, 'data'),
        idTopic,
        idSubject,
        idTimeline,
        idForum,
        detailTopic: get(detailTopic, 'data').topic,
        subject: get(subject, 'data').subject
    }
}

export default DiscussionPage
