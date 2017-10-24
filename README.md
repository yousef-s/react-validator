# React Validator

In progress.

## What is React Validator?

React Validator is a library built in order to simply the proccess of validating user input within React applications. It is unopinionated, and remains versatile in that it is completely agnostic to how you manage your state and how you want to display validation state to your users.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Advanced Usage](#advanced-usage)

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

The `<Validator>` component takes the following props

Prop Name | Description
--------- | -----------
state | An object that contains the data you want to validate. This should contain the user's input, and likely will be either your component's state or state from a store if you manage user input state externally to your component (e.g. Flux, Redux, etc).
rules | An object that describes how your `state` object should be validated. This will have the same data structure as your `state` object, with a few differences (explained below).
render | A function that takes as it's only arguement the outcome of validating the `state` prop with `rules`. Follows the render-prop pattern (read more about this).
onChange | A callback that will fire whenever the instance of `<Validator>` is updated. For advanced use cases (see [Lifting up state](blob/master/docs/lifting-validation-state.md)).
onChangeKey | An indentifier that will be supplied to the `onChange` callback to help identify which instance of `<Validator>` was the callee.

### Setting up state

As mentioned above, state should be an object that contains your user input state. This could be your component's state e.g. `this.state` or props if you manage your user input as store-based state (Flux, Redux, etc) e.g. `this.props`.

This object can be nested as deep as you like.

For example:

```javascript
{
  userName: {
    firstName: 'Dan',
    lastName: 'Abramov',
    aliases: {
      github: 'gaeron'
    }
  },
  age: 30
}
```

### Setting up rules

This is an object that has almost the same structure as `state` except for where a key is meant to be validated, a predicate function is provided in order to validate that key in `state`. You can also optionally provide a message if you want to co-locate your message and validation rules.

A predicate function, in this case, is a function which takes an input (in this case the value of the key in `state`) and returns `true` or `false` depending on whether the value is valid.

For example (based on the above `state`):

```javascript
{
  userName: {
    firstName: firstName => firstName === 'Dan'
  },
  age: (value) => value < 25
}
```

### Setting up render

When either `rules` or `state` is updated, the `<Validator>` component will re-render it's render-prop. It caches the initially supplied `state`, in order to determine whether or not anything has actually been changed (for a more in-depth explanation please see here).


For example, using the above `state` and `rules`:

```javascript
<Validator state={state} rules={rules} render={(validation) => {
  // What is validation? See below!
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

An individual snapshot is an object with the following methods/properties:

Property/Method Name | Possible Values | Description
-------------------- | --------------- | -----------
valid | true or false | Set to true if value is valid, false otherwise.
initial | true or false | Set to true if the value is the same as the initial state, false otherwise.
isValid | true or false | Returns true if the value is valid, false otherwise.
isDefault | true or false | Returns true if the value is the same as initial state, false otherwise.

## Advanced Usage

It's recommended that you take a look at the following documentation:

- [Pattern: Using CSS classes to display validation state](blob/master/docs/patterns-using-css-classes.md)
- [Built-in predicate functions](blob/master/docs/builtin-predicates.md)
- [Built-in utility functions](blob/master/docs/builtin-utility-functions.md)
- [Lifting up validation state](blob/master/docs/lifting-validation-state.md)

And the following examples:

- Stateful Component (React only)
- Stateless Functional Component (React and Redux)