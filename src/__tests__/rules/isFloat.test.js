import isFloat from '../../rules/isFloat'

describe('Rule: isFloat(value)', () => {
  it('should return true if value is a float', () => {
    expect(isFloat(10.5)).toBe(true)
  })

  it('should return false if value isn\'t a float', () => {
    expect(isFloat(10)).toBe(false)
  })
})