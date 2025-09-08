process.loadEnvFile()
const { API } = require('easy-api.ts')
const { HOST, PORT, AUTH_TOKEN } = process.env
const { AuthManager } = require('./managers/AuthManager')
const { overloadCheckAuthToken } = require('./customFunctions/$checkAuthToken')

const api = new API({
    dots: false,
    reverse: false
})

const authManager = new AuthManager(api, {
    bearer: true,
    token: AUTH_TOKEN
})
overloadCheckAuthToken(authManager, api)

api.route({
    url: '/protected',
    method: 'POST',
    code: `
        $c[Prevent unauthorized access.]
        $if[$checkAuthToken[$getHeader[authorization]]==false;
            $reply[
                $setCode[401]
                $setType[json]
                $setBody[{"error": "Unauthorized"}]
            ]
            $stop
        ]

        $c[Reply with success.]
        $reply[
            $setCode[200]
            $setType[json]
            $setBody[{"message": "You have accessed a protected route!"}]
        ]
    `
})

api.connect({
    host: HOST || 'localhost',
    port: parseInt(PORT) || 3000,
})
