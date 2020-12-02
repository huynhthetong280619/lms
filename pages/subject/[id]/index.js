import React from 'react'
import IndexLayout from '../../../pages-modules/layouts/layout';
import RestClient from '../../../assets/common/core/restClient';
import Subject from '../../../pages-modules/components/subject';
import { get } from 'lodash';


const SubjectCourse = ({subject}) => {
    console.log(subject.timelines[0].forums)
    return (
        <IndexLayout>
            <Subject subject={subject}/>
        </IndexLayout>
    )
}

SubjectCourse.getInitialProps = async (ctx) => {
    const {id} = ctx.query;
    const res = await RestClient.asyncGet(`/subject/${id}`)

    return {
        subject: get(res, 'data')
    }
}

export default SubjectCourse
