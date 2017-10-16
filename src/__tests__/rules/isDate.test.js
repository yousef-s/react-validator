import isDate from '../../rules/isDate'

describe('Rule: isDate(format)(value)', () => {
  it('should return true if value is a valid date that matches format', () => {
    const testDate = {
      format: 'DD-MM-YYYY',
      value: '20-10-2016'
    }

    expect(isDate(testDate.format)(testDate.value)).toBe(true)
  })

  it('should return false if value is not a valid date that matches format', () => {
    const testDate = {
      format: 'DD-MM-YYYY',
      value: '20/10/2016'
    }

    expect(isDate(testDate.format)(testDate.value)).toBe(false)
  })
})
