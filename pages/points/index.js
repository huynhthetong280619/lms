import React from 'react'
import IndexLayout from '../../pages-modules/layouts/layout'
import {Row, Col, Table, Tag, Space} from 'antd'

import Points from '../../pages-modules/components/points';
import restClient from '../../assets/common/core/restClient'
import {get} from 'lodash'

const PointPage = ({lstSubmissionCore}) => {
        return <IndexLayout>
           <Points lstSubmissionCore={lstSubmissionCore}/>
        </IndexLayout>
}


PointPage.getInitialProps = async () => {
  const lstSubmissionCore = await restClient.asyncGet(`/subject/lthdt01/score`);

  return {
    lstSubmissionCore: get(lstSubmissionCore, 'data')
  }
}
export default PointPage
