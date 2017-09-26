import { connect } from 'react-redux'

import { fetchApps, fetchInstalledApps, uninstallApp, getInstalledApps, getRegistryApps, installAppFromRegistry, installApp } from './index'

import ApplicationComponent from './components/Application'
import DiscoverComponent from './components/Discover'
import HiddenInstallerViewComponent from './components/HiddenInstallerView'
import MyApplicationsComponent from './components/MyApplications'

const mapStateToProps = (state, ownProps) => ({
  apps: getRegistryApps(state),
  installedApps: getInstalledApps(state),
  isFetching: state.apps.isFetching,
  isInstalling: state.apps.isInstalling,
  actionError: state.apps.actionError,
  fetchError: state.apps.fetchError
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchApps: () => dispatch(fetchApps()),
  fetchInstalledApps: () => dispatch(fetchInstalledApps()),
  installApp: (appSlug, channel) => dispatch(installAppFromRegistry(appSlug, channel)),
  uninstallApp: (appSlug) => dispatch(uninstallApp(appSlug)),
  // for the hidden installer only
  installUsingInstaller: (appSlug, source, isUpdate) =>
    dispatch(installApp(appSlug, source, isUpdate))
    .catch(() => {
      dispatch({
        type: 'SEND_LOG_FAILURE',
        alert: {
          message: `HiddenInstallerView.${isUpdate ? 'update' : 'install'}_error`,
          messageData: {slug: appSlug},
          level: 'error'
        }
      })
    })
})

export const Application = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationComponent)

export const Discover = connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverComponent)

export const HiddenInstallerView = connect(
  mapStateToProps,
  mapDispatchToProps
)(HiddenInstallerViewComponent)

export const MyApplications = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyApplicationsComponent)
