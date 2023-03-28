const { gql } = require('apollo-server-express');
const userType = require('./user')

const rootType = gql`
    type Query {
        version: String!
    }
    type Mutation {
        version: String!
    }
`;

module.exports = [rootType, userType];