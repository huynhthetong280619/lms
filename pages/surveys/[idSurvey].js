import React from 'react'
import restClient from '../../assets/common/core/restClient'
import Survey from '../../pages-modules/components/surveys'
import IndexLayout from '../../pages-modules/layouts/layout'
import { get } from 'lodash'
import { parseCookies } from '../../assets/helpers'

const SurveyPage = ({ survey, subject, idSubject,
    idTimeline,
    idSurvey, token, responseSurvey, replyCurrent }) => {
    const nameSubject = get(subject, 'name')

    return <IndexLayout>
        <Survey survey={survey} nameSubject={nameSubject} idSubject={idSubject}
            idTimeline={idTimeline}
            idSurvey={idSurvey} token={token} responseSurvey={responseSurvey} replyCurrent={replyCurrent}/>
    </IndexLayout>
}


SurveyPage.getInitialProps = async (ctx) => {
    const data = parseCookies(ctx.req);
    const token = data.token
    //console.log('SurveyPage', ctx);
    const { idSubject, idTimeline, idSurvey } = ctx.query;
    const [survey, subject, responseSurvey, replyCurrent] = await Promise.all([restClient.asyncGet(`/survey/${idSurvey}?idSubject=${idSubject}&idTimeline=${idTimeline}`, token), restClient.asyncGet(`/subject/${idSubject}`, token), restClient.asyncGet(`/survey/${idSurvey}/responses?idSubject=${idSubject}&idTimeline=${idTimeline}`, token), restClient.asyncGet(`/survey/${idSurvey}/view?idSubject=${idSubject}&idTimeline=${idTimeline}`, token)])

    //console.log('SurveyPage', survey, subject)
    return {
        survey: get(survey, 'data').survey,
        subject: get(subject, 'data').subject,
        idSubject,
        idTimeline,
        idSurvey,
        responseSurvey: get(responseSurvey, 'data'),
        replyCurrent: get(replyCurrent, 'data'),
        token
    }
}

export default SurveyPage
