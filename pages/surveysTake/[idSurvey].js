import React from 'react'
import restClient from '../../assets/common/core/restClient'
import SurveyExecute from '../../pages-modules/components/surveys/execute'
import IndexLayout from '../../pages-modules/layouts/layout'
import { get } from 'lodash'
const SurveyExePage = ({ surveyQ, subject, idSubject,
    idTimeline, idSurvey }) => {
    const nameSubject = get(subject, 'name');

    return <IndexLayout>
        <SurveyExecute surveyQ={surveyQ} nameSubject={nameSubject} idSubject={idSubject}
            idTimeline={idTimeline} idSurvey={idSurvey}/>
    </IndexLayout>
}

SurveyExePage.getInitialProps = async (ctx) => {
    const { idSubject, idTimeline, idSurvey } = ctx.query
    const [surveyQ, subject] = await Promise.all([
        restClient.asyncGet(`/survey/${idSurvey}/attempt?idSubject=${idSubject}&idTimeline=${idTimeline}`),
        restClient.asyncGet(`/subject/${idSubject}`)
    ])

    console.log('SurveyExePage', surveyQ)

    return {
        surveyQ: get(surveyQ, 'data'),
        subject: get(subject, 'data').subject,
        idSubject,
        idTimeline,
        idSurvey
    }
}

export default SurveyExePage