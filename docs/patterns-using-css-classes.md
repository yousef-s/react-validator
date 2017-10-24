# Using CSS classes to determine display of validation

A good pattern to use in order to display valid/error state is to use CSS classes, and cascading down styling to hide/show error messages, display red borders around input fields, etc.

## Example

*styles.css*

```css
.error-message { display: none; }

.default label {
  color: black;
}

.default input[type=text] {
  border: none;
}

.valid label {
  color: green;
}

.valid input[type=text] {
  border: 1px solid green;
}

.invalid label {
  color: red;
}

.invalid input[type=text] {
  border: 1px solid red;
}

.invalid .error-message {
  display: block;
}
```

*SomeComponent.jsx*

```javascript
<Validator
  {...otherProps}
  render={({all, snapshots}) => {
    
    const validationClasses = getValidationCSSClasses(snapshots, 'default', 'valid', 'invalid')

    return (
      <div>
        <div className={validationClasses.fooKey}>
          <label>Foo</label>
          <input type="text">
          <span className="error-message">{snapshots.fooKey.message}</span>
        </div>
        <div className={validationClasses.barKey}>
          <label>Bar</label>
          <input type="text">
          <span className="error-message">{snapshots.barKey.message}</span>
        </div>
      </div>
    )
  }}
>
```

*For more information on the built-in utility function `getValidationCSSClasses`, please see [this section](http://utility.com) of our built-in utility functions documentation*