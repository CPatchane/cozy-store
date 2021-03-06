'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import Button from 'cozy-ui/react/Button'
import { Link } from 'react-router-dom'

import { tMock } from '../../../../jestLib/I18n'
import { Header } from 'ducks/apps/components/ApplicationPage/Header'

import mockApp from '../../_mockPhotosRegistryVersion'
import mockKonnector from '../../_mockPKonnectorTrinlaneRegistryVersion'

window.location.assign = jest.fn()

describe('ApplicationPage header component', () => {
  beforeEach(() => {
    window.location.assign.mockReset()
  })

  it('should be rendered correctly provided app', () => {
    const component = shallow(
      <Header
        t={tMock}
        parent="/myapps"
        namePrefix="Cozy"
        name={mockApp.name}
        description={mockApp.description}
        app={mockApp}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly provided konnector', () => {
    const component = shallow(
      <Header
        t={tMock}
        parent="/myapps"
        app={mockKonnector}
        name={mockKonnector.name}
        description={mockKonnector.description}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly provided app with broken icon and no editor', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.icon = ''
    appProps.editor = ''
    const component = shallow(
      <Header
        t={tMock}
        parent="/myapps"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })

  it('should handle the click on open installed app button', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.installed = true
    appProps.icon = '<svg></svg>'
    appProps.related = '#'
    const wrapper = shallow(
      <Header
        t={tMock}
        parent="/myapps"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
      />
    )
    wrapper.find(Button).simulate('click')
    expect(window.location.assign.mock.calls.length).toBe(1)
    expect(window.location.assign.mock.calls[0][0]).toBe('#')
  })

  it('should disable the install button if maintenance', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.maintenance = {}
    const wrapper = shallow(
      <Header
        t={tMock}
        parent="/discover"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
      />
    )
    const mockEvent = {
      preventDefault: jest.fn()
    }
    wrapper.find(Link).simulate('click', mockEvent)
    expect(mockEvent.preventDefault.mock.calls.length).toBe(1)
    expect(wrapper.getElement()).toMatchSnapshot()
  })

  it('should disable the uninstall button for installed app if not uninstallable', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.installed = true
    appProps.icon = '<svg></svg>'
    appProps.uninstallable = false
    const wrapper = shallow(
      <Header
        t={tMock}
        parent="/discover"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
      />
    )
    const mockEvent = {
      preventDefault: jest.fn()
    }
    wrapper.find(Link).simulate('click', mockEvent)
    expect(mockEvent.preventDefault.mock.calls.length).toBe(1)
    expect(wrapper.getElement()).toMatchSnapshot()
  })

  it('should display a placeholder if app icon is still fetching', () => {
    const appProps = Object.assign({}, mockApp.manifest)
    appProps.iconToLoad = true
    const component = shallow(
      <Header
        t={tMock}
        parent="/discover"
        app={appProps}
        name={appProps.name}
        description={appProps.description}
      />
    ).getElement()
    expect(component).toMatchSnapshot()
  })
})
