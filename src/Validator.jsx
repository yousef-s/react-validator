import React from 'react'
import PropTypes from 'prop-types'

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
export function getValidationState(state, rules) {
  let all = true

  function validateEach(state, rules) {
    const snapshot = {}
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

      // This to catch nested objects, with nested rulesets, call this function
      // recursively
      if (typeof rules[key] === 'object' && typeof rules[key].predicate === 'undefined') {
        snapshot[key] = validateEach(state[key], rules[key])
      }

      // If this is a parent object, lets not continue
      if (typeof rules[key] !== 'function' && typeof rules[key].predicate !== 'function') {
        return key;
      }

      // Ok, we're all clear now! Let's figure out if this is a function or
      // there is an existant predicate property on the object.
      const valid = (typeof rules[key] === 'function') ? rules[key](state[key]) : rules[key].predicate(state[key])

      // If valid is ever false, we set all to false
      if (!valid) {
        all = false
      }

      snapshot[key] = {
        valid,
        message: rules[key].message || null,
      }
    })

    return snapshot
  }

  const snapshot = validateEach(state, rules)

  return {
    all,
    snapshot
  }
}


export const Validator = ({ state, rules, render, onChange, onChangeKey }) => {
  // Iterate over rules
  const validationState = getValidationState(state, rules)
  // If onChange has been set, then let's call it if it's a function
  if (typeof onChange === 'function') {
    onChange(validationState, onChangeKey)
  }
  return render(validationState)
}

Validator.defaultProps = {
  onChange: null,
  onChangeKey: null,
}

Validator.propTypes = {
  state: PropTypes.object,
  rules: PropTypes.object,
  onChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  onChangeKey: PropTypes.string
}

export default Validator
