import React from 'react'
import IndexLayout from '../../../pages-modules/layouts/layout';
import RestClient from '../../../assets/common/core/restClient';
import Subject from '../../../pages-modules/components/subject';
import { get } from 'lodash';
import { parseCookies } from '../../../assets/helpers'

const SubjectCourse = ({ subject, idSubject, lstTimeline, lstQuizzes, lstDeadline, lstSurveys, token }) => {

    const lstDueTo = lstDeadline.filter(obj => obj.isSubmit === true);
    const deadline = lstDeadline.filter(obj => obj.isSubmit === false);
    console.log(lstDeadline);
    const nameSubject = get(subject, 'name');

    console.log(
        'subject', subject
    )
    return (
        <IndexLayout>
            <Subject subject={subject} idSubject={idSubject} lstTimeline={lstTimeline} lstQuizzes={lstQuizzes} lstDeadline={deadline} lstDueTo={lstDueTo} nameSubject={nameSubject} lstSurveys={lstSurveys} token={token} />
        </IndexLayout>
    )
}

SubjectCourse.getInitialProps = async (ctx) => {
    const data = parseCookies(ctx.req);
    const token = data.token
    const { idSubject } = ctx.query;
    const [lstSubject, lstTimeline, lstQuizzes, lstDeadline, lstSurveys] = await Promise.all([
        RestClient.asyncGet(`/subject/${idSubject}`, token),
        RestClient.asyncGet(`/timeline?idSubject=${idSubject}`, token),
        RestClient.asyncGet(`/quiz?idSubject=${idSubject}`, token),
        RestClient.asyncGet(`/subject/${idSubject}/deadline`, token),
        RestClient.asyncGet(`/questionnaire?idSubject=${idSubject}`, token),
    ])

    //console.log('xya', lstSubject, lstTimeline, lstQuizzes, lstDeadline,lstSurveys)
    console.log('lstSurveys', lstSurveys);
    return {
        idSubject,
        subject: get(get(lstSubject, 'data'), 'subject') || [],
        lstTimeline: get(get(lstTimeline, 'data'), 'timelines') || [],
        lstQuizzes: get(get(lstQuizzes, 'data'), 'quizBank') || [],
        lstDeadline: get(get(lstDeadline, 'data'), 'deadline') || [],
        lstSurveys: get(get(lstSurveys, 'data'), 'surveyBank') || [],
        token

    }
}

export default SubjectCourse
