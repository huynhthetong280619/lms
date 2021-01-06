import React from 'react'
import restClient from '../../assets/common/core/restClient'
import SurveyExecute from '../../pages-modules/components/surveys/execute'
import IndexLayout from '../../pages-modules/layouts/layout'
import { get } from 'lodash'
import { parseCookies } from '../../assets/helpers'

const SurveyExePage = ({ surveyQ, subject, idSubject,
    idTimeline, idSurvey, token }) => {
    const nameSubject = get(subject, 'name');

    return <IndexLayout>
        <SurveyExecute surveyQ={surveyQ} nameSubject={nameSubject} idSubject={idSubject}
            idTimeline={idTimeline} idSurvey={idSurvey} token={token}/>
    </IndexLayout>
}

SurveyExePage.getInitialProps = async (ctx) => {
    const data = parseCookies(ctx.req);
    const token = data.token
    const { idSubject, idTimeline, idSurvey } = ctx.query
    const [surveyQ, subject] = await Promise.all([
        restClient.asyncGet(`/survey/${idSurvey}/attempt?idSubject=${idSubject}&idTimeline=${idTimeline}`, token),
        restClient.asyncGet(`/subject/${idSubject}`, token)
    ])

    console.log('SurveyExePage', surveyQ)

    return {
        surveyQ: get(surveyQ, 'data'),
        subject: get(subject, 'data').subject,
        idSubject,
        idTimeline,
        idSurvey,
        token
    }
}

export default SurveyExePage
