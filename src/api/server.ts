import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import cors from 'cors'

const typeDefs = require('../graphql/schemas')
import resolvers from '../graphql/resolvers'

const context = require('../graphql/context')
const app = express()

app.use(cors())

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: true,
    // playground: {
    //     settings: {
    //         'schema.polling.enable': false
    //     }
    // }
})

module.exports = apolloServer
