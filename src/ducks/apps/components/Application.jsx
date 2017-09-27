import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'

import { translate } from 'cozy-ui/react/I18n'
import Icon from 'cozy-ui/react/Icon'
import Spinner from 'cozy-ui/react/Spinner'

import UninstallModal from './UninstallModal'

import defaultAppIcon from '../../../assets/icons/icon-cube.svg'

export class ApplicationComponent extends Component {
  constructor (props) {
    super(props)
    props.fetchInstalledApps()
  }

  openApp (related) {
    window.location.href = related
  }

  render () {
    const { t, installedApps, isFetching, fetchError } = this.props
    return (
      <div>
        {
          isFetching
          ? <Spinner
            size='xxlarge'
            loadingType='appsFetching'
            middle='true'
          />
          : fetchError
            ? <p className='coz-error'>{fetchError.message}</p>
            : null
        }
        <Route path='/application/:appSlug' render={({ match }) => {
          if (isFetching) return
          if (installedApps.length && match.params) {
            const app = installedApps.find(app => app.slug === match.params.appSlug)
            return <Application t={t} app={app} openApp={this.openApp} />
          }
        }} />
        <Route path='/application/:appSlug/manage' render={({ match }) => {
          if (isFetching) return
          if (installedApps.length && match.params) {
            const app = installedApps.find(app => app.slug === match.params.appSlug)
            return <UninstallModal uninstallApp={this.props.uninstallApp} parent='/myapps' error={this.props.actionError} app={app} match={match} />
          }
        }} />
      </div>
    )
  }
}

const Application = ({t, app: { description, icon, installed, name, related, slug }, openApp}) => (
  <div className='sto-app'>
    <div className='sto-app__icon'>
      {
        icon
        ? <img src={icon} alt={`${slug}-icon`} width='170' />
        : <svg className='sto-small-app-item-icon--default blurry' width='170' style='padding: 0 8px'>
          <use xlinkHref={`#${defaultAppIcon.id}`} />
        </svg>
      }
    </div>
    <div className='sto-app__content'>
      <h2>{name}</h2>
      <p>{description}</p>
      <button
        role='button'
        onClick={() => openApp(related)}
        className='coz-btn coz-btn--regular'
      >
        <Icon
          icon='openwith'
          width='10px'
          height='10px'
        /> {t('app.open')}
      </button>
      <Link
        to={`/application/${slug}/manage`}
        className='coz-btn coz-btn--danger-outline'
      >
        {t('app.uninstall')}
      </Link>
    </div>
  </div>
)

export default translate()(ApplicationComponent)
