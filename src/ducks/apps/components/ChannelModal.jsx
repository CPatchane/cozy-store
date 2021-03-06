import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'cozy-ui/react/Modal'
import PropTypes from 'prop-types'

import AppInstallation from './AppInstallation'
import getChannel from 'lib/getChannelFromSource'

import { getAppBySlug } from 'ducks/apps'

export class ChannelModal extends Component {
  constructor(props) {
    super(props)
    const {
      app,
      channel,
      fetchApp,
      onCurrentChannel,
      onNotInstalled
    } = this.props

    if (getChannel(app.source) === channel) {
      onCurrentChannel()
    }

    if (!app.installed) {
      onNotInstalled()
    }

    this.state = {
      previousChannel: channel ? getChannel(app.source) : null,
      isCanceling: false
    }
    if (typeof fetchApp === 'function') fetchApp(channel)
  }

  async dismiss() {
    const { dismissAction, fetchApp } = this.props
    const { previousChannel } = this.state
    // fetch previous channel if channel switch canceled
    if (previousChannel && typeof fetchApp === 'function') {
      this.setState(() => ({ isCanceling: true }))
      await fetchApp(previousChannel)
      this.setState(() => ({ isCanceling: false }))
    }

    dismissAction()
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
    const { isCanceling } = this.state
    if (!app) return null
    return (
      <div className="sto-modal--install">
        <Modal dismissAction={dismissAction} mobileFullscreen>
          <AppInstallation
            appSlug={app.slug}
            isFetching={isAppFetching}
            channel={channel}
            isInstalling={isInstalling}
            isCanceling={isCanceling}
            onCancel={() => this.dismiss()}
            onSuccess={onSuccess}
          />
        </Modal>
      </div>
    )
  }
}

ChannelModal.propTypes = {
  app: PropTypes.object.isRequired,
  channel: PropTypes.string.isRequired,
  dismissAction: PropTypes.func.isRequired,
  onCurrentChannel: PropTypes.func.isRequired,
  onNotInstalled: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  app: getAppBySlug(state, ownProps.appSlug)
})

export default connect(mapStateToProps)(ChannelModal)
