import React from 'react'
import PropTypes from 'prop-types'

/**
 * Snapshot constructor
 * @param {Boolean} valid
 * @param {String|Undefined} message 
 * @param {Boolean} modified 
 */
export function Snapshot(valid, message, modified) {
  this.valid = valid
  this.message = message || null
  this.modified = modified
}

/**
 * Determine whether or not to display an error.
 */
Snapshot.prototype.hasError = function hasError() {
  return !this.valid && this.modified
}

/**
 * Iterates over each rule, checking that a property within the state key matches
 * at the same level (supports nesting), logs errors to console when provided state or rules
 * args do not match expectations, and then running validation functions as required.
 *
 * Returns an object that marks each key against which a rule exists as valid or not
 * and whether all rules are valid.
 * @param {Object} state
 * @param {Object} rules
 * @return {Object} - {snapshot: <Object>, all: <Boolean>}
 */
export function getValidationState(state, rules, oldState) {
  let all = true

  function validateEach(state, rules, oldState) {
    // console.log('State:', state, oldState, oldState === state)
    const snapshots = {}
    Object.keys(rules).forEach((key) => {
      // If the provided key doesn't exist in state, then early return
      // and log an error to console.
      if (typeof state[key] === 'undefined') {
        console.error(`Validator Error: key provided in rules (${key}) doesn't exist in state.`)
        return key;
      }

      // If the provided rule isnt a function or an object, then early return
      // and log an error to console.
      if (typeof rules[key] !== 'function' && typeof rules[key] !== 'object') {
        console.error(`Validator Error: rule provided for ${key} is invalid. Please see documentation.`)
        return key;
      }

      // If the structure of properties has changed on state, then oldState will no
      // longer be diff-able.
      if (typeof oldState[key] === 'undefined') {
        console.error(`Validator Error: current state includes a key (${key}) that initial state didn't include.`)
      }

      // This to catch nested objects, with nested rulesets, call this function
      // recursively
      if (typeof rules[key] === 'object' && typeof rules[key].predicate === 'undefined') {
        snapshots[key] = validateEach(state[key], rules[key], oldState[key])
      }

      // If this is a parent object, lets not continue
      if (typeof rules[key] !== 'function' && typeof rules[key].predicate !== 'function') {
        return key;
      }

      // Ok, we're all clear now! Let's figure out if this is a function or
      // there is an existant predicate property on the object.
      const valid = (typeof rules[key] === 'function') ? rules[key](state[key]) : rules[key].predicate(state[key])
      // console.log(key, state, oldState)
      const modified = state[key] !== oldState[key]
      // If valid is ever false, we set all to false
      if (!valid) {
        all = false
      }

      snapshots[key] = new Snapshot(valid, rules[key].message, modified)
    })

    return snapshots
  }

  const snapshots = validateEach(state, rules, oldState)

  return {
    all,
    snapshots
  }
}

/**
 * @desc
 * 
 * Note: We're using our own property on the class to maintain a cache of old state
 * because setState is async, and doesn't guarantee a subsequent lookup of this.state
 * is going to match what was set (possibility of batched updates, etc)
 */
export class Validator extends React.Component {
  constructor(props) {
    super(props)
    this.oldState = this.props.state
  }
  getOldState() {
    return this.oldState
  }
  validate() {
    const { state, rules, onChange, onChangeKey } = this.props
    // First time this is called, this.getCache() will be undefined so default to using state
    const oldState = this.getOldState()
    const validation = getValidationState(state, rules, oldState)
    
    if (typeof onChange === 'function') {
      onChange(validation, onChangeKey)
    }

    return validation
  }
  render() {
    const { render } = this.props
    const validation = this.validate()
    return render(validation)
  }
}

Validator.defaultProps = {
  onChange: null,
  onChangeKey: null,
}

Validator.propTypes = {
  state: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
  onChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  onChangeKey: PropTypes.string,
  render: PropTypes.any.isRequired
}

export default Validator
