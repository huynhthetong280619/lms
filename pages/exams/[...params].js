import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'

import restClient from '../../assets/common/core/restClient'
import Exams from '../../pages-modules/components/exams';
import { get } from 'lodash';
import { parseCookies } from '../../assets/helpers'

const ExamsPage = ({examQuestion, subject, idSubject,
    idTimeline,
    idExam, token}) => {
    
    const nameSubject = get(subject, 'name')
    //console.log('examQuestion', examQuestion)

    return <IndexLayout>
         <Exams examQuestion={examQuestion} subject={subject} nameSubject={nameSubject} idSubject={idSubject} idTimeline={idTimeline} idExam={idExam} token={token}/>
    </IndexLayout>
}


ExamsPage.getInitialProps = async (ctx) => {
    
    //console.log('ExamsPage', ctx)
const data = parseCookies(ctx.req);
    const token = data.token

    const {params, idTimeline, idSubject} = ctx.query
    const [idExam ] = params

    const [exams, subject] = await Promise.all([restClient.asyncGet(`/exam/${idExam}/attempt?idSubject=${idSubject}&idTimeline=${idTimeline}`, token), restClient.asyncGet(`/subject/${idSubject}`, token)])
    
    if(exams.hasError){
        ctx.res.writeHead(301, `/quizzis/${idExam}?idSubject=${idSubject}&idTimeline=${idTimeline}`);
        return;
    }

    return {
        examQuestion: get(exams, 'data').quiz,
        subject: get(subject, 'data').subject,
        idSubject,
        idTimeline,
        idExam,
        token
    }
}

export default ExamsPage
