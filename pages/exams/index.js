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


ExamsPage.getInitialProps = async () => {

    const res = await restClient.asyncGet(`/exam/5fc5faf66d1c0c08dca71b82/attempt?idSubject=lthdt01&idTimeline=5f75e682817a140f580937bc`)
    
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
