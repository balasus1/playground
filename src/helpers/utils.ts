/**
 * Encodes a filename into a URL-safe Base64 format.
 *
 * @param {string} filename - The filename to encode.
 * @returns {string} - The encoded filename.
 */
export function encode2Base64URL(filename: string): string {
    return btoa(filename).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }