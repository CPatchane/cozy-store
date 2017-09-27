import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import { Link, Route } from 'react-router-dom'
import Spinner from 'cozy-ui/react/Spinner'
import Icon from 'cozy-ui/react/Icon'

import SmallAppItem from '../../components/SmallAppItem'
import UninstallModal from './UninstallModal'

import defaultAppIcon from '../../../assets/icons/icon-cube.svg'

export class MyApplications extends Component {
  constructor (props) {
    super(props)
    props.fetchInstalledApps()
  }

  onAppClick (appSlug) {
    this.props.history.push(`/myapps/${appSlug}`)
  }

  render () {
    const { t, installedApps, isFetching, fetchError } = this.props
    console.log(this.props)
    return (
      <div>
        {this.props.match.isExact &&
          <div className='sto-myapps'>
            <h2 className='sto-myapps-title'>{t('myapps.title')}</h2>
            <div className='sto-myapps-list'>
              {!isFetching && installedApps && !!installedApps.length &&
                installedApps.map(app => {
                  return <SmallAppItem
                    slug={app.slug}
                    developer={app.developer}
                    editor={app.editor}
                    icon={app.icon}
                    name={app.name}
                    version={app.version}
                    installed={app.installed}
                    onClick={() => this.onAppClick(app.slug)}
                    key={app.slug}
                  />
                })
              }
              {fetchError &&
                <p className='coz-error'>{fetchError.message}</p>
              }
            </div>
            {isFetching &&
              <Spinner
                size='xxlarge'
                loadingType='appsFetching'
                middle='true'
              />
            }
          </div>
        }
        <Route path='/myapps/:appSlug' render={({ match }) => {
          if (isFetching) return
          if (installedApps.length && match.params) {
            const app = installedApps.find(app => app.slug === match.params.appSlug)
            return <Application t={t} app={app} openApp={this.openApp} />
          }
        }} />
        <Route path='/myapps/:appSlug/manage' render={({ match }) => {
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
        to={`/myapps/${slug}/manage`}
        className='coz-btn coz-btn--danger-outline'
      >
        {t('app.uninstall')}
      </Link>
    </div>
  </div>
)

export default translate()(MyApplications)
