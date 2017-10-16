import isNumber from './isNumber'

export default function isBetween(min, max) {
  return (value) => {
    if (!isNumber(min) || !isNumber(max) || !isNumber(value)) {
      return false
    }

    return value >= min && value <= max
  }
}
