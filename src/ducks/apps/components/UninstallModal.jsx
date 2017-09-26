/* global cozy */

import React, { Component } from 'react'
import { withRouter } from 'react-router'

import { translate } from 'cozy-ui/react/I18n'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'

import ReactMarkdownWrapper from '../../components/ReactMarkdownWrapper'

export class UninstallModal extends Component {
  constructor (props) {
    super(props)

    this.gotoParent = this.gotoParent.bind(this)
    this.uninstallApp = this.uninstallApp.bind(this)
  }

  uninstallApp () {
    this.setState({ error: null })
    const { app, history } = this.props
    this.props.uninstallApp(app.slug)
    .then(() => {
      history.push('/myapps')
    })
    .catch()
  }

  gotoParent () {
    const { history, match } = this.props
    let url = match.url
    history.push(url.substring(0, url.lastIndexOf('/')))
  }

  render () {
    const { t, app, error, history } = this.props
    // if app not found, return to my apps
    if (!app) {
      history.push('/myapps')
      return null
    }
    return (
      <div className='sto-modal--uninstall'>
        <Modal
          title={t('app_modal.uninstall.title')}
          secondaryAction={this.gotoParent}
        >
          <ModalContent>
            <div className='sto-modal-content'>
              <ReactMarkdownWrapper
                source={
                  app.uninstallable
                    ? t('app_modal.uninstall.description', { cozyName: cozy.client._url.replace(/^\/\//, '') })
                    : t('app_modal.uninstall.uninstallable_description')
                }
              />
              {error &&
                <p class='coz-error'>{t('app_modal.uninstall.message.error', {message: error.message})}</p>
              }
              <div className='sto-modal-controls'>
                <button
                  role='button'
                  className='coz-btn coz-btn--secondary'
                  onClick={this.gotoParent}
                >
                  {t('app_modal.uninstall.cancel')}
                </button>
                <button
                  role='button'
                  disabled={!app.uninstallable}
                  className='coz-btn coz-btn--danger coz-btn--delete'
                  onClick={this.uninstallApp}
                >
                  {t('app_modal.uninstall.uninstall')}
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
