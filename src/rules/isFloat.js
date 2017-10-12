import isNumber from './isNumber'

export default function isFloat(value) {
  return isNumber(value) && value % 1 !== 0
}
