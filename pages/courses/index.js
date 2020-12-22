import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import RestClient from '../../assets/common/core/restClient'
import Courses from '../../pages-modules/components/courses'
import { get } from 'lodash'
import glb_sv from '../../assets/global/global.service';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

const PageCourse = ({listCourses = [], lstAssignment = []}) => {
    
    const listDeadline = lstAssignment || [].filter(obj => obj.isSubmit === false)
    const listDueAssginment = lstAssignment || [].filter(obj => obj.isSubmit === true)

    return (
        <IndexLayout>
            <Courses listCourses={listCourses || []} listDeadline={listDeadline} listDueAssginment={listDueAssginment}/>
    </IndexLayout>
    )
}

PageCourse.getInitialProps = async (ctx) => {

    // const cookies = parseCookies(ctx)
    // console.log('PageCourse', cookies)
    const [lstCourses, lstAssignment] = await Promise.all([RestClient.asyncGet('/subject'), RestClient.asyncGet('/subject/deadline')])
   console.log('PageCourse', lstCourses, lstAssignment)
    return {
        listCourses: get(lstCourses, 'data').allSubject,
        lstAssignment: get(lstAssignment, 'data')
    };
}

export default PageCourse
