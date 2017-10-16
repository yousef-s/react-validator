import isInteger from '../../rules/isInteger'

describe('Rule: isInteger(value)', () => {
  it('should return true if value is an integer', () => {
    expect(isInteger(10)).toBe(true)
  })

  it('should return false if value isn\'t an integer', () => {
    expect(isInteger(10.5)).toBe(false)
  })
})
