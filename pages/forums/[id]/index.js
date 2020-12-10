import { get } from 'lodash'
import React from 'react'
import restClient from '../../../assets/common/core/restClient'
import Forum from '../../../pages-modules/components/forums'
import IndexLayout from '../../../pages-modules/layouts/layout'

const ForumPage = ({forum}) => {
    return <IndexLayout>
        <Forum forum={forum}/>
    </IndexLayout>
}

ForumPage.getInitialProps = async (ctx) => {
    console.log(ctx);
    const {id} = ctx.query

    const res = await restClient.asyncGetBody(`/forum/${id}?idSubject=lthdt01&idTimeline=5f75e682817a140f580937bc`)
    console.log('ForumPage', res)
    return {
        forum: get(res, 'data')
    }
}

export default ForumPage
