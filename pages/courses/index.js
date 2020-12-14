import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import RestClient from '../../assets/common/core/restClient'
import Courses from '../../pages-modules/components/courses'
import { get } from 'lodash'

const PageCourse = ({ listCourses, lstAssignment}) => {
    
    const listDeadline = lstAssignment.filter(obj => obj.isSubmit === false)
    const listDueAssginment = lstAssignment.filter(obj => obj.isSubmit === true)

    return (
        <IndexLayout>
            <Courses listCourses={listCourses} listDeadline={listDeadline} listDueAssginment={listDueAssginment}/>
    </IndexLayout>
    )
}

PageCourse.getInitialProps = async () => {

    const [lstCourses, lstAssignment] = await Promise.all([RestClient.asyncGet('/subject'), RestClient.asyncGet('/subject/deadline')])
   
    return {
        listCourses: get(lstCourses, 'data'),
        lstAssignment: get(lstAssignment, 'data')
    };
}

export default PageCourse
