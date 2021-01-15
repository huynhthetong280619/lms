import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import restClient from '../../assets/common/core/restClient'
import Student from '../../pages-modules/components/students/index'
import {get} from 'lodash'
import { parseCookies } from '../../assets/helpers'

const StudentPage = ({ listStudent, lstSubmissionCore=[], idSubject, subject, lstClassScore, token }) => {
    const nameSubject = get(subject, 'name')
    return (
        <IndexLayout>
            <Student listStudent={listStudent} lstSubmissionCore={lstSubmissionCore || []} idSubject={idSubject} nameSubject={nameSubject} lstClassScore={lstClassScore} token={token}/>
        </IndexLayout>
    )
}

StudentPage.getInitialProps = async (ctx) => {
const data = parseCookies(ctx.req);
    const token = data.token
    const {idSubject} = ctx.query;

    const [listStudent, lstSubmissionCore, subject, lstClassScore]= await Promise.all([restClient.asyncGet(`/subject/${idSubject}/students`, token), restClient.asyncGet(`/subject/${idSubject}/score`, token), restClient.asyncGet(`/subject/${idSubject}`, token), restClient.asyncGet(`/subject/${idSubject}/transcript`, token)])
    
    //console.log('getInitial', subject)
    return {
        listStudent: get(listStudent, 'data').students,
        lstSubmissionCore: get(lstSubmissionCore, 'data'),
        idSubject,
        subject: get(subject, 'data').subject,
        lstClassScore: get(lstClassScore, 'data'),
        token
    }
}

export default StudentPage
