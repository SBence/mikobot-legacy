const { database, DataTypes } = require('../sequelize/database');

module.exports = database.define('guilds', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    prefix: {
        type: DataTypes.STRING,
        defaultValue: 'm.',
        allowNull: false
    },
    avatar: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    color: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    speak: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false
    },
    speakchance: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        allowNull: false
    },
    videoinfo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
}, {
    timestamps: true
});