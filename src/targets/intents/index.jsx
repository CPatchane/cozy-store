import 'styles'

import { Provider } from 'react-redux'
import React from 'react'
import { render } from 'react-dom'
import store from 'lib/store'

import CozyClient, { CozyProvider } from 'cozy-client'
import I18n from 'cozy-ui/react/I18n'
import IntentHandler from '../../ducks/components/intents/IntentHandler'
import InstallAppIntent from '../../ducks/components/intents/InstallAppIntent'
import schema from 'lib/schema'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const appData = root.dataset

  const protocol = window.location.protocol
  const client = new CozyClient({
    uri: `${protocol}//${appData.cozyDomain}`,
    schema,
    token: appData.cozyToken
  })

  render(
    <I18n
      lang={appData.cozyLocale}
      dictRequire={lang => require(`../../locales/${lang}`)}
    >
      <CozyProvider store={store} client={client}>
        <Provider store={store}>
          <IntentHandler appData={appData}>
            <InstallAppIntent action="INSTALL" type="io.cozy.apps" />
          </IntentHandler>
        </Provider>
      </CozyProvider>
    </I18n>,
    document.querySelector('[role=application]')
  )
})
