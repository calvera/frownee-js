import {GraphQLError, GraphQLScalarType, Kind} from 'graphql';
import * as format from 'date-format'
import userResolvers from './user'
import {ApolloServerErrorCode} from "@apollo/server/errors";

const timestampScalar = new GraphQLScalarType({
    name: 'Timestamp',
    description: 'Timestamp',
    serialize(value) {
        if (value instanceof Date) {
            return format.asString(format.ISO8601_WITH_TZ_OFFSET_FORMAT, value);
        }
        throw new GraphQLError('GraphQL Timestamp Scalar serializer expected a `Date` object',
            {
                extensions: {code: ApolloServerErrorCode.BAD_USER_INPUT},
            }
        );
    },
    parseValue(value) {
        if (typeof value === 'string') {
            return format.parse(format.ISO8601_WITH_TZ_OFFSET_FORMAT, value);
        }
        throw new GraphQLError('GraphQL Timestamp Scalar parser expected a `string`',
            {
                extensions: {code: ApolloServerErrorCode.BAD_USER_INPUT},
            }
        );
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return this.parseValue(ast.value)
        }
        throw new GraphQLError('GraphQL Timestamp Scalar parser expected a `string`',
            {
                nodes: ast,
                extensions: {code: ApolloServerErrorCode.BAD_USER_INPUT},
            }
        );
    },
});

const resolvers = {
    Timestamp: timestampScalar,
    Query: {
        async version() {
            return process.env.APP_VERSION ?? 'development'
        }
    },
};

export default [resolvers, userResolvers]
