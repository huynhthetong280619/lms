import React from 'react'
import restClient from '../../assets/common/core/restClient'
import IndexLayout from '../../pages-modules/layouts/layout'
import Profile from '../../pages-modules/components/profiles/index'
import { get } from 'lodash'
const ProfilePage = () => {
    return (
        <IndexLayout>
            <Profile/>
        </IndexLayout>
    )
}

ProfilePage.getInitialProps = async () => {

    return {
        
    }
}
export default ProfilePage
