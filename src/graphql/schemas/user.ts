import { gql } from 'apollo-server-express'

export = gql`
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
        refreshToken(input: RefreshTokenInput!): RefreshTokenResponse
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
        refreshToken: String!
    }

    input RefreshTokenInput {
        refreshToken: String!
    }

    type RefreshTokenResponse {
        id: Int!
        username: String!
        email: String!
        token: String!
        refreshToken: String!
    }
`
