import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'cozy-ui/react/Modal'

import AppInstallation from './AppInstallation'

export class InstallModal extends Component {
  constructor(props) {
    super(props)
    const { app, onAlreadyInstalled } = this.props

    if (app.installed) {
      onAlreadyInstalled()
    }
  }

  render() {
    const {
      app,
      dismissAction,
      isInstalling,
      onSuccess,
      channel,
      isAppFetching
    } = this.props
    if (!app) return null
    return (
      <div className="sto-modal--install">
        <Modal dismissAction={dismissAction} mobileFullscreen>
          <AppInstallation
            appSlug={app.slug}
            isFetching={isAppFetching}
            channel={channel}
            isInstalling={isInstalling}
            onCancel={dismissAction}
            onSuccess={onSuccess}
          />
        </Modal>
      </div>
    )
  }
}

InstallModal.propTypes = {
  app: PropTypes.object.isRequired,
  dismissAction: PropTypes.func.isRequired,
  onAlreadyInstalled: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

export default InstallModal
