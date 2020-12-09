import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'

import Quiz from '../../pages-modules/components/quizzes/index';
import restClient from '../../assets/common/core/restClient';
import {get} from 'lodash'


const QuizPage = ({requirementExam, idExam,idTimeline }) => {
    return <IndexLayout>
       <Quiz requirementExam={requirementExam} idExam={idExam} idTimeline={idTimeline}/>
    </IndexLayout>
}

QuizPage.getInitialProps = async (ctx) => {
    const {params} = ctx.query
    const [idExam, idTimeline] = params
    console.log('aaaa', idExam, idTimeline)
    const res = await restClient.asyncGet(`/exam/${idExam}?idSubject=lthdt01&idTimeline=${idTimeline}`);
    
    return {
        requirementExam: get(res, 'data'),
        idExam,
        idTimeline
    }
}

export default QuizPage
