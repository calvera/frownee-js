import { gql } from 'graphql-tag'

import userType from './user'

const rootType = gql`
    type Query {
        version: String!
    }
    type Mutation {
        version: String!
    }
`.definitions

export = [...rootType, ...userType]
