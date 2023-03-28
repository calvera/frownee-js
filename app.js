const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const {admin, adminRouter} = require('./admin/admin')
const apolloServer = require('./api/server')
const PORT = 3000


const start = async () => {
    const app = express()

    app.use(admin.options.rootPath, adminRouter)

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/api' });

    app.listen(PORT, () => {
        console.log(`Admin started on http://localhost:${PORT}${admin.options.rootPath}`)
        console.log(`GraphQL started on http://localhost:${PORT}/api`)
    })
}

process.on('uncaughtException', (err) => {
    console.error(`${(new Date()).toUTCString()} uncaughtException:`, err);
    process.exit(0);
});

process.on('unhandledRejection', (err) => {
    console.error(`${(new Date()).toUTCString()} unhandledRejection:`, err);
});

return start()