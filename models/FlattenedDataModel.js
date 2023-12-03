const { DataTypes } = require('sequelize');
const sequelize = require('../config');
// const AllStudents = require('./All_Students');

const FlattenedDataModel = sequelize.define('FlattenedDataModel', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    userUsername: {
        type: DataTypes.STRING,
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subject_name: {
        type: DataTypes.STRING,
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
});

// FlattenedDataModel.belongsTo(AllStudents, {
//     foreignKey: 'user_id',
//     onDelete: 'CASCADE',
// });

module.exports = FlattenedDataModel;
