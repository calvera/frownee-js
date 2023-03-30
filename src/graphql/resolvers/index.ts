import { GraphQLScalarType, Kind } from 'graphql';
import * as format from 'date-format'

const timestampScalar = new GraphQLScalarType({
    name: 'Timestamp',
    description: 'Timestamp',
    serialize(value) {
        if (value instanceof Date) {
            return format.asString(format.ISO8601_WITH_TZ_OFFSET_FORMAT, value);
        }
        throw Error('GraphQL Timestamp Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
        if (typeof value === 'string') {
            return format.parse(format.ISO8601_WITH_TZ_OFFSET_FORMAT, value);
        }
        throw new Error('GraphQL Timestamp Scalar parser expected a `string`');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return this.parseValue(ast.value)
        }
        throw new Error('GraphQL Timestamp Scalar parser expected a `string`');
    },
});

const resolvers = {
    Timestamp: timestampScalar,
};

import userResolvers from './user'

export default [resolvers, userResolvers]
