const { database, DataTypes } = require('../sequelize/database');

module.exports = database.define('guilds', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    members: {
        type: DataTypes.STRING,
        get() { return this.getDataValue('members').split(';'); },
        set(val) { this.setDataValue('members', val.join(';')); }
    },
    prefix: {
        type: DataTypes.STRING,
        defaultValue: 'm.',
        allowNull: false
    },
    autorole: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    givenrole: {
        type: DataTypes.STRING
    },
    botautorole: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    givenbotrole: {
        type: DataTypes.STRING
    },
    avatar: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    bulkdelete: {
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
        allowNull: false
    },
    randomspeak: { // TODO Add toggle
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    videoinfo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    timestamps: true
});
