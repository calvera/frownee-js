const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { AuthenticationError } = require('apollo-server-express');

const { User } = require('../../database/models');

module.exports = {
    Query: {
        async me(_, {}, {user = null}){
            if (user) {
                return {...user.toJSON()}
            }
            return null;
        }
    },
    Mutation: {
        async login(root, { input }, context) {
            const { email, password } = input;
            const user = await User.findOne({ where: { email } });
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({ id: user.id }, 'mySecret');
                return { ...user.toJSON(), token };
            }
            throw new AuthenticationError('Invalid credentials');
        },
    },
};