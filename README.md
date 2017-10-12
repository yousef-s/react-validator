## React Validator

**This is still a work in progress - hold your horses :)!**

### What is "React Validator"?

React Validator is a versatile validation "library" that you can use to implement validation wherever you use React.

### Why use React Validator?

The idea is that this provides a way to validate user input or anything else, while remaning completely agnostic and de-coupled from the following:

- How you manage state (it doesn't care if you use Redux, Flux, MobX or even if all your state exists within components)
- How you want to display validation to the user (a lot of validation libraries are concerned with how you want to display validation, e.g. inserting new DOM nodes, adding classes to existing nodes etc)

### How does this work?

This library exposes two sets of things:

- A `<Validator>` component, which uses the aptly named "render prop" pattern (see this for why I've chosen to use the render prop pattern instead of the HOC pattern)

- A set of utility predicate functions for common validation needs (functions which take an input, and return true or false based on whether the input satisfies a condition)

The `<Validator>` component has two primary props, both of which take objects as their value.

The `state` prop is used to describe the "what" to validate.

It can be structured however you please and nested as deep as you like. A good example of what you would provide to this an existing prop if your managing your user input state outside of your component (e.g. with Redux), or `this.state` if you're containing your user input state within your component.

The `rules` prop is used to describe the "how" to validate.

It must conform to the following rules:

- It must be structured the same as the `state` prop (with a few exceptions, please see these examples)

- When you wish to validate the value of a property on `state`, you provide a "validator". A validator is one of two types:

1. A predicate function, which will take the value of `state[key]` and return true or false.

2. An object of the following structure:

{
  predicate: <Function>,
  message: <Any>
}

This can be used if you want to co-locate your validation messages with their rules.

### Basic usage
```javascript
// Some very basic predicate functions
const isFacebookCEO = v => v === 'Mark Zuckerberg' 
const isTheBestPirate = v => v === 'JackSparrow'

// The state, again, this could come from anywhere
const state = {
  fullName: 'Jack Sparrow',
  bestBuddy: 'Peter Thiel'
}

// The rules we're applying, with both valid validator types
const rules = {
  fullName: isFacebookCEO,
  bestBuddy: {
    predicate: isTheBestPirate,
    message: 'Oh no, he's not the best!'
  }
}

// The <Validator> component, which you would wrap around whatever you
// want to have access to the validation.
<Validator state={state} rules={rules}>
  {(validation) => {
    // See below for what the argument `validation` actually is
    return <input type="text"/>
    }
  }
</Validator>
```

// Awesome, so here's what validation is
    {
      all: true, // This will be true when all predicate functions provided to `rules` are also true
      snapshot: {
        fullName: { valid: true, message: null },
        bestBuddy: { valid: true, message: 'Oh no, he's not the best!' }
      }
    }
