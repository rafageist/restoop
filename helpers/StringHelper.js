/**
 * String helper
 */
export default class StringHelper {
  /**
     * Capitalize string
     *
     * @param stringValue
     * @returns {string}
     */
  static capitalize (stringValue) {
    if (typeof stringValue !== 'string') return ''
    return stringValue.charAt(0).toUpperCase() + stringValue.slice(1)
  }
}
