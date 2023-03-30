import {User} from '../../entity/User'
import * as jwt from 'jsonwebtoken'
import {AppDataSource} from "../../data-source";
import {GraphQLError} from 'graphql';

const verifyToken = async (token): Promise<User> => {
    try {
        if (!token) return null
        const {sub} = await jwt.verify(token, process.env.JWT_SECRET)
        return AppDataSource.manager.findOneBy(User, {id: sub})
    } catch (error) {
        throw new GraphQLError(error.message, {
            extensions: {
                code: 'UNAUTHENTICATED',
            },
        });
    }
}

export class AppContext {
    user?: User;
}

export async function context({req}): Promise<AppContext> {
    const token = ((req.headers && req.headers.authorization) || '').replace('Bearer ', '')
    if (!token) return {user: null}
    const user = await verifyToken(token)
    return {user}
}
