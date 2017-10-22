/**
 * Import the required elements
 */
import React from 'react'
import Validator from 'react-validator'
import { isEmail, isNumber, isPostalCode } from 'react-validator/rules'

const validationRules = {
  email: isEmail, // Validating for an email
  payment: isNumber, // Validating for a number
  postalCode: isPostalCode('GB') // Validating for a British postal code
}

/**
 * Our <SingleForm> component, which is stateful.
 */
class SingleForm extends React.Component {
  constructor(props) {
    super(props)
    /**
     * In this example, we're going to pass our state into our <Validator>
     * component and validate that.
     */
    this.state = {
      email: '',
      payment: 0,
      postalCode: ''
    }
  }
  render() {
    return (
      <Validator
        state={this.state}
        rules={validationRules}
        defaultValid
        render={(validation) => {
          const { snapshot, all } = validation
          const formClass = all ? 'form-valid' : 'form-invalid'
          return (
            <form className={`form ${formClass}`}>
              <div className="email-input">
                <label>Email</label>
                <input type="text"/>
                { !snapshot.email.valid && 
                  shapshot.email.modified && 
                  <span>This email isn't valid</span> 
                }
              </div>
            </form>
          )
        }}
      />
    )
  }
}