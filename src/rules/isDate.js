import moment from 'moment'

export default function isDate(format) {
  return value => moment(value, format, undefined, true).isValid()
}