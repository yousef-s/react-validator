import customMatchers from '../customMatchers'
/**
 * Validating emails using regular expressions is an oft debated topic when it comes to validation.
 * Therefore, I've taken the approach of using the same regular expression that is used in
 * the HTML5 spec for <input type="email"> fields. This correctly match most valid email addresses.
 *
 * https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
 */
describe('Rule: isEmail(value)', () => {

  beforeEach(() => {
    expect.extend(customMatchers)
  })
  it('should return true if the value is a valid RFC-822 email', () => {
    const testEmails = [
      'abc1.1@domain.com',
      'abc.abc@domain.com',
      'abc_41.15768@domain.com',
      '12345@domain.com',
      '12.12.23@domain.com',
      'ABC.ABC.ABC.ABC0046@domain.com',
      'abc_123_4595@domain.com',
      'abc@asdas.co.in',
      'abc@insta123.com',
      'abc@inta.co.in',
      'abc@luxury.travel',
      'abc@fb.insta'
    ]

    testEmails.forEach((v) => {
      expect(v).toBeAnEmail()
    })
  })

  it('should return false if the isn\'t a valid RFC-822 email', () => {
    const testEmails = [
      'abc@@insta.com.com.com',
      'abc@insta..com',
      'abc@insta%.com',
      'abc@insta/.com'
    ]
    testEmails.forEach((v) => {
      expect(v).not.toBeAnEmail()
    })
  })
})
