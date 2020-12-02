import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import restClient from '../../assets/common/core/restClient'
import Student from '../../pages-modules/components/students/index'
import {get} from 'lodash'
const StudentPage = ({ listStudent }) => {
    return (
        <IndexLayout>
            <Student listStudent={listStudent}/>
        </IndexLayout>
    )
}

StudentPage.getInitialProps = async () => {
    const res = await restClient.asyncGet('/subject/lthdt01/student')

    return {
        listStudent: get(res, 'data')
    }
}

export default StudentPage
