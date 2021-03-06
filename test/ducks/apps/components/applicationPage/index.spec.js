'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { extend as extendI18n } from 'cozy-ui/react/I18n'
import { tMock } from '../../../../jestLib/I18n'
import { ApplicationPage } from 'ducks/apps/components/ApplicationPage'

import mockApp from '../../_mockPhotosRegistryVersion'
import mockKonnector from '../../_mockPKonnectorTrinlaneRegistryVersion'

const appManifest = mockApp.manifest
const konnectorManifest = mockKonnector.manifest
const mockError = new Error('This is a test error')

const getAppProps = (installed, related) => {
  // set app locales from manifest
  extendI18n({ apps: { [appManifest.slug]: appManifest.locales.en } })
  return {
    lang: 'en',
    app: Object.assign({}, appManifest, {
      installed,
      icon: 'https://mockcozy.cc/registry/photos/icon',
      related
    }),
    parent: '/myapps'
  }
}

const getKonnectorProps = installed => {
  // set app locales from manifest
  extendI18n({
    apps: { [konnectorManifest.slug]: konnectorManifest.locales.en }
  })
  return {
    lang: 'en',
    app: Object.assign({}, konnectorManifest, {
      installed,
      icon: 'https://mockcozy.cc/registry/konnector-trinlane/icon'
    }),
    parent: '/myapps'
  }
}

describe('ApplicationPage component', () => {
  it('should be rendered correctly with provided installed app', () => {
    const props = getAppProps(true, 'https://photos.mockcozy.cc')
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with provided installed konnector', () => {
    const props = getKonnectorProps(true)
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with app infos from registry (not installed)', () => {
    const props = getAppProps(false, null)
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with konnector infos from registry (not installed)', () => {
    const props = getKonnectorProps(false)
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with app with screenshots', () => {
    const props = getAppProps(false)
    props.app.screenshots = ['<svg></svg>']
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly without app descriptions', () => {
    const props = getKonnectorProps(false)
    if (props.app.short_description) delete props.app.short_description
    if (props.app.long_description) delete props.app.long_description
    const component = shallow(
      <ApplicationPage t={tMock} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render correctly on mobile with the scroll feature', () => {
    const props = getAppProps(false, null)
    props.breakpoints = {
      isMobile: true
    }
    const wrapper = shallow(<ApplicationPage t={tMock} {...props} />)
    expect(wrapper.getElement()).toMatchSnapshot()
    // should not throw error at initial state
    expect(wrapper.state('displayBarIcon')).toBe(false)
    wrapper.instance().handleScroll()
    expect(wrapper.state('displayBarIcon')).toBe(false)
    // simulate scroll
    window.scrollY = 150
    wrapper.instance().handleScroll()
    expect(wrapper.state('displayBarIcon')).toBe(true)
    expect(wrapper.getElement()).toMatchSnapshot()
    window.scrollY = 20
    wrapper.instance().handleScroll()
    expect(wrapper.state('displayBarIcon')).toBe(false)
  })

  it('should render correctly a spinner if isFetching', () => {
    const props = getAppProps(false, null)
    const component = shallow(
      <ApplicationPage t={tMock} isFetching {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render correctly an error message if fetchError', () => {
    const props = getAppProps(false, null)
    const component = shallow(
      <ApplicationPage t={tMock} fetchError={mockError} {...props} />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
