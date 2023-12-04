const { DataTypes } = require('sequelize');
const sequelize = require('../config'); // Update with your database configuration
// const AllStudents = require('./All_Students');

const FlattenedDataModel = sequelize.define('FlattenedDataModel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subject_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userUsername: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    assignments: {
        type: DataTypes.JSON, // Assuming assignments is an array of objects
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
});

module.exports = FlattenedDataModel;

