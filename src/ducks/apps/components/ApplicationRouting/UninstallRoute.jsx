import React from 'react'
import { Route } from 'react-router-dom'

import UninstallModal from '../UninstallModal'

export const UninstallRoute = ({
  actionError,
  getApp,
  isFetching,
  isUninstalling,
  parent,
  uninstallApp
}) => (
  <Route
    path={`/${parent}/:appSlug/uninstall`}
    render={({ match }) => {
      if (isFetching) return
      const app = getApp(match)
      return (
        <UninstallModal
          uninstallApp={uninstallApp}
          isUninstalling={isUninstalling}
          parent={`/${parent}`}
          uninstallError={actionError}
          app={app}
        />
      )
    }}
  />
)

export default UninstallRoute
