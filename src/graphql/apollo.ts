import {expressMiddleware} from '@apollo/server/express4';
import * as cors from 'cors'
import {json} from 'body-parser';

import typeDefs from './schemas'
import resolvers from './resolvers'
import {ApolloServer} from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import {AppContext, context} from './context'
import {Express} from "express";

export default async function start(app: Express, httpServer) {

    const server = new ApolloServer<AppContext>({
        typeDefs,
        resolvers,
        introspection: true,
        allowBatchedHttpRequests: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })

    await server.start()

    app.use(
        '/graphql',
        cors<cors.CorsRequest>({origin: ['https?://*.example.com/*', 'https://studio.apollographql.com/*']}),
        json(),
        expressMiddleware(server, {context})
    );
}
