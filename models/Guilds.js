const {database, DataTypes} = require('../sequelize/database');

module.exports = database.define('guilds', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    prefix: {
        type: DataTypes.STRING,
        defaultValue: 'm.',
        allowNull: false
    }
}, {
    timestamps: true
});