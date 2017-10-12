export default function isRegEx(regex) {
  return value => regex.test(value)
}
