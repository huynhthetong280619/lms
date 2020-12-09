import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'

import restClient from '../../assets/common/core/restClient'
import Exams from '../../pages-modules/components/exams';
import { get } from 'lodash';

const ExamsPage = ({examQuestion}) => {
    
    console.log('examQuestion', examQuestion)

    return <IndexLayout>
         <Exams examQuestion={examQuestion}/>
    </IndexLayout>
}


ExamsPage.getInitialProps = async (ctx) => {
    
    console.log('ExamsPage')
    const {params} = ctx.query
    const [idExam, idTimeline] = params

    console.log('aaaa', idExam, idTimeline)
    const res = await restClient.asyncGet(`/exam/${idExam}/attempt?idSubject=lthdt01&idTimeline=${idTimeline}`)
    
    console.log('bbbb', res)
    if(res.hasError){
        return {
            examQuestion: null
        };
    }

    return {
        examQuestion: get(res, 'data')
    }
}

export default ExamsPage
