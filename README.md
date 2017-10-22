# React Validator

In progress.

## What is React Validator?

React Validator is a library built in order to simply the proccess of validating user input within React applications. It is unopinionated, and remains versatile in that it is completely agnostic to how you manage your state and how you want to display validation state to your users.

## Installation

React Validator has been tested with React v15.5+, although I'm planning to test on earlier releases when I get a chance.

If you're using npm to manage dependencies:

```
npm install react-validator
```

If you're using yarn to manage dependencies:

```
yarn add react-validator
```

## Basic Usage

The library exposes a `<Validator>` component as well as a bunch of predicate functions which can speed up your productivity.

### Using the <Validator> component

The `<Validator>` component takes three props:

- `state` - An object that contains the data you want to validate. This should contain the user's input, and likely will be either your component's state or state from a store if you manage user input state externally to your component (e.g. Flux, Redux, etc).

- `rules` - An object that describes how your `state` object should be validated. This will have the same data structure as your `state` object, with a few differences (explained below).

- `render` - A function that takes as it's only arguement the outcome of validating the `state` prop with `rules`. Follows the render-prop pattern (read more about this).

### Setting up state

As mentioned above, state should be an object that contains your user input state. This could be your component's state e.g. `this.state` or a prop if you manage your user input as store-based state (Flux, Redux, etc) e.g. `this.props.form`.

This object can be nested as deep as you like.

For example:

```javascript
const state = {
  userName: {
    firstName: 'Dan',
    lastName: 'Abramov'
  },
  age: 30,
  currentEmployer: 'Facebook'
}
```

### Setting up rules

This is an object that has almost the same structure as `state` except for where a key is meant to be validated, a predicate function is provided in order to validate that key in `state`. You can also optionally provide a message if you want to co-locate your message and validation rules.

A predicate function, in this case, is a function which takes an input (in this case the value of the key in `state`) and returns `true` or `false` depending on whether the value is valid.

For example (based on the above `state`):

```javascript

function isFirstNameDan(firstName) {
  return firstName === 'Dan'
}

// Simple rule definition using only predicate functions,
// one for each key
const rules = {
  userName: {
    firstName: isFirstNameDan
  },
  age: (value) => value < 25
}
```

### Setting up render

When either `rules` or `state` is updated, the `<Validator>` component will re-render it's render-prop. It caches the initially supplied `state`, in order to determine whether or not anything has actually been changed (for a more in-depth explanation please see here).


For example, using the above `state` and `rules`:

```javascript
<Validator state={state} rules={rules} render={(validation) => {
  // What is validation?

  const { firstName } = validation.snapshots.userName.firstName

  return (
    <input type="text" value={this.props.userName.firstName}>
    {
      !firstName.isValid() &&
      <span className="invalid">This first name is not valid.</span>
    }
  )
}}>
```

### What is the value of the object the callback is called with?

As you can see above, the callback provided to `render` takes a single argument. The value of that argument contains information you can use to identify whether all rules have returned valid, and a breakdown of how each rule performed (a "snapshot").

For the above example, the value of the argument will be:

```javascript
{
  all: false, // true ONLY when all rules are valid, false otherwise
  snapshots: {
    userName: {
      firstName: Snapshot
    },
    age: Snapshot
  }
}
```

An individual snapshot is an object with the following properties:

```javascript
{
  valid: true, // true or false, if the value is valid
  modified: true, // true or false if the value has been modified from it's initial value
  hasError() {
    // returns true if valid is false or modified is true
    // useful for displaying error messages, as initial state
    // will return false
  }
}
```

### Advanced Usage

In this section I will cover the following topics. I would also recommend taking a look at the links to fully fledged examples below to see different use cases:

- 1. Out of the box validation predicates
- 2. Dealing with nested state
- 3. Dealing with longer or more complex user input cases

### 1. Out of the box validation predicates

A lot of validation rules are quite common, so out of the box I've provided some predicate functions you can use to remove a lot of the boilerplate of setting up predicate functions for basic use cases.

These are taken from a validation.js library and wrapped as needed in order to take a single arguement (the value) and return a result.

A full list of the supported out of the box validation predicates can be found here:


### 2. Dealing with nested state

There are cases where you may have nested state, in which validation relies on multiple parts of that nesting passing a particular rule set. As the `<Validator>` component will return snapshots for each level at which it meets a predicate function in the rules passed to it, this is supported.

For example, let's say we have the following state:

```javascript
const state = {
  userName: {
    firstName: 'Paul',
    lastName: 'Irish'
  }
}
```

We want `userName` only to be valid if the value of `firstName` is `Paul` and the value of `lastName` is `Irish`. We can then use the following rule object:

```javascript
function isPaulIrish(value) {
  return value.firstName === 'Paul' && value.lastName === 'Irish'
}
const rules = {
  userName: isPaulIrish
}
```

In the callback arguement, the snapshot will be assigned against `userName`, like so:

```javascript
{
  all: true,
  snapshots: {
    userName: {
      valid: true,
      modified: false,
      hasError() {

      }
    }
  }
}
```