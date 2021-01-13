import React from 'react'
import IndexContent from '../pages-modules/components/content'
import IndexLayout from '../pages-modules/layouts/layout'
import Banner from '../pages-modules/components/banner'
import { parseCookies } from '../assets/helpers'
import Head from 'next/head'
import { withTranslation } from 'react-i18next';

const IndexPage = ({ t }) => {
  return (
    <IndexLayout>
      <Head>
        <title>{t('univers_nm').toUpperCase()}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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

export default withTranslation('translations')(IndexPage)
