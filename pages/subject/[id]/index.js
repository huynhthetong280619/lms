import React from 'react'
import IndexLayout from '../../../pages-modules/layouts/layout';
import RestClient from '../../../assets/common/core/restClient';
import Subject from '../../../pages-modules/components/subject';
import { get } from 'lodash';


const SubjectCourse = ({subject, id, lstTimeline, lstQuizzis, lstDeadline}) => {
    const lstDueTo = lstDeadline.filter(obj => obj.isSubmit === true);
    console.log('SubjectCourse', lstDeadline)
    return (
        <IndexLayout>
            <Subject subject={subject} idSubject={id} lstTimeline={lstTimeline} lstQuizzis={lstQuizzis} lstDeadline={lstDeadline} lstDueTo={lstDueTo}/>
        </IndexLayout>
    )
}

SubjectCourse.getInitialProps = async (ctx) => {
    const {id} = ctx.query;
    const [lstSubject, lstTimeline, lstQuizzis, lstDeadline] = await Promise.all([
        RestClient.asyncGet(`/subject/${id}`),
        RestClient.asyncGet(`/timeline?idSubject=${id}`),
        RestClient.asyncGet(`/quiz?idSubject=${id}`),
        RestClient.asyncGet('/subject/deadline')
    ])

    console.log('xya', lstSubject, lstTimeline, lstQuizzis, lstDeadline)

    return {
        id,
        subject: get(lstSubject, 'data'),
        lstTimeline: get(lstTimeline, 'data'),
        lstQuizzis: get(lstQuizzis, 'data'),
        lstDeadline: get(lstDeadline, 'data'),
    }
}

export default SubjectCourse
