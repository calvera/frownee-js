const { gql } = require('apollo-server-express');

module.exports = gql`
    type User {
        id: Int!
        username: String!
        email: String!
    }

    extend type Query {
        me: User
    }
    
    extend type Mutation {
        login(input: LoginInput!): LoginResponse
    }

    input LoginInput {
        email: String!
        password: String!
    }

    type LoginResponse {
        id: Int!
        username: String!
        email: String!
        token: String!
    }
`;