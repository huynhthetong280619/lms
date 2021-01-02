import React from 'react'
import IndexLayout from '../../../pages-modules/layouts/layout';
import RestClient from '../../../assets/common/core/restClient';
import Subject from '../../../pages-modules/components/subject';
import { get } from 'lodash';
import { parseCookies } from '../../../assets/helpers'

const SubjectCourse = ({subject, idSubject, lstTimeline, lstQuizzis, lstDeadline, token}) => {

    const lstDueTo = lstDeadline.filter(obj => obj.isSubmit === true);
    const deadline = lstDeadline.filter(obj => obj.isSubmit === false)
    const nameSubject = get(subject, 'name');

    console.log(
        'subject', subject
    )
    return (
        <IndexLayout>
            <Subject subject={subject} idSubject={idSubject} lstTimeline={lstTimeline} lstQuizzis={lstQuizzis} lstDeadline={deadline} lstDueTo={lstDueTo} nameSubject={nameSubject} token={token}/>
        </IndexLayout>
    )
}

SubjectCourse.getInitialProps = async (ctx) => {
const data = parseCookies(ctx.req);
    const token = data.token
    const {idSubject} = ctx.query;
    const [lstSubject, lstTimeline, lstQuizzis, lstDeadline] = await Promise.all([
        RestClient.asyncGet(`/subject/${idSubject}`, token),
        RestClient.asyncGet(`/timeline?idSubject=${idSubject}`, token),
        RestClient.asyncGet(`/quiz?idSubject=${idSubject}`, token),
        RestClient.asyncGet('/subject/deadline', token)
    ])

    console.log('xya', lstSubject, lstTimeline, lstQuizzis, lstDeadline)

    return {
        idSubject,
        subject: get(get(lstSubject, 'data'), 'subject') || [],
        lstTimeline: get(get(lstTimeline, 'data'), 'timelines') || [],
        lstQuizzis: get(get(lstQuizzis, 'data'), 'quizBank') || [],
        lstDeadline: get(get(lstDeadline, 'data'), 'deadline') || [],
        token
        
    }
}

export default SubjectCourse
