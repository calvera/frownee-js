import { gql } from 'apollo-server-express'

const userType = require('./user')

const rootType = gql`
    type Query {
        version: String!
    }
    type Mutation {
        version: String!
    }
`.definitions

export = [rootType, userType]
