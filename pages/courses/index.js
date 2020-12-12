import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import RestClient from '../../assets/common/core/restClient'
import Courses from '../../pages-modules/components/courses'
import { get } from 'lodash'

const PageCourse = ({ listCourses, listDeadline, listDueAssginment }) => {
    console.log('listDeadline', listDeadline)
    return (
        <IndexLayout>
            <Courses listCourses={listCourses} listDeadline={listDeadline} listDueAssginment={listDueAssginment}/>
        </IndexLayout>
    )
}

PageCourse.getInitialProps = async () => {
    let resCourse = await RestClient.asyncGet('/subject');
    let resAssignment = await RestClient.asyncGet('/subject/deadline')
    
    resCourse = get(resCourse, 'data');
    resAssignment = get(resAssignment, 'data')
    
    console.log('PageCourse', resCourse, resAssignment)
    const overDueAssignment = resAssignment.filter(obj => !obj.isSubmit);

    resAssignment = resAssignment.filter(obj => obj.isSubmit === true)

    

    return {
        listCourses: resCourse,
        listDeadline: resAssignment,
        listDueAssginment: overDueAssignment
    };
}

export default PageCourse
