import '../styles/antd.css'
import i18n from '../i18n';
import { I18nextProvider } from "react-i18next";

function MyApp({ Component, pageProps }) {
  const [isLoadingGlobal, setIsLoadingGlobal] = React.useState(false)

  return (
    <I18nextProvider i18n={i18n}>
      <Component {...pageProps} isLoadingGlobal={isLoadingGlobal} setIsLoadingGlobal={setIsLoadingGlobal} />
    </I18nextProvider>
  )
}

export default MyApp
