import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import RestClient from '../../assets/common/core/restClient'
import Courses from '../../pages-modules/components/courses'
import { get } from 'lodash'
import { parseCookies } from '../../assets/helpers'
// import { parseCookies, setCookie, destroyCookie } from 'nookies'

const PageCourse = ({ listCourses = [], lstAssignment = [], token, isLoadingGlobal, setIsLoadingGlobal }) => {

    const listDeadline = (lstAssignment || []).filter(obj => obj.isSubmit === false)
    const listDueAssginment = (lstAssignment || []).filter(obj => obj.isSubmit === true)

    console.log('hello', listDeadline, listDueAssginment, lstAssignment)

    return (
        <IndexLayout>
            <Courses listCourses={listCourses || []} listDeadline={listDeadline} listDueAssginment={listDueAssginment} token={token} isLoadingGlobal={isLoadingGlobal} setIsLoadingGlobal={setIsLoadingGlobal}/>
        </IndexLayout>
    )
}

PageCourse.getInitialProps = async (ctx) => {
    const data = parseCookies(ctx.req);
    const token = data.token

    console.log('PageCourse', data, Object.keys(data).indexOf('token'))
    if (Object.keys(data).indexOf('token') < 0 && data.constructor === Object) {
        ctx.res.writeHead(301, { Location: "/" })
        ctx.res.end();
        return;
    }

    const [lstCourses, lstAssignment] = await Promise.all([RestClient.asyncGet('/subject', token), RestClient.asyncGet('/subject/deadline', token)])
    console.log('PageCourse', lstCourses, lstAssignment)
    return {
        listCourses: get(lstCourses, 'data').allSubject,
        lstAssignment: get(lstAssignment, 'data').deadline,
        token
    };
}

export default PageCourse
