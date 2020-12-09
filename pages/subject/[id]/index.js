import React from 'react'
import IndexLayout from '../../../pages-modules/layouts/layout';
import RestClient from '../../../assets/common/core/restClient';
import Subject from '../../../pages-modules/components/subject';
import { get } from 'lodash';


const SubjectCourse = ({subject, id}) => {
    return (
        <IndexLayout>
            <Subject subject={subject} idSubject={id}/>
        </IndexLayout>
    )
}

SubjectCourse.getInitialProps = async (ctx) => {
    const {id} = ctx.query;
    const res = await RestClient.asyncGet(`/subject/${id}`)
    return {
        subject: get(res, 'data'),
        id
    }
}

export default SubjectCourse
