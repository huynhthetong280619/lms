import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'

import Quiz from '../../pages-modules/components/quizzes/index';
import restClient from '../../assets/common/core/restClient';
import {get} from 'lodash'


const QuizPage = ({requirementExam}) => {
    return <IndexLayout>
       <Quiz requirementExam={requirementExam}/>
    </IndexLayout>
}

QuizPage.getInitialProps = async () => {
    console.log('aaaa')
    const res = await restClient.asyncGet(`/exam/5fc5faf66d1c0c08dca71b82?idSubject=lthdt01&idTimeline=5f75e682817a140f580937bc`);
    
    return {
        requirementExam: get(res, 'data')
    }
}

export default QuizPage
