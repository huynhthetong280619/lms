import React from 'react'
import restClient from '../../assets/common/core/restClient'
import Survey from '../../pages-modules/components/surveys'
import IndexLayout from '../../pages-modules/layouts/layout'
import { get } from 'lodash'
const SurveyPage = ({ survey, subject, idSubject,
    idTimeline,
    idSurvey }) => {
    const nameSubject = get(subject, 'name')

    return <IndexLayout>
        <Survey survey={survey} nameSubject={nameSubject} idSubject={idSubject}
            idTimeline={idTimeline}
            idSurvey={idSurvey} />
    </IndexLayout>
}


SurveyPage.getInitialProps = async (ctx) => {
    console.log('SurveyPage', ctx);
    const { idSubject, idTimeline, idSurvey } = ctx.query;
    const [survey, subject] = await Promise.all([restClient.asyncGet(`/survey/${idSurvey}?idSubject=${idSubject}&idTimeline=${idTimeline}`), restClient.asyncGet(`/subject/${idSubject}`)])

    console.log('SurveyPage', survey, subject)
    return {
        survey: get(survey, 'data').survey,
        subject: get(subject, 'data').subject,
        idSubject,
        idTimeline,
        idSurvey
    }
}

export default SurveyPage
