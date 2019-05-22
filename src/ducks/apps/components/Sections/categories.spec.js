'use strict'

/* eslint-env jest */

import * as catUtils from './categories'

import { tMock } from 'jestLib/I18n'
import mockApps from 'ducks/apps/_mockApps'

describe('groupApps', () => {
  it('should return apps sorted in a dictionnary by categories', () => {
    expect(catUtils.groupApps(mockApps)).toMatchSnapshot()
  })
})

describe('sorter', () => {
  const prepareCategories = categoryNames =>
    categoryNames.map(cat =>
      catUtils.addLabel(
        {
          value: cat
        },
        tMock
      )
    )

  it('should return a categories list alphabetically except for all and others', () => {
    const catList = prepareCategories([
      'cozy',
      'all',
      'isp',
      'others',
      'telecom'
    ])
    expect(catList.sort(catUtils.sorter).map(x => x.value)).toMatchSnapshot()

    // test with all and others at the border
    const catList2 = prepareCategories(['all', 'cozy', 'telecom', 'others'])
    expect(catList2.sort(catUtils.sorter).map(x => x.value)).toMatchSnapshot()
  })
})

describe('generateOptionsFromApps', () => {
  const addLabel = x => catUtils.addLabel(x, tMock)
  it('should return a list of categories options for a select input based on the apps list', () => {
    expect(
      catUtils.generateOptionsFromApps(mockApps, false, addLabel)
    ).toMatchSnapshot()
  })

  it('should return include the all categories if includeAll option true', () => {
    expect(
      catUtils.generateOptionsFromApps(mockApps, true, addLabel)
    ).toMatchSnapshot()
  })

  it('should return an empty list if empty apps list provided', () => {
    expect(
      catUtils.generateOptionsFromApps([], false, addLabel)
    ).toMatchSnapshot()
  })

  it('should return an empty list if no apps provided', () => {
    expect(
      catUtils.generateOptionsFromApps(null, false, addLabel)
    ).toMatchSnapshot()
  })
})
