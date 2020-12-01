import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import RestClient from '../../assets/common/core/restClient'
import Courses from '../../pages-modules/components/courses'

const PageCourse = ({ listCourses }) => {
    return (
        <IndexLayout>
            <Courses listCourses={listCourses} />
        </IndexLayout>
    )
}

PageCourse.getInitialProps = async () => {
    const data = await RestClient.asyncGet('/subject?fbclid=IwAR1JJS38lHJxaGQj_0qX_wac6rBENjblfgoPGYPTE7_tSkALB2jUvKncPPU');
    console.log(data);

    return {
        listCourses: data
    };
}

export default PageCourse
