import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import {Row, Col, Table, Tag, Space} from 'antd'

import Points from '../../pages-modules/components/points';
import restClient from '../../assets/common/core/restClient'
import {get} from 'lodash'
import { parseCookies } from '../../assets/helpers'

const PointPage = ({lstSubmissionCore, subject, token}) => {
  const nameSubject = get(subject, 'name')

        return <IndexLayout>
          <Points lstSubmissionCore={lstSubmissionCore} nameSubject={nameSubject} token={token}/>
        </IndexLayout>
}


PointPage.getInitialProps = async (ctx) => {
const data = parseCookies(ctx.req);
    const token = data.token
  const {idSubject} = ctx.query
  const [lstSubmissionCore, subject] = await Promise.all([restClient.asyncGet(`/subject/${idSubject}/score`, token), restClient.asyncGet(`/subject/${idSubject}`, token)]);

  return {
    lstSubmissionCore: get(lstSubmissionCore, 'data'),
    subject: get(subject, 'data').subject,
    token
  }
}
export default PointPage
