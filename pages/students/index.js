import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import restClient from '../../assets/common/core/restClient'
import Student from '../../pages-modules/components/students/index'
import {get} from 'lodash'
const StudentPage = ({ listStudent, lstSubmissionCore, idSubject, subject }) => {
    const nameSubject = get(subject, 'name')
    return (
        <IndexLayout>
            <Student listStudent={listStudent} lstSubmissionCore={lstSubmissionCore} idSubject={idSubject} nameSubject={nameSubject}/>
        </IndexLayout>
    )
}

StudentPage.getInitialProps = async (ctx) => {
    const {idSubject} = ctx.query;

    const [listStudent, lstSubmissionCore, subject]= await Promise.all([restClient.asyncGet(`/subject/${idSubject}/students`), restClient.asyncGet(`/subject/${idSubject}/score`), restClient.asyncGet(`/subject/${idSubject}`)])
    
    console.log('getInitial', lstSubmissionCore)
    return {
        listStudent: get(listStudent, 'data'),
        lstSubmissionCore: get(lstSubmissionCore, 'data'),
        idSubject,
        subject
    }
}

export default StudentPage
