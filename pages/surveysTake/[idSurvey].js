import React from 'react'
import restClient from '../../assets/common/core/restClient'
import SurveyExecute from '../../pages-modules/components/surveys/execute'
import IndexLayout from '../../pages-modules/layouts/layout'
import { get } from 'lodash'
import { parseCookies } from '../../assets/helpers'

const SurveyExePage = ({ survey, questionnaire, subject, idSubject,
    idTimeline, idSurvey, token }) => {
    const nameSubject = get(subject, 'name');
    console.log("survey", survey);

    return <IndexLayout>
        <SurveyExecute survey={survey} questionnaire={questionnaire} nameSubject={nameSubject} idSubject={idSubject}
            idTimeline={idTimeline} idSurvey={idSurvey} token={token} />
    </IndexLayout>
}

SurveyExePage.getInitialProps = async (ctx) => {
    const data = parseCookies(ctx.req);
    const token = data.token
    const { idSubject, idTimeline, idSurvey } = ctx.query
    const [survey, subject] = await Promise.all([
        restClient.asyncGet(`/survey/${idSurvey}/attempt?idSubject=${idSubject}&idTimeline=${idTimeline}`, token),
        restClient.asyncGet(`/subject/${idSubject}`, token)
    ])

    console.log('SurveyExePage', survey)

    return {
        survey: get(survey, 'data').survey,
        questionnaire: get(survey, 'data').questionnaire,
        subject: get(subject, 'data').subject,
        idSubject,
        idTimeline,
        idSurvey,
        token
    }
}

export default SurveyExePage
