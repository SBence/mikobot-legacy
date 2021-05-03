const Sequelize = require('sequelize');

module.exports = {
    database: new Sequelize('database', 'username', 'password', {
        host: 'localhost',
        dialect: 'sqlite',
        logging: false,
        storage: 'config/database.sqlite'
    }),
    DataTypes: Sequelize.DataTypes
};