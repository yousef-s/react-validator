# Lifting up validation state

You may require other parts of your state to be aware of the validation state of a/the `<Validator>` component. Say for example, you have multiple `<Validator>` component instances, for which you need all to be valid to allow the user to execute some action.

This is the perfect use case for the `onChange` and `onChangeKey` props that `<Validator>` takes. `onChange` is called anytime the component receives a prop update, and is a callback called with the following signature:

`onChange(validation, onChangeKey)`

The first argument the callback receives is the `validation` arguement. This is exactly the same as the `validation` argument provided to the callback for the `render` prop of `<Validator>`.

The second argument the callback receives is the `onChangeKey` you've provided. This can be used to identify what instance of `<Validator>` called the `onChange` callback.

**For example:**


```javascript
// We're setting up two stateless components, both of which render an instance of <Validator>

const FirstNameInput = ({ onChange, setFirstName, firstName }) => {
  const state = {
    firstName
  }

  const rules = {
    firstName: v => v === 'Bob'
  }

  return (
    <Validator
      state={state}
      rules={rules}
      render={({all, snapshots}) => (
        <div>
          <input type="text" onChange={setFirstName} />
          {!snapshots.firstName.isValid() && <span>Your first name should be Bob!</span>}
        </div>
      )}
      onChange={onChange}
      onChangeKey="firstName"
    />
  )
}

const IncomeInput = ({ onChange, setIncome, income }) => {
  const state = {
    income
  }

  const rules = {
    income: isBetween(1000, 10000)
  }

  return (
    <Validator
      state={state}
      rules={rules}
      render={({all, snapshots) => (
        <div>
          <input type="text" onChange={setIncome} />
          {!snapshots.income.isValid() && <span>Your income should be between $1000 and $10000!</span>}
        </div>
      )}
      onChange={onChange}
      onChangeKey="income"
    />
  )
}

// This component will render <FirstNameInput> and <IncomeInput>
class BigForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      income: 0,
      wholeValidation: []
    }
  }
  combineValidation(singleValidation, key) {
    const wholeValidation = [...this.state.wholeValidation, {...singleValidation, key}]
    // We maintain an array of all the <Validator> instances validation values in state
    // every time this is called, we then create a new array appending the validation object to the
    // end with an additional 'key' value, in case we want to look-up a particular instance.
    this.setState({
      wholeValidation
    })
  }
  isEverythingValid() {
    const wholeValidation = this.state.wholeValidation
    // The value of the below filter length will be 0 if everything is valid, on which we
    // want to return true.
    return !wholeValidation.filter(singleValidation => !singleValidation.all).length
  }
  setFirstName(event) {
    this.setState({
      firstName: event.target.value
    })
  }
  setIncome(event) {
    this.setState({
      income: event.target.value
    })
  }
  render() {
    const { firstName, income } = this.state
    
    // We will render our <FirstNameInput> and <IncomeInput> components
    // but also make use of our "lifted" validation state, to disable the "Continue" button
    // unless everything is valid
    return (
      <div>
        <FirstNameInput firstName={firstName} onChange={this.combineValidation} setFirstName={this.setFirstName} />
        <IncomeInput income={income} onChange={this.combineValidation} setIncome={this.setIncome} />
        <button disabled={!this.isEverythingValid()}>Continue</button>
      </div>
    )
  }
}
```

In the above example, we've used two `<Validator>` component instances, which through their `onChange` props have successfully lifted up their validation states, and are combined in the `<BigForm>` component in order to disable the continue button.