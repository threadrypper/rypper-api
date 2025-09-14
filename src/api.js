process.loadEnvFile()

const cors = require('@fastify/cors')
const helmet = require('@fastify/helmet')
const ratelimit = require('@fastify/rate-limit')
const { API } = require('easy-api.ts')
const { HOST, PORT, AUTH_TOKEN } = process.env
const { AuthManager } = require('./managers/AuthManager')
const { overloadCheckAuthToken } = require('./customFunctions/$checkAuthToken')

const api = new API({
    dots: false,
    reverse: false
})

api.app.register(cors) // Enable CORS.
api.app.register(helmet) // Important security headers.
api.app.register(ratelimit, {
    max: 100,
    timeWindow: '1 minute'
}) // Enable rate-limits to the API.

// Custom 404 handler
api.setNotFoundHandler(`
$reply[
    $setCode[404]
    $setType[json]
    $setBody[{"error": "Not Found"}]
]
`)

const authManager = new AuthManager(api, {
    bearer: true,
    token: AUTH_TOKEN
})
overloadCheckAuthToken(authManager, api)

api.load('./src/routes')

api.connect({
    host: HOST || 'localhost',
    port: parseInt(PORT) || 3000,
})
