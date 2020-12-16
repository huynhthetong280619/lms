import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'

import restClient from '../../assets/common/core/restClient'
import Exams from '../../pages-modules/components/exams';
import { get } from 'lodash';

const ExamsPage = ({examQuestion, subject}) => {
    
    const nameSubject = get(subject, 'name')
    console.log('examQuestion', examQuestion)

    return <IndexLayout>
         <Exams examQuestion={examQuestion} subject={subject}/>
    </IndexLayout>
}


ExamsPage.getInitialProps = async (ctx) => {
    
    console.log('ExamsPage')
    const {params} = ctx.query
    const [idExam, idTimeline, idSubject] = params

    console.log('aaaa', idExam, idTimeline)
    const [exams, subject] = await Promise.all([restClient.asyncGet(`/exam/${idExam}/attempt?idSubject=${idSubject}&idTimeline=${idTimeline}`, restClient), restClient.asyncGet(`/subject/${idSubject}`)])
    
    if(exams.hasError){
        return {
            examQuestion: null
        };
    }

    return {
        examQuestion: get(exams, 'data'),
        subject: get(subject, 'data')
    }
}

export default ExamsPage
