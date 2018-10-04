/* global cozy */

import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import Alerter from 'cozy-ui/react/Alerter'

import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

export class UninstallModal extends Component {
  constructor(props) {
    super(props)

    this.gotoParent = this.gotoParent.bind(this)
    this.uninstallApp = this.uninstallApp.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { app } = nextProps
    if (!app) {
      return this.gotoParent()
    }
    if (this.props.isUninstalling && !nextProps.isUninstalling) {
      const { parent, t, history } = this.props
      Alerter.success(t('app_modal.uninstall.message.success'), {
        duration: 3000
      })
      return history.replace(`/${parent}/${app.slug}`)
    } else if (!app.installed || !app.uninstallable) {
      return this.gotoParent()
    }
  }

  uninstallApp() {
    this.setState({ error: null })
    const { app } = this.props
    this.props.uninstallApp(app.slug, app.type)
  }

  gotoParent() {
    const { app, parent, history } = this.props
    if (app && app.slug) {
      history.push(`${parent}/${app.slug}`)
    } else {
      history.push(parent)
    }
  }

  render() {
    const { t, app, uninstallError, isUninstalling } = this.props
    // if app not found, return to parent
    if (!app || !app.installed || !app.uninstallable) {
      return null
    }
    return (
      <div className="sto-modal--uninstall">
        <Modal
          title={t('app_modal.uninstall.title')}
          dismissAction={this.gotoParent}
          mobileFullscreen
        >
          <ModalContent>
            <div className="sto-modal-content">
              <ReactMarkdownWrapper
                source={t('app_modal.uninstall.description', {
                  cozyName: cozy.client._url.replace(/^\/\//, '')
                })}
              />
              {uninstallError && (
                <p className="u-error">
                  {t('app_modal.uninstall.message.error', {
                    message: uninstallError.message
                  })}
                </p>
              )}
              <div className="sto-modal-controls">
                <button
                  role="button"
                  className="c-btn c-btn--secondary"
                  onClick={this.gotoParent}
                >
                  <span>{t('app_modal.uninstall.cancel')}</span>
                </button>
                <button
                  role="button"
                  className="c-btn c-btn--danger c-btn--delete"
                  onClick={this.uninstallApp}
                  disabled={isUninstalling}
                  aria-busy={isUninstalling}
                >
                  <span>{t('app_modal.uninstall.uninstall')}</span>
                </button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>
    )
  }
}

export default translate()(withRouter(UninstallModal))
