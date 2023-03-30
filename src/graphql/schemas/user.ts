import {gql} from 'graphql-tag'

const types = gql`
    enum UserRole {
        ADMIN
        EDITOR
        USER
    }
    type User {
        id: String!
        username: String!
        email: String!
        role: UserRole
        createdAt: Timestamp
        updatedAt: Timestamp
        locked: Boolean
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
`.definitions

export default types