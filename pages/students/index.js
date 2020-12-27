import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import restClient from '../../assets/common/core/restClient'
import Student from '../../pages-modules/components/students/index'
import {get} from 'lodash'
import { parseCookies } from '../../assets/helpers'

const StudentPage = ({ listStudent, lstSubmissionCore=[], idSubject, subject, lstClassScore }) => {
    const nameSubject = get(subject, 'name')
    return (
        <IndexLayout>
            <Student listStudent={listStudent} lstSubmissionCore={lstSubmissionCore || []} idSubject={idSubject} nameSubject={nameSubject} lstClassScore={lstClassScore}/>
        </IndexLayout>
    )
}

StudentPage.getInitialProps = async (ctx) => {
const data = parseCookies(ctx.req);
    const token = data.token
    const {idSubject} = ctx.query;

    const [listStudent, lstSubmissionCore, subject, lstClassScore]= await Promise.all([restClient.asyncGet(`/subject/${idSubject}/students`, token), restClient.asyncGet(`/subject/${idSubject}/score`, token), restClient.asyncGet(`/subject/${idSubject}`), restClient.asyncGet(`/subject/${idSubject}/transcript`, token)])
    
    console.log('getInitial', lstSubmissionCore)
    return {
        listStudent: get(listStudent, 'data').students,
        lstSubmissionCore: get(lstSubmissionCore, 'data'),
        idSubject,
        subject,
        lstClassScore: get(lstClassScore, 'data')
    }
}

export default StudentPage
