import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'

import restClient from '../../assets/common/core/restClient'
import Exams from '../../pages-modules/components/exams';
import { get } from 'lodash';

const ExamsPage = ({examQuestion, subject, idSubject,
    idTimeline,
    idExam}) => {
    
    const nameSubject = get(subject, 'name')
    console.log('examQuestion', examQuestion)

    return <IndexLayout>
         <Exams examQuestion={examQuestion} subject={subject} nameSubject={nameSubject} idSubject={idSubject} idTimeline={idTimeline} idExam={idExam}/>
    </IndexLayout>
}


ExamsPage.getInitialProps = async (ctx) => {
    
    console.log('ExamsPage', ctx)
    const {params, idTimeline, idSubject} = ctx.query
    const [idExam ] = params

    console.log('aaaa', idExam, idTimeline)
    const [exams, subject] = await Promise.all([restClient.asyncGet(`/exam/${idExam}/attempt?idSubject=${idSubject}&idTimeline=${idTimeline}`), restClient.asyncGet(`/subject/${idSubject}`)])
    
    if(exams.hasError){
        return {
            examQuestion: null
        };
    }

    console.log('examQuestion', exams)

    return {
        examQuestion: get(exams, 'data').quiz,
        subject: get(subject, 'data'),
        idSubject,
        idTimeline,
        idExam
    }
}

export default ExamsPage
