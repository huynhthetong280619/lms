import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import {Row, Col, Table, Tag, Space} from 'antd'

import Points from '../../pages-modules/components/points';
import restClient from '../../assets/common/core/restClient'
import {get} from 'lodash'

const PointPage = ({lstSubmissionCore, subject}) => {
  const nameSubject = get(subject, 'name')

        return <IndexLayout>
          <Points lstSubmissionCore={lstSubmissionCore} nameSubject={nameSubject}/>
        </IndexLayout>
}


PointPage.getInitialProps = async (ctx) => {
  const {idSubject} = ctx.query
  const [lstSubmissionCore, subject] = await Promise.all([restClient.asyncGet(`/subject/${idSubject}/score`), restClient.asyncGet(`/subject/${idSubject}`)]);

  return {
    lstSubmissionCore: get(lstSubmissionCore, 'data'),
    subject: get(subject, 'data')
  }
}
export default PointPage
