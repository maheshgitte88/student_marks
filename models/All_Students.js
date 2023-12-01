// StudentModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const All_Students = sequelize.define('All_Students', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
      },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    registration_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user_username: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contact_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // organization_ids: {
    //     type: DataTypes.ARRAY(DataTypes.STRING),
    //     allowNull: false,
    // },
    date: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});
module.exports = All_Students;
