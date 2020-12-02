import React from 'react'
import restClient from '../../assets/common/core/restClient'
import IndexLayout from '../../pages-modules/layouts/layout'
import Profile from '../../pages-modules/components/profiles/index'
import { get } from 'lodash'
const ProfilePage = ({profile}) => {
    console.log('profile', profile)
    return (
        <IndexLayout>
            <Profile profile={profile}/>
        </IndexLayout>
    )
}

ProfilePage.getInitialProps = async () => {
    const res = await restClient.asyncGet('/user/17110355');

    return {
        profile: get(res, 'data')
    }
}
export default ProfilePage
