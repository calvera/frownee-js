import {gql} from 'graphql-tag'

import userType from './user'

const rootType = gql`
    scalar Timestamp
    
    type Query {
        version: String!
    }
    type Mutation {
        version: String!
    }
`.definitions

export default [...rootType, ...userType]
