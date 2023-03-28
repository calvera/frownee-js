const cls = require('cls-hooked');
const namespace = cls.createNamespace('app');
const { Sequelize } = require('sequelize');

Sequelize.useCLS(namespace);

const sequelize = new Sequelize(process.env.DATABASE_URL);

module.exports = sequelize;