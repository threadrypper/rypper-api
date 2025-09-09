const { scryptSync } = require('node:crypto')
const { SALT_STRING, SALT_ROUNDS } = process.env

/** @import { API } from 'easy-api.ts' */

/**
 * @typedef AuthManagerOptions
 * @property {boolean} bearer - Whether to use Bearer token authentication.
 * @property {string} token - The token to validate against.
 */

/**
 * Bearify a token if it starts with "Bearer ".
 * @param {string} token - The token to bearify.
 * @return {string} The bearified token.
 */
function bearify(token) {
    const result = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    // console.debug('Bearified result:', result)
    return result
}

/**
 * AuthManager class to handle authentication logic.
 */
class AuthManager {
    /**
     * @type {API} The API instance.
     */
    api = null

    /**
     * @type {AuthManagerOptions} The authentication options.
     */
    options = {
        bearer: true
    }

    /**
     * @param {API} api The API instance.
     * @param {AuthManagerOptions} options The authentication options.
     */
    constructor(api, options = { bearer: true }) {
        this.api = api
        this.options.token = scryptSync(
            options.bearer ? bearify(options.token) : options.token,
            SALT_STRING,
            parseInt(SALT_ROUNDS)
        )
    }

    /**
     * Compare the provided token with the stored token.
     * @param {string} token - The token to compare.
     * @return {boolean} True if the tokens match, false otherwise.
     */
    compareToken(token) {
        const hashedToken = scryptSync(this.options.bearer ? bearify(token) : token, SALT_STRING, parseInt(SALT_ROUNDS))
        // console.debug([this.options.token.toString('hex'), hashedToken.toString('hex')])
        return this.options.token.toString('hex') === hashedToken.toString('hex')
    }
}

module.exports = { AuthManager }