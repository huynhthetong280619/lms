import React from 'react'
import IndexContent from '../pages-modules/components/content'
import IndexLayout from '../pages-modules/layouts/layout'
import Banner from '../pages-modules/components/banner'

const IndexPage = ({}) => {
  return (
    <IndexLayout>
      <Banner />
      <IndexContent />
    </IndexLayout>
  )
}

IndexPage.getInitialProps = async (ctx) => {
  console.log('ctx', ctx);
  return {}
}

export default IndexPage
