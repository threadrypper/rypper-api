const { APIFunction, ParamType } = require('easy-api.ts')
/** @import { API, Data } from 'easy-api.ts' */

/**
 * Overloads a function to check authentication tokens.
 * @param {import('../managers/AuthManager').AuthManager} authManager - The AuthManager instance.
 * @param {API} api - The API instance.
 */
function overloadCheckAuthToken(authManager, api) {
    /**
     * CheckAuthToken function to validate authentication tokens.
     */
    class CheckAuthToken extends APIFunction {
        name = '$checkAuthToken'
        description = 'Check if the provided auth token is valid.'
        parameters = [
            {
                name: 'Token',
                description: 'The authentication token to validate.',
                type: ParamType.String,
                required: true,
                rest: false,
                defaultValue: null
            }
        ]
        usage = '$checkAuthToken[<Token>]'
        returns = ParamType.Boolean
        aliases = []
        compile = true
        /**
         * $checkAuthToken function executor.
         * @param {Data} d - Runtime data object.
         * @param {string} param1 - The authentication token to validate.
         */
        async run(d, [token]) {
            return String(authManager.compareToken(token))
        }
    }

    // Adding the function to the API instance.
    api.addFunction(new CheckAuthToken())
}

module.exports = { overloadCheckAuthToken }