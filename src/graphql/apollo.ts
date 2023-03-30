import {expressMiddleware} from '@apollo/server/express4';
import * as cors from 'cors'
import {json} from 'body-parser';

import typeDefs from './schemas'
import resolvers from './resolvers'
import {ApolloServer} from "@apollo/server";

import {AppContext, context} from './context'
import {Express} from "express";

export default async function start(app: Express) {

    const server = new ApolloServer<AppContext>({
        typeDefs,
        resolvers,
        introspection: true,
    })

    await server.start()

    app.use('/graphql', cors<cors.CorsRequest>(), json(), expressMiddleware(server, {context}));
}
