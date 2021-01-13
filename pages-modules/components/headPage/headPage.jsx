import Head from 'next/head'

const HeadPage = ({ title }) => {
    return <Head>
        <title>{title.toUpperCase()}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
}

export default HeadPage