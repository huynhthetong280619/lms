import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import restClient from '../../assets/common/core/restClient'
import Student from '../../pages-modules/components/students/index'
import {get} from 'lodash'
const StudentPage = ({ listStudent, lstSubmissionCore, idSubject }) => {
    return (
        <IndexLayout>
            <Student listStudent={listStudent} lstSubmissionCore={lstSubmissionCore} idSubject={idSubject}/>
        </IndexLayout>
    )
}

StudentPage.getInitialProps = async () => {
    const idSubject = 'lthdt01';

    const [listStudent, lstSubmissionCore]= await Promise.all([restClient.asyncGet(`/subject/${idSubject}/students`), restClient.asyncGet(`/subject/lthdt01/score`)])
    
    console.log('getInitial', lstSubmissionCore)
    return {
        listStudent: get(listStudent, 'data'),
        lstSubmissionCore: get(lstSubmissionCore, 'data'),
        idSubject
    }
}

export default StudentPage
