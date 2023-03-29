import * as express from 'express'
import {expressMiddleware} from '@apollo/server/express4';
import * as cors from 'cors'
import {json} from 'body-parser';

const typeDefs = require('../graphql/schemas')
import resolvers from '../graphql/resolvers'
import {ApolloServer} from "@apollo/server";

import {context, AppContext} from './context'

export default async function start(app) {
    app.use(cors())

    const server = new ApolloServer<AppContext>({
        typeDefs,
        resolvers,
        // context,
        introspection: true,
        // playground: {
        //     settings: {
        //         'schema.polling.enable': false
        //     }
        // }
    })

    await server.start()

    app.use('/graphql', cors<cors.CorsRequest>(), json(), expressMiddleware(server, { context}));
    console.log('xxx')
}
