import React from 'react'
import restClient from '../../../assets/common/core/restClient'
import Forum from '../../../pages-modules/components/forums'
import IndexLayout from '../../../pages-modules/layouts/layout'

const ForumPage = () => {
    return <IndexLayout>
        <Forum />
    </IndexLayout>
}

ForumPage.getInitialProps = async (ctx) => {
    console.log(ctx);
    const {id} = ctx.query

    const res = await restClient.asyncGetBody(`/forums/${id}?idSubject=lthdt01&5f75e682817a140f580937bc`)
    console.log(res)
    return {}
}

export default ForumPage
