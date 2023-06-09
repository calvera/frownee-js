import User from '../../entity/User'
import * as jwt from 'jsonwebtoken'
import {GraphQLError} from 'graphql';

const verifyToken = async (token): Promise<User> => {
    try {
        if (!token) return null
        const {sub} = await jwt.verify(token, process.env.JWT_SECRET)
        return User.findOneBy({id: sub})
    } catch (error) {
        throw new GraphQLError(error.message, {
            extensions: {
                code: 'UNAUTHENTICATED',
                http: {
                    status: 401,
                }
            },
        });
    }
}

export class AppContext {
    user?: Promise<User> = null;
}

export async function context({req}): Promise<AppContext> {
    const token = ((req.headers && req.headers.authorization) || '').replace('Bearer ', '')
    if (!token) return {user: null}
    return {user: verifyToken(token)}
}
