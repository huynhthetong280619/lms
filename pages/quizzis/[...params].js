import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'

import Quiz from '../../pages-modules/components/quizzes/index';
import restClient from '../../assets/common/core/restClient';
import {get} from 'lodash'
import { parseCookies } from '../../assets/helpers'


const QuizPage = ({requirementExam, idExam,idTimeline, subject, idSubject, token }) => {
    const nameSubject = get(subject, 'name')
    return <IndexLayout>
       <Quiz requirementExam={requirementExam} idExam={idExam} idTimeline={idTimeline} nameSubject={nameSubject} idSubject={idSubject} token={token}/>
    </IndexLayout>
}

QuizPage.getInitialProps = async (ctx) => {
    console.log('Quiz page', ctx)
const data = parseCookies(ctx.req);
    const token = data.token
    const {params, idTimeline, idSubject} = ctx.query
    const [idExam] = params
    const [requirement, subject] = await Promise.all([restClient.asyncGet(`/exam/${idExam}?idSubject=${idSubject}&idTimeline=${idTimeline}`, token), restClient.asyncGet(`/subject/${idSubject}`, token)]);
    
    console.log('Quiz', requirement, subject)
    return {
        requirementExam: get(requirement, 'data').exam,
        idExam,
        idTimeline,
        subject: get(subject, 'data').subject,
        idSubject,
        token
    }
}

export default QuizPage
