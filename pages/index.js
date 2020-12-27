import React from 'react'
import IndexContent from '../pages-modules/components/content'
import IndexLayout from '../pages-modules/layouts/layout'
import Banner from '../pages-modules/components/banner'
import { parseCookies } from '../assets/helpers'

const IndexPage = ({ }) => {
  return (
    <IndexLayout>
      <Banner />
      <IndexContent />
    </IndexLayout>
  )
}

IndexPage.getInitialProps = async (ctx) => {
  const data = parseCookies(ctx.req)
  console.log('IndexPage', data)
  if (Object.keys(data).indexOf('token') > 0 && data.constructor === Object) {
    ctx.res.writeHead(301, { Location: "/courses" })
    ctx.res.end()
}
  return {}
}

export default IndexPage
