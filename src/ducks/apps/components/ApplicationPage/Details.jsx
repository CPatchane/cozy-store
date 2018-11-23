import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { translate } from 'cozy-ui/transpiled/react/I18n'

import { Button } from 'cozy-ui/transpiled/react/Button'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Toggle from 'cozy-ui/transpiled/react/Toggle'

import Maintenance from './Maintenance'

import ReactMarkdownWrapper from 'ducks/components/ReactMarkdownWrapper'
import { getContext, REGISTRY_CHANNELS } from 'ducks/apps'
import getChannel from 'lib/getChannelFromSource'
import { isUnderMaintenance } from 'ducks/apps/appStatus'

const isValidUrl = url => {
  if (!url) return null
  return url.match(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
  )
}

export class Details extends Component {
  constructor(props) {
    super(props)
    const { app } = this.props
    const appChannel = getChannel(app.source)
    this.state = {
      displayBetaChannel: appChannel === REGISTRY_CHANNELS.BETA,
      displayDevChannel: appChannel === REGISTRY_CHANNELS.DEV
    }

    this.toggleChannels = this.toggleChannels.bind(this)
    this.onUpdateChannel = this.onUpdateChannel.bind(this)
  }

  onShowPermissions() {
    const { app, parent } = this.props
    this.props.history.push(`/${parent}/${app.slug}/permissions`)
  }

  toggleChannels() {
    const { app } = this.props
    if (!getChannel(app.source))
      console.warn("This application don't use the registry")
    if (!this.state.displayBetaChannel) {
      this.setState(() => ({ displayBetaChannel: true }))
    }
    if (!this.state.displayDevChannel) {
      getContext().then(context => {
        if (context && context.attributes && context.attributes.debug) {
          this.setState(() => ({ displayDevChannel: true }))
        }
      })
    }
  }

  onUpdateChannel(checked, channel) {
    const { app, history, parent } = this.props
    const targetChannel = checked ? channel : REGISTRY_CHANNELS.STABLE
    history.push(`/${parent}/${app.slug}/channel/${targetChannel}`)
  }

  render() {
    const { t, app, description, changes, mobileApps } = this.props
    const { displayBetaChannel, displayDevChannel } = this.state
    const { source, slug, langs, categories, developer, version } = app
    const appChannel = getChannel(source)
    const isBeta = appChannel === REGISTRY_CHANNELS.BETA
    const isDev = appChannel === REGISTRY_CHANNELS.DEV
    const langsInfos = langs && langs.map(l => t(`app_langs.${l}`))
    const categoriesInfos =
      categories &&
      !!categories.length &&
      categories.map(c => t(`app_categories.${c}`))
    const developerName = developer && developer.name
    const shortVersion = version && version.match(/^(\d+\.\d+\.\d+)-.*$/)
    const displayedVersion =
      (shortVersion && shortVersion.length && shortVersion[1]) || version
    return (
      <div className="sto-app-details">
        <div className="sto-app-descriptions">
          {isUnderMaintenance(app) && <Maintenance slug={slug} />}
          {description && (
            <div className="sto-app-description">
              <h3 className="u-title-h3">{t('app_page.description')}</h3>
              <ReactMarkdownWrapper source={description} parseEmoji />
            </div>
          )}
          {changes && (
            <div className="sto-app-changes">
              <h3 className="u-title-h3">{t('app_page.changes')}</h3>
              <ReactMarkdownWrapper source={changes} parseEmoji />
            </div>
          )}
        </div>
        <div className="sto-app-additional-details">
          <h3 className="u-title-h3">{t('app_page.infos.title')}</h3>
          <div className="sto-app-info">
            <div className="sto-app-info-header">
              {t('app_page.infos.categories')}
            </div>
            <div className="sto-app-info-content">
              {categoriesInfos &&
                categoriesInfos.join(t('app_categories.list_separator'))}
            </div>
          </div>
          <div className="sto-app-info">
            <div className="sto-app-info-header">
              {t('app_page.infos.version.title')}
            </div>
            <div className="sto-app-info-content">
              <span onDoubleClick={this.toggleChannels}>
                {displayedVersion || t('app_page.infos.version.unknown')}
              </span>
            </div>
          </div>
          {(displayBetaChannel || displayDevChannel) && (
            <div className="sto-app-info">
              <div className="sto-app-info-header">
                {t('app_page.infos.beta')}
              </div>
              <div className="sto-app-info-content">
                <Toggle
                  id={`sto-app-${slug}-beta-toggle`}
                  checked={isBeta}
                  onToggle={e =>
                    this.onUpdateChannel(e, REGISTRY_CHANNELS.BETA)
                  }
                />
              </div>
            </div>
          )}
          {displayDevChannel && (
            <div className="sto-app-info">
              <div className="sto-app-info-header">
                {t('app_page.infos.dev')}
              </div>
              <div className="sto-app-info-content">
                <Toggle
                  id={`sto-app-${slug}-dev-toggle`}
                  checked={isDev}
                  onToggle={e => this.onUpdateChannel(e, REGISTRY_CHANNELS.DEV)}
                />
              </div>
            </div>
          )}
          {langsInfos && (
            <div className="sto-app-info">
              <div className="sto-app-info-header">
                {t('app_page.infos.langs')}
              </div>
              <div className="sto-app-info-content">
                {langsInfos.join(t('app_langs.list_separator'))}
              </div>
            </div>
          )}
          {mobileApps &&
            !!mobileApps.length && (
              <div className="sto-app-info">
                <div className="sto-app-info-header">
                  {t('app_page.infos.mobile_app')}
                </div>
                <div className="sto-app-info-content sto-app-info-content--mobile-apps">
                  {mobileApps.map(a => {
                    const icon = require(`assets/icons/platforms/icon-${
                      a.type
                    }.svg`)
                    return (
                      <a
                        className="sto-app-info-content-icon"
                        href={isValidUrl(a.url) ? a.url : null}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={a.type}
                      >
                        <Icon icon={icon.default} width="24px" height="24px" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          <div>
            <Button
              label={t('app_page.permissions.button.label')}
              className="sto-app-permissions-button"
              onClick={() => this.onShowPermissions()}
              subtle
            />
          </div>
          {developerName && (
            <div>
              <h3 className="u-title-h3">{t('app_page.developer_infos')}</h3>
              <div className="sto-app-developer-infos">
                <span>{developerName}</span>
                {isValidUrl(developer.url) && (
                  <a
                    href={developer.url}
                    className="sto-app-developer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {developer.url}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(translate()(Details))
