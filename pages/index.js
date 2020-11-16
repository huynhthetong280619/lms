import React from 'react'
import IndexContent from '../pages-modules/components/content'
import IndexLayout from '../pages-modules/layouts/layout'
import Banner from '../pages-modules/components/banner'

const IndexPage = ({object}) => {
  return (
    <IndexLayout>
      <Banner />
      <IndexContent />
    </IndexLayout>
  )
}

IndexPage.getInitialProps = () => {
  return {
    object
  }
}

export default IndexPage
