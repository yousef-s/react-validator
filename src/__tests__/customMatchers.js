/**
 * Custom Jasmine Matchers
 * 
 * These are custom matchers for test cases where we expect to iterate over a
 * large number of inputs, e.g. email/URL validation, so that we can get more
 * context-based logging on an error, rather than line number (which won't be that helpful)
 * or forcing ourselves to right loads of test cases for a single validator.
 */
import isEmail from '../rules/isEmail'
import isURL from '../rules/isURL'

export function toBeAnEmail(received) {
  if (isEmail(received)) {
    return {
      pass: true,
      message: () => `expected ${received} to not be an email`
    }
  }

  return {
    pass: false,
    message: () => `expected ${received} to be an email`
  }
}

export function toBeAURL(received) {
  if (isURL(received)) {
    return {
      pass: true,
      message: () => `expected ${received} to not be a URL`
    }
  }

  return {
    pass: false,
    message: () => `expected ${received} to be a url`
  }
}

export default {
  toBeAnEmail,
  toBeAURL
}
