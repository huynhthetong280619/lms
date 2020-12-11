import React from 'react'
import Discussion from '../../../pages-modules/components/discuss'
import IndexLayout from '../../../pages-modules/layouts/layout'
import restClient from '../../../assets/common/core/restClient'
import { get } from 'lodash'

const DiscussionPage = ({ lstDiscussion, idTopic, idSubject, idTimeline, idForum, detailTopic }) => {
    console.log('lstDiscussion', lstDiscussion)
    return <IndexLayout>
        <Discussion lstDiscussion={lstDiscussion} idTopic={idTopic} idSubject={idSubject} idTimeline={idTimeline} idForum={idForum} detailTopic={detailTopic} />
    </IndexLayout>

}

DiscussionPage.getInitialProps = async (ctx) => {
    console.log('Forum page', ctx)
    const { idTopic, idSubject, idTimeline, idForum } = ctx.query

    const [lstDiscussion, detailTopic] = await Promise.all([restClient.asyncGet(`/discussion?idSubject=${idSubject}&idTimeline=${idTimeline}&idForum=${idForum}&idTopic=${idTopic}`),
    restClient.asyncGet(`/topic/${idTopic}?idSubject=${idSubject}&idTimeline=${idTimeline}&idForum=${idForum}`)
    ])
    return {
        lstDiscussion: get(lstDiscussion, 'data'),
        idTopic,
        idSubject,
        idTimeline,
        idForum,
        detailTopic: get(detailTopic, 'data')
    }
}

export default DiscussionPage
