const models = require('../database/models/')
const bcrypt = require("bcrypt")

const AdminJSSequelize = require('@adminjs/sequelize')
const AdminJS = require("adminjs");
const Connect = require("connect-pg-simple");
const session = require("express-session");
const AdminJSExpress = require("@adminjs/express");

AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
})

const authenticate = async (email, password) => {
    const user = await models.User.findOne({ where: { username: email } })
    if (user && await bcrypt.compare(password, user.password)) {
        return Promise.resolve(user)
    }
    return null
}

const admin = new AdminJS({
    resources: [
        {
            resource: models.User,
            options: {
                listProperties: ['username', 'email', 'createdAt', 'updatedAt'],
                filterProperties: ['username', 'email'],
                editProperties: ['username', 'email'],
                showProperties: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
            },
        }
    ],
})

const ConnectSession = Connect(session)
const sessionStore = new ConnectSession({
    conObject: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production',
    },
    tableName: 'session',
    createTableIfMissing: true,
})

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: process.env.SECRET,
    },
    null,
    {
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        secret: process.env.SECRET,
        cookie: {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        },
        name: 'adminjs',
    }
)

module.exports = {
    admin: admin,
    adminRouter: adminRouter,
}