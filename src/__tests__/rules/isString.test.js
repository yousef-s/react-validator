import isString from '../../rules/isString'

describe('Rule: isString(value)', () => {
  it('should return true if the value is a string', () => {
    expect(isString('Hello world!')).toBe(true)
  })

  it('should return false if the value isn\'t a string', () => {
    expect(isString(20)).toBe(false)
  })
})