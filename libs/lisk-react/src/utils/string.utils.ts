/**
 * Converts an array buffer to a string
 *
 * @private
 * @param {ArrayBuffer} buf The buffer to convert
 * @param {Function} callback The function to call when conversion is complete
 */

export function _arrayBufferToString(buf: any) {
  return Buffer.from(buf).toString('hex');
}
