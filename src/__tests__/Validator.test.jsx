import React from 'react'
import { shallow } from 'enzyme'
import { getValidationState, Validator } from '../Validator'

describe('getValidationState(state, rules)', () => {
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

    getValidationState(testState, testRules)

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

    getValidationState(testState, testRules)

    const expectedConsoleMessage = 'Validator Error: rule provided for parentKeyA is invalid. Please see documentation.'

    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][0]).toBe(expectedConsoleMessage)

    spy.mockRestore()
  })

  it('should return an object with an `all` key and a `snapshot` key', () => {
    const testState = {
      parentKey: 1
    }

    const testRules = {
      parentKey: v => v === 1
    }

    const validationState = getValidationState(testState, testRules)
    expect(validationState.all).not.toBeUndefined()
    expect(validationState.snapshot).not.toBeUndefined()
  })

  it('should return for each key in `rules` an object of the same key in the snapshot with `valid` and `message` keys', () => {
    const testState = {
      parentKeyA: true
    }

    const testRules = {
      parentKeyA: () => true
    }

    const actualSnapshot = getValidationState(testState, testRules).snapshot

    expect(actualSnapshot.parentKeyA.valid).not.toBeUndefined()
    expect(actualSnapshot.parentKeyA.message).not.toBeUndefined()
  })

  it('should return `all` as false on the returned object if any of the validator predicates return false', () => {
    const testState = {
      parentKeyA: '',
      parentKeyB: ''
    }

    const testRules = {
      parentKeyA: () => false,
      parentKeyB: () => true
    }

    const actualAll = getValidationState(testState, testRules).all
    
    expect(actualAll).toBe(false)
  })

  it('should return `all` as true on the returned object if all of the validator predicates return true', () => {
    const testState = {
      parentKeyA: ''
    }

    const testRules = {
      parentKeyA: () => true
    }

    const actualAll = getValidationState(testState, testRules).all
    expect(actualAll).toBe(true)
  })

  it('should return valid `snapshot` and `all` keys when operating on nested rules and state objects', () => {
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
      snapshot: {
        parentKeyA: {
          childKeyA: {
            gcKeyA: { valid: true, message: 'Hello world!' },
            gcKeyB: { valid: true, message: null }
          }
        },
        parentKeyB: {
          valid: false,
          message: null
        }
      }
    }

    const actualValidationState = getValidationState(testState, testRules)

    expect(actualValidationState).toEqual(expectedValidationState)
  })

  it('should return for any key in `rules` which is an object with a `messages` key, it\'s value, for the same rule in the snapshot', () => {
    const testState = {
      parentKey: ''
    }

    const testRules = {
      parentKey: {
        predicate: () => true,
        message: 'Hello world!'
      }
    }

    const actualSnapshotParentKey = getValidationState(testState, testRules).snapshot.parentKey
    expect(actualSnapshotParentKey.message).toBe('Hello world!')
  })

  it('should return for any key in `rules` which is just a function or that doesnt have a `messages` key, null, for the same rule in the snapshot', () => {
    const testState = {
      parentKeyA: '',
      parentKeyB: ''
    }

    const testRules = {
      parentKeyA: () => true,
      parentKeyB: {
        predicate: () => true
      }
    }

    const expectedSnapshot = {
      parentKeyA: { valid: true, message: null },
      parentKeyB: { valid: true, message: null }
    }

    const actualSnapshot = getValidationState(testState, testRules).snapshot

    expect(actualSnapshot).toEqual(expectedSnapshot)
  })

  it('should call a validator function on a `rules` key on the same key in `state` with the value of `state[key]`', () => {
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

    getValidationState(testState, testRules)

    expect(mockValidatorParentA.mock.calls).toHaveLength(1)
    expect(mockValidatorParentB.mock.calls).toHaveLength(1)
    expect(mockValidatorParentA.mock.calls[0][0]).toBe(testState.parentKeyA)
    expect(mockValidatorParentB.mock.calls[0][0]).toBe(testState.parentKeyB)
  })

  it('should return a valid snapshot when a `rules` key value is simply a function', () => {
    const testState = {
      parentKeyA: 'A'
    }

    const testRules = {
      parentKeyA: v => v === 'A'
    }

    const actualValidationState = getValidationState(testState, testRules)
    const expectedValidationState = {
      all: true,
      snapshot: {
        parentKeyA: {
          valid: true,
          message: null
        }
      }
    }

    expect(actualValidationState).toEqual(expectedValidationState)
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

  it('should call `render` with the result of a call to `getValidationState(state, rules)`', () => {
    const mockRender = jest.fn(() => <input type="text" />)

    const testState = {
      parentKey: ''
    }

    const testRules = {
      parentKey: () => true
    }

    const expectedValidationState = getValidationState(testState, testRules)
    shallow(<Validator state={testState} rules={testRules} render={mockRender}/>)

    expect(mockRender.mock.calls).toHaveLength(1)
    expect(mockRender.mock.calls[0][0]).toEqual(expectedValidationState)
  })

  it('should call `onChange` with the result of a call to `getValidationState(state, rules)` and `onChangeKey`', () => {
    const mockOnChange = jest.fn()
    const onChangeKey = 'parentKey'
    const testState = {
      parentKey: ''
    }

    const testRules = {
      parentKey: () => true
    }

    const expectedValidationState = getValidationState(testState, testRules)

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
})
