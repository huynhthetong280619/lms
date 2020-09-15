import React from 'react'
import IndexLayout from '../pages-modules/layouts/layout'

const IndexPage = ({ props }) => {
  return (
    <IndexLayout>{ props.location }</IndexLayout>
  )
}


IndexPage.getInitialProps = () => {
  return {
    props: {
      name: 'antd',
      age: 7,
      location: 'NY CITY'
    }
  }
}
export default IndexPage
