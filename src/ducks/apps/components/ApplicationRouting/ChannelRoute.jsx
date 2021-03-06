import React from 'react'
import { Route } from 'react-router-dom'

import ChannelModal from '../ChannelModal'
import { REGISTRY_CHANNELS } from 'ducks/apps'

export const ChannelRoute = ({
  actionError,
  fetchError,
  fetchLatestApp,
  getApp,
  isAppFetching,
  isFetching,
  isInstalling,
  parent,
  redirectTo
}) => (
  <Route
    path={`/${parent}/:appSlug/channel/:channel`}
    render={({ match }) => {
      if (isFetching) return
      const app = getApp(match)
      const appPath = `/${parent}/${(app && app.slug) || ''}`
      if (!app || !app.isInRegistry) return redirectTo(`/${parent}`)
      const channel = match.params.channel
      const isChannelAvailable = Object.values(REGISTRY_CHANNELS).includes(
        channel
      )
      if (!isChannelAvailable) {
        return redirectTo(appPath)
      }
      const fetchApp = chan => fetchLatestApp(app.slug, chan)
      return (
        <ChannelModal
          appSlug={app.slug}
          channel={channel}
          dismissAction={() => redirectTo(appPath)}
          fetchApp={fetchApp}
          fetchError={fetchError}
          installError={actionError}
          isAppFetching={isAppFetching}
          isInstalling={isInstalling}
          onCurrentChannel={() => redirectTo(appPath)}
          onNotInstalled={() => redirectTo(appPath)}
          onSuccess={() => redirectTo(appPath)}
        />
      )
    }}
  />
)

export default ChannelRoute
