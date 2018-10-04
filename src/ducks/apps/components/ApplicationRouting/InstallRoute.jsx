import React from 'react'
import { Route } from 'react-router-dom'

import InstallModal from '../InstallModal'

export const InstallRoute = ({
  actionError,
  getApp,
  installApp,
  isFetching,
  isInstalling,
  parent
}) => (
  <Route
    path={`/${parent}/:appSlug/install`}
    render={({ match }) => {
      if (isFetching) return
      const app = getApp(match)
      return (
        <InstallModal
          installApp={installApp}
          parent={`/${parent}`}
          installError={actionError}
          app={app}
          isInstalling={isInstalling}
        />
      )
    }}
  />
)

export default InstallRoute
