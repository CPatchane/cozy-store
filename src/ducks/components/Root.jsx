import React from 'react'
import { Provider } from 'react-redux'
import { I18n } from 'cozy-ui/react/I18n'
import PiwikHashRouter from '../../lib/PiwikHashRouter'

import App from './App'

const Root = ({ lang, store }) => {
  return (
    <I18n lang={lang} dictRequire={lang => require(`../../locales/${lang}`)}>
      <Provider store={store}>
        <PiwikHashRouter>
          <App />
        </PiwikHashRouter>
      </Provider>
    </I18n>
  )
}

export default Root
