import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'

import User, {UserRole} from '../../entity/User'
import RefreshToken from '../../entity/RefreshToken'
import {GraphQLError} from 'graphql'

function jwtSign(user) {
    return jwt.sign(
        {
            email: user.email, username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: parseInt(process.env.JWT_EXPIRE) ?? 3600,
            subject: user.id
        }
    )
}

function computeValidTo() {
    const validTo = new Date()
    validTo.setDate(validTo.getDate() + 14)

    return validTo
}

async function refreshTokenCreate(user) {
    const validTo = computeValidTo()
    const refreshToken = new RefreshToken
    refreshToken.token = crypto.randomBytes(16).toString('hex')
    refreshToken.validUntil = validTo;
    refreshToken.user = user;

    await refreshToken.save();

    return refreshToken;
}

export default {
    UserRole: UserRole,
    Query: {
        async me(_, __, {user = null}) {

            if (user) {
                return {...await user}
            }
            return null
        }
    },
    Mutation: {
        async login(root, {input}) {
            const {email, password} = input
            const user = await User.findOneBy({email: email})
            if (user && user.comparePassword(password)) {
                const jwtToken = jwtSign(user)
                const refreshToken = await refreshTokenCreate(user)
                return {...user, token: jwtToken, refreshToken: refreshToken.token}
            }
            throw new GraphQLError('Invalid credentials')
        },
        async refreshToken(root, {input}) {
            const {refreshToken: token} = input
            const refreshToken = await RefreshToken.findOneBy( {token: token})
            if (refreshToken) {
                const user = refreshToken.user
                const jwtToken = jwtSign(user)
                refreshToken.validUntil = computeValidTo()
                await refreshToken.save()
                return {...user, token: jwtToken, refreshToken: refreshToken.token}
            }
            throw new GraphQLError('Invalid credentials')
        }
    }
}
