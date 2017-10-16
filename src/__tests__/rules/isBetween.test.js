import isBetween from '../../rules/isBetween'

describe('Rule: isBetween(min,max)(value)', () => {
  it('should return true if the value is between min, and max', () => {
    expect(isBetween(200, 400)(300)).toBe(true)
    expect(isBetween(200.5, 400.5)(300.5)).toBe(true)
  })

  it('should return false if the value or min or max is not a number', () => {
    expect(isBetween(100, '200')(150)).toBe(false)
    expect(isBetween('100', 200)(150)).toBe(false)
    expect(isBetween(100, 200)('150')).toBe(false)
  })

  it('should return false if the value isn\'t between the min and max: ', () => {
    expect(isBetween(100, 200)(250)).toBe(false)
  })
})
