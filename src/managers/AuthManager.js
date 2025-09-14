const { SALT_STRING, SALT_ROUNDS, JWT_SECRET_KEY } = process.env
const { scryptSync } = require('node:crypto')
const jwt = require('jsonwebtoken')

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
 * Hashifies a token.
 * @param {string} token - The token to hashify.
 * @param {boolean} bearer - Whether is bearer token.
 * @returns {string}
 */
function hashify(token, bearer) {
    const hashedToken = scryptSync(
        bearer ? bearify(token) : token,
        SALT_STRING,
        parseInt(SALT_ROUNDS)
    )

    /**
     * @type {string}
     */
    const signedToken = jwt.sign(hashedToken, JWT_SECRET_KEY)

    return signedToken
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
        this.options = {
            ...this.options,
            ...options,
            token: hashify(options.token, options.bearer)
        }
    }

    /**
     * Compare the provided token with the stored token.
     * @param {string} token - The token to compare.
     * @return {boolean} True if the tokens match, false otherwise.
     */
    compareToken(token) {
        const hashedToken = hashify(token, this.options.bearer)
        return this.options.token === hashedToken
    }
}

module.exports = { AuthManager }