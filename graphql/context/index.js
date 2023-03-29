const { User } = require('../../database/models')
const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server-express')

const verifyToken = async (token) => {
  try {
    if (!token) return null
    const { id } = await jwt.verify(token, process.env.JWT_SECRET)
    return await User.findByPk(id)
  } catch (error) {
    throw new AuthenticationError(error.message)
  }
}

module.exports = async ({ req }) => {
  const token = ((req.headers && req.headers.authorization) || ' ').split(' ', 2)[1]
  const user = await verifyToken(token)
  return { user }
}
