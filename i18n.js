import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './public/lang/en.json';
import vi from './public/lang/vi.json';
// the translations
// (tip move them in a JSON file and import them)


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translations: en
      },
      vi: {
        translations: vi
      },
    },
      fallbackLng: 'vi',

      // have a common namespace used around the full app
      ns: ['translations'],
      defaultNS: 'translations',
  
      keySeparator: false, // we use content as keys
  

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;