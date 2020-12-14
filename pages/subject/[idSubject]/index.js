import React from 'react'
import IndexLayout from '../../../pages-modules/layouts/layout';
import RestClient from '../../../assets/common/core/restClient';
import Subject from '../../../pages-modules/components/subject';
import { get } from 'lodash';
import glb_sv from '../../../assets/global/global.service'

const SubjectCourse = ({subject, idSubject, lstTimeline, lstQuizzis, lstDeadline}) => {

    const lstDueTo = lstDeadline.filter(obj => obj.isSubmit === true);
    const deadline = lstDeadline.filter(obj => obj.isSubmit === false)
    const nameSubject = get(subject, 'name');

    return (
        <IndexLayout>
            <Subject subject={subject} idSubject={idSubject} lstTimeline={lstTimeline} lstQuizzis={lstQuizzis} lstDeadline={deadline} lstDueTo={lstDueTo} nameSubject={nameSubject}/>
        </IndexLayout>
    )
}

SubjectCourse.getInitialProps = async (ctx) => {
    const {idSubject} = ctx.query;
    const [lstSubject, lstTimeline, lstQuizzis, lstDeadline] = await Promise.all([
        RestClient.asyncGet(`/subject/${idSubject}`),
        RestClient.asyncGet(`/timeline?idSubject=${idSubject}`),
        RestClient.asyncGet(`/quiz?idSubject=${idSubject}`),
        RestClient.asyncGet('/subject/deadline')
    ])

    console.log('xya', lstSubject, lstTimeline, lstQuizzis, lstDeadline)

    return {
        idSubject,
        subject: get(lstSubject, 'data'),
        lstTimeline: get(lstTimeline, 'data'),
        lstQuizzis: get(lstQuizzis, 'data'),
        lstDeadline: get(lstDeadline, 'data'),
    }
}

export default SubjectCourse
