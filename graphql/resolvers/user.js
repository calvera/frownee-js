const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { AuthenticationError } = require('apollo-server-express')

const { User, RefreshToken } = require('../../database/models')

function jwtSign (user) {
  return jwt.sign(
    {
      id: user.id, email: user.email, username: user.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: parseInt(process.env.JWT_EXPIRE) ?? 3600
    }
  )
}

function computeValidTo () {
  const validTo = new Date()
  validTo.setDate(validTo.getDate() + 14)

  return validTo
}

async function refreshTokenCreate (user) {
  const validTo = computeValidTo()
  return RefreshToken.create(
    {
      userId: user.id,
      token: crypto.randomBytes(32).toString('hex'),
      validTo
    })
}

module.exports = {
  Query: {
    async me (_, __, { user = null }) {
      if (user) {
        return { ...user.toJSON() }
      }
      return null
    }
  },
  Mutation: {
    async login (root, { input }) {
      const { email, password } = input
      const user = await User.findOne({ where: { email } })
      if (user && bcrypt.compareSync(password, user.password)) {
        const jwtToken = jwtSign(user)
        const refreshToken = await refreshTokenCreate(user)
        return { ...user.toJSON(), token: jwtToken, refreshToken: refreshToken.token }
      }
      throw new AuthenticationError('Invalid credentials')
    },
    async refreshToken (root, { input }) {
      const { refreshToken: token } = input
      const refreshToken = await RefreshToken.findOne({ where: { token }, include: 'user' })
      if (refreshToken) {
        const user = refreshToken.user
        const jwtToken = jwtSign(user)
        refreshToken.validTo = computeValidTo()
        await refreshToken.save()
        return { ...user.toJSON(), token: jwtToken, refreshToken: refreshToken.token }
      }
      throw new AuthenticationError('Invalid credentials')
    }
  }
}
