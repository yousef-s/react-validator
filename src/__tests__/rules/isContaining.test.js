import isContaining from '../../rules/isContaining'

describe('Rule: isContaining(substring)(value)', () => {
  it('should return true if the value contains the substring', () => {
    const contains = isContaining('Hello')
    expect(contains('Hello World!')).toBe(true)
  })

  it('should return false if the value does not contain the substring', () => {
    const contains = isContaining('Hello')
    expect(contains('Foo bar!')).toBe(false)
  })
})
