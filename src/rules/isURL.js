export default function isURL(value) {
  const regexString = '^(https?|ftp)://[^\s/$.?#].[^\s]*$@i'
  const regex = new RegExp(regexString, 'i')
  return value.length < 2083 && regex.test(value)
}
