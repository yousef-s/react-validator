import React from 'react'
import { shallow } from 'enzyme'
import Validator, { getValidationState, Snapshot } from '../Validator'

describe('Snapshot Constructor: Snapshot(valid, message, modified)', () => {
  it('should create an instance of Snapshot with the following properties `valid`, `message`, `modified` and `hasError` set according to arguments', () => {
    const newInstance = new Snapshot(true, 'Hello world!', false)
    expect(newInstance.valid).toBe(true)
    expect(newInstance.message).toBe('Hello world!', false)
    expect(newInstance.modified).toBe(false)
    expect(newInstance.hasError).not.toBeUndefined()
  })

  it('should create an instance of Snapshot with the `message` property set to null when the `message` argument is undefined', () => {
    const newInstance = new Snapshot(true, undefined, false)
    expect(newInstance.message).toBe(null)
  })

  it('Snapshot.hasError() should return true when `valid` is false and `modified` is true', () => {
    const newInstance = new Snapshot(false, undefined, true)
    expect(newInstance.hasError()).toBeTruthy()
  })

  it('Snapshot.hasError() should return false when `valid` is true', () => {
    const newInstanceNotModified = new Snapshot(true, undefined, false)
    const newInstanceModified = new Snapshot(true, undefined, true)

    expect(newInstanceModified.hasError()).toBeFalsy()
    expect(newInstanceNotModified.hasError()).toBeFalsy()
  })
})

describe('getValidationState(state, rules, oldState)', () => {
  it('should call console.error with appropriate message when `rules` has a key that `state` doesnt have', () => {
    const spy = jest.spyOn(console, 'error')
      .mockImplementation(() => false) // Surpress outputting to console during test

    const testState = {
      parentKeyA: 'value'
    }

    const testRules = {
      parentKeyA: () => true,
      parentKeyB: () => true,
    }

    getValidationState(testState, testRules, testState)

    const expectedConsoleMessage = 'Validator Error: key provided in rules (parentKeyB) doesn\'t exist in state.'

    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][0]).toBe(expectedConsoleMessage)

    spy.mockRestore()
  })

  it('should call console.error with appropriate message when `rules` has a key that is neither an object or function', () => {
    const spy = jest.spyOn(console, 'error')
      .mockImplementation(() => false) // Surpress outputting to console during test

    const testState = {
      parentKeyA: 'value'
    }

    const testRules = {
      parentKeyA: ''
    }

    getValidationState(testState, testRules, testState, testState)

    const expectedConsoleMessage = 'Validator Error: rule provided for parentKeyA is invalid. Please see documentation.'

    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][0]).toBe(expectedConsoleMessage)

    spy.mockRestore()
  })

  it('should call console.error with appropriate message when structure of `state` includes a key which isn\'t included in `oldState`', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => false)
    
    const testState = {
      parentKey: ''
    }

    const testRules = {
      parentKey: () => true
    }

    const testOldState = {
      parentKeyOld: ''
    }

    const expectedConsoleMessage = 'Validator Error: current state includes a key (parentKey) that initial state didn\'t include.'
    getValidationState(testState, testRules, testOldState)

    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][0]).toBe(expectedConsoleMessage)

    spy.mockRestore()
  })

  it('should return an object with an `all` key and a `snapshots` key', () => {
    const testState = {
      parentKey: 1
    }

    const testRules = {
      parentKey: v => v === 1
    }

    const validationState = getValidationState(testState, testRules, testState, testState)
    expect(validationState.all).not.toBeUndefined()
    expect(validationState.snapshots).not.toBeUndefined()
  })

  it('should return for each key in `rules` a valid Snapshot instance', () => {
    const testState = {
      parentKeyA: true
    }

    const testRules = {
      parentKeyA: () => true
    }

    const actualSnapshot = getValidationState(testState, testRules, testState, testState).snapshots

    expect(actualSnapshot.parentKeyA instanceof Snapshot).toBeTruthy()
  })

  it('should return `all` as false on the returned object if any of the predicates return false', () => {
    const testState = {
      parentKeyA: '',
      parentKeyB: ''
    }

    const testRules = {
      parentKeyA: () => false,
      parentKeyB: () => true
    }

    const actualAll = getValidationState(testState, testRules, testState, testState).all
    
    expect(actualAll).toBe(false)
  })

  it('should return `all` as true on the returned object if all of the predicates return true', () => {
    const testState = {
      parentKeyA: ''
    }

    const testRules = {
      parentKeyA: () => true
    }

    const actualAll = getValidationState(testState, testRules, testState, testState).all
    expect(actualAll).toBe(true)
  })

  it('should support operating on nested objects for `state` and `rules`', () => {
    const testState = {
      parentKeyA: {
        childKeyA: {
          gcKeyA: 1,
          gcKeyB: 1
        }
      },
      parentKeyB: {
        childKeyA: 'hello world!',
        childKeyB: 'foo bar'
      }
    }

    const testRules = {
      parentKeyA: {
        childKeyA: {
          gcKeyA: {
            predicate: () => true,
            message: 'Hello world!'
          },
          gcKeyB: () => true
        }
      },
      parentKeyB: value => value.childKeyA === value.childKeyB
    }

    const expectedValidationState = {
      all: false,
      snapshots: {
        parentKeyA: {
          childKeyA: {
            gcKeyA: { valid: true, message: 'Hello world!', modified: false },
            gcKeyB: { valid: true, message: null, modified: false }
          }
        },
        parentKeyB: {
          valid: false,
          message: null,
          modified: false
        }
      }
    }

    const actualValidationState = getValidationState(testState, testRules, testState, testState)

    expect(actualValidationState).toEqual(expectedValidationState)
  })

  it('should return a Snapshot instance with `modified` false, if relevant key in `state` and `oldState` are equal', () => {
    const testOldState = {
      parentKey: ''
    }

    const testState = {
      parentKey: ''
    }

    const testRules = {
      parentKey: () => true
    }

    const validationState = getValidationState(testState, testRules, testOldState)
    expect(validationState.snapshots.parentKey.modified).toBe(false)
  })

  it('should return a Snapshot instance with `modified` as true, if key in `state` and `oldState` are not equal', () => {
    const testOldState = {
      parentKey: ''
    }

    const testState = {
      parentKey: 'Hello World!'
    }

    const testRules = {
      parentKey: () => true
    }

    const validationState = getValidationState(testState, testRules, testOldState)
    expect(validationState.snapshots.parentKey.modified).toBe(true)
  })

  it('should call the predicate on a `rules` key on the same key in `state` with the value of `state[key]`', () => {
    const testState = {
      parentKeyA: 'A',
      parentKeyB: 'B'
    }

    const mockValidatorParentA = jest.fn()
    const mockValidatorParentB = jest.fn()

    const testRules = {
      parentKeyA: mockValidatorParentA,
      parentKeyB: {
        predicate: mockValidatorParentB
      }
    }

    getValidationState(testState, testRules, testState, testState)

    expect(mockValidatorParentA.mock.calls).toHaveLength(1)
    expect(mockValidatorParentB.mock.calls).toHaveLength(1)
    expect(mockValidatorParentA.mock.calls[0][0]).toBe(testState.parentKeyA)
    expect(mockValidatorParentB.mock.calls[0][0]).toBe(testState.parentKeyB)
  })

  it('should support passing predicates as just a function', () => {
    const testState = {
      parentKeyA: 'A'
    }

    const testRules = {
      parentKeyA: v => v === 'A'
    }

    const actualValidationState = getValidationState(testState, testRules, testState, testState)
    const expectedValidationState = {
      all: true,
      snapshots: {
        parentKeyA: {
          valid: true,
          message: null,
          modified: false
        }
      }
    }

    expect(actualValidationState).toEqual(expectedValidationState)
  })

  it('should support passing predicates as an object with `predicate` and `message` keys', () => {

  })

})

