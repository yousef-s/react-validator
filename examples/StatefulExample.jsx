/**
 * Import the required elements
 */
import React from 'react'
import Validator from 'react-validator'
import { isEmail, isBetween, isRequired } from 'react-validator/rules'

/**
 * This example uses a stateful component, passing down the component's state to <Validator> and then 
 */
class StatefulExample extends React.Component {
  constructor(props) {
    super(props)

    // Setup state, which we will pass to <Validator>
    this.state = {
      email: '',
      firstName: '',
      age: ''
    }

    // Bind our change handlers
    this.setEmail = this.setEmail.bind(this)
    this.setAge = this.setAge.bind(this)
    this.setFirstName = this.setFirstName.bind(this)
    
    // Setup rules, which we will pass to <Validator>
    this.rules = {
      email: {
        predicate: isEmail(),
        message: 'This is not a valid email address'
      },
      age: {
        predicate: isBetween(30, 50),
        message: 'Your age must be between 30 and 50',
      },
      firstName: {
        predicate: isRequired(),
        message: 'You cannot leave your first name blank'
      }
    }
  }
  setEmail(event) {
    this.setState({
      email: event.target.value
    })
  }
  setAge() {
    this.setState({
      age: event.target.value
    })
  }
  setFirstName() {
    this.setState({
      firstName: event.target.value
    })
  }
  render() {
    return (
      <Validator
        state={this.state}
        rules={this.rules}
        render={(validation) => {
          // Destructure the two top-level properties from validation
          const { all, snapshots } = validation

          // Assign classes we will use to display UI error state
          const validationClasses = {
            email: snapshots.email.hasError() : 'invalid' : 'valid',
            age: snapshots.age.hasError() : 'invalid': 'valid',
            firstName: snapshots.firstName.hasError(): 'invalid' : 'valid'
          }

          // Below we use the created classname's above, where 'invalid' will display the <span>
          // child element which contains the error message, 'valid' will hide it.
          
          // We have also co-located the error messages, so we will use them.

          // We also use 'all' to decide whether or not to display the 'Continue' button.
          return (
            <div>
              <div className={validationClasses.email}>
                <label>Email</label>
                <input type="text" onChange={this.setValue()} />
                <span>{snapshots.email.message}</span>
              </div>
              <div className={validationClasses.age}>
                <label>Age</label>
                <input type="text" onChange={this.setStateAge} />
                <span>{snapshots.age.message}</span>
              </div>
              <div className={validationClasses.firstName}>
                <label>First Name</label>
                <input type="text" onChange={this.setFirstName}>
                <span>{snapshots.firstName.message}
              </div>
              {
                all &&
                <button>Continue</button>
              }
            </div>
          )
        }}
      />
    )
  }
}