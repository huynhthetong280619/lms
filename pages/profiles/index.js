import React from 'react'
import restClient from '../../assets/common/core/restClient'
import IndexLayout from '../../pages-modules/layouts/layout'
import Profile from '../../pages-modules/components/profiles/index'
import RestClient from '../../assets/common/core/restClient'
import Courses from '../../pages-modules/components/courses'
import { get } from 'lodash'
import { parseCookies } from '../../assets/helpers'
const ProfilePage = ({ lstAssignment, token }) => {
    const listDeadline = (lstAssignment || []).filter(obj => obj.isSubmit === false)
    const listDueAssginment = (lstAssignment || []).filter(obj => obj.isSubmit === true)
    return (
        <IndexLayout>
            <Profile listDeadline={listDeadline} listDueAssginment={listDueAssginment} token={token} />
        </IndexLayout>
    )
}

ProfilePage.getInitialProps = async (ctx) => {

    const data = parseCookies(ctx.req);
    const token = data.token

    console.log('PageCourse', data, Object.keys(data).indexOf('token'))
    if (Object.keys(data).indexOf('token') < 0 && data.constructor === Object) {
        ctx.res.writeHead(301, { Location: "/" })
        ctx.res.end();
        return;
    }

    const [lstAssignment] = await Promise.all([RestClient.asyncGet('/subject/deadline', token)])

    return {
        lstAssignment: get(lstAssignment, 'data').deadline,
        token
    }
}
export default ProfilePage
