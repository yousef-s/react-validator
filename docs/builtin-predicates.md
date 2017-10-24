# What built-in predicate functions do we provide?

## Overview

Below is a list of the predicate functions offered out of the box with React Validator.

## Usage

Each of the supported predicate functions are available for importing from the "main" library location:

```javascript
import { isEmail }  from 'react-validator/rules'
```

Or, if you only want to import a sub-set of the library:

```javascript
import isEmail from 'react-validator/rules/isEmail'
```

## Available predicates


### Type Checkers

Function Name | Description 
------------- | -----------
isNumber | Returns true when given a valid number (as string or number). False otherwise.
isInteger | Returns true when given a valid integer (as string or number). False otherwise.
isFloat | Returns true when given a valid integer (as string or number). False otherwise.
isObject | Returns true when given an object. False otherwise.
isString | Returns true when given a string. False otherwise.
isArray | Returns true when given an array. False otherwise.

### Advanced Predicates (Curried Functions)

*Most of the below functions all return functions which act as the predicates (curried functions). This means that you provide "options" e.g. the range up-front, and allows for easy use with rules, for example:*

`isBetween(30, 40) -> ƒ(value)`

### Range/Matching Checkers

Function Name | Description
------------- | -----------
isBetween(min = *Number* , max = *Number*) | Returns true if the value is between min and max. False otherwise.
isContaining(substring = *String*) | Returns true if the value contains the sub-string. False otherwise.
isMatch(regex = *String*) | Returns true if the value matches the regex. **Regex should be supplied as a string**. False otherwise.
isOneOf(array = *Array*) | Returns true when given a value that is in `array`, false otherwise. Useful for allowing/disallowing certain values.

### Data-Specific Checkers

Function Name | Description
------------- | -----------
isEmail(options = *Object*) | Returns true when given a valid email, otherwise false. Wraps [validator.js](https://github.com/chriso/validator.js/) `isEmail()` implementation, with the same `options`. If no `options` supplied, uses default as per documentation.
isURL(options = *Object*) | Returns true when given a valid URL, otherwise false. Wraps [validator.js](https://github.com/chriso/validator.js/) `isURL()` implementation, with the same `options`. If no options supplied, uses default as per documentation.
isDate(format = *String*) | Returns true when given a valid date that matches `format`, otherwise false. Check [moment.js documentation](https://momentjs.com/docs/#/parsing/string-format/) for more info on building format strings.

### Requirement Checkers

By default, a predicate will return true/false, meaning that in most cases the initial empty state of a user input field will be considered invalid. How do you deal with values that aren't required, but should be validated if given a non-empty value?

Function Name | Description
------------- | -----------
isEmpty | Returns true when given an empty value, false otherwise.
isRequired | Returns true when given a non-empty value, false otherwise.
isRequiredWhen(predicate = *Function*) | Returns true if given an empty value or when the predicate function returns true if non-empty, false otherwise.

**What's an "empty" value?**

The following values are considered empty values with respect to `isNotRequired()`:

- `0`
- `''`
- `null`
- `undefined`
