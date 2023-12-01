const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const FlattenedDataModel = sequelize.define('FlattenedDataModel', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gr: {
        type: DataTypes.FLOAT,
    },
    mk: {
        type: DataTypes.STRING,
    },
    tm: {
        type: DataTypes.STRING,
    },
    pt: {
        type: DataTypes.STRING,
    },
    tpt: {
        type: DataTypes.STRING,
    },
    atmpt: {
        type: DataTypes.STRING,
    },
    pssd: {
        type: DataTypes.STRING,
    },
    tttm: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },
    userUsername: {
        type: DataTypes.STRING,
    },
});

module.exports = FlattenedDataModel;