describe('<Validator>', () => {
  const defaultProps = {
    state: {
      parentKey: ''
    },
    rules: {
      parentKey: () => true
    },
    render: () => <input type="text" className="react-validator" />
  }
  it('should render without crashing', () => {
    expect(shallow(<Validator {...defaultProps} />)).toBeTruthy()
  })

  it('should call `render` with the result of a call to `getValidationState(state, rules, oldState)`', () => {
    const mockRender = jest.fn(() => <input type="text" />)

    const testState = {
      parentKey: ''
    }

    const testRules = {
      parentKey: () => true
    }

    const expectedValidationState = getValidationState(testState, testRules, testState, testState)
    shallow(<Validator state={testState} rules={testRules} render={mockRender}/>)

    expect(mockRender.mock.calls).toHaveLength(1)
    expect(mockRender.mock.calls[0][0]).toEqual(expectedValidationState)
  })

  it('should call `onChange` with the result of a call to `getValidationState(state, rules, oldState)` and `onChangeKey`', () => {
    const mockOnChange = jest.fn()
    const onChangeKey = 'parentKey'
    const testState = {
      parentKey: ''
    }

    const testRules = {
      parentKey: () => true
    }

    const expectedValidationState = getValidationState(testState, testRules, testState, testState)

    shallow(
      <Validator
        {...defaultProps}
        state={testState}
        rules={testRules}
        onChange={mockOnChange}
        onChangeKey={onChangeKey}
      />
    )

    expect(mockOnChange.mock.calls).toHaveLength(1)
    expect(mockOnChange.mock.calls[0][0]).toEqual(expectedValidationState)
    expect(mockOnChange.mock.calls[0][1]).toEqual(onChangeKey)
  })

  it('should re-call `onChange` and `render` when any of the other props change', () => {
    const mockRender = jest.fn(() => <input type="text" />)
    const mockOnChange = jest.fn()

    const wrapper = shallow(
      <Validator
        {...defaultProps}
        render={mockRender}
        onChange={mockOnChange}
      />
    )

    wrapper.setProps({
      state: {
        parentKey: '',
        parentKeyB: ''
      }
    })

    expect(mockRender.mock.calls).toHaveLength(2)
    expect(mockOnChange.mock.calls).toHaveLength(2)
  })

  it('should ensure that the instances `oldState` is only set once on instance construction', () => {
    const testState = {
      parentKey: ''
    }

    const testRules = {
      parentKey: () => true
    }

    const wrapper = shallow(<Validator {...defaultProps} state={testState} rules={testRules} />)
    
    wrapper.setProps({
      state: {
        parentKey: 'Hello world!'
      }
    })

    wrapper.setProps({
      state: {
        parentKey: 'Foo bar'
      }
    })

    expect(wrapper.instance().oldState).toEqual(testState)
  
  })
})
