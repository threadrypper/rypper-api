process.loadEnvFile()

const cors = require('@fastify/cors')
const { API } = require('easy-api.ts')
const { HOST, PORT, AUTH_TOKEN } = process.env
const { AuthManager } = require('./managers/AuthManager')
const { overloadCheckAuthToken } = require('./customFunctions/$checkAuthToken')

const api = new API({
    dots: false,
    reverse: false
})

// Enable CORS
api.app.register(cors)

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
