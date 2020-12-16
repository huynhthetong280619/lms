import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'

import Quiz from '../../pages-modules/components/quizzes/index';
import restClient from '../../assets/common/core/restClient';
import {get} from 'lodash'


const QuizPage = ({requirementExam, idExam,idTimeline, subject }) => {
    const nameSubject = get(subject, 'name')
    return <IndexLayout>
       <Quiz requirementExam={requirementExam} idExam={idExam} idTimeline={idTimeline} nameSubject={nameSubject}/>
    </IndexLayout>
}

QuizPage.getInitialProps = async (ctx) => {
    console.log('Quiz page', ctx)
    const {params, idTimeline, idSubject} = ctx.query
    const [idExam] = params
    const [requirement, subject] = await Promise.all([restClient.asyncGet(`/exam/${idExam}?idSubject=${idSubject}&idTimeline=${idTimeline}`), restClient.asyncGet(`/subject/${idSubject}`)]);
    
    console.log('Quiz', requirement, subject)
    return {
        requirementExam: get(requirement, 'data'),
        idExam,
        idTimeline,
        subject: get(subject, 'data')
    }
}

export default QuizPage
