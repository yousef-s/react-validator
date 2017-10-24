# What built-in utility functions do you provide?

Here's a list of utility functions we provide to complement suggested usage patterns. This list is likely to grow over time, and just like built-in predicates, these are not core to using React Validator, but should help with having less boilerplate code for common tasks.

## getValidationCSSClasses()

This function will iterate over a set of snapshots and return the same object structure as snapshots, except for each key's value will be a string which represents a class name assigned based on one of three states; default (initial state), valid or error. 

### Arguments

getValidationCSSClasses(snapshots = *Object*, defaultClassName = *String*, validClassName = *String*, errorClassName = *String*)

### Example

Given the following snapshots object:

```javascript
{
  firstName: {
    valid: true,
    initial: false,
    ...
  },
  lastName: {
    valid: false,
    initial: true,
    ...
  }
}
```

And using the following values for the arguments:

Argument | Value
-------- | -----
snapshots | As above
defaultClassName | 'default'
validClassName | 'valid'
errorClassName | 'error'

Calling the function with all arguments will result in the following object being returned:

```javascript
{
  firstName: 'valid',
  lastName: 'default'
}
```