const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('paymentsystem', 'root', 'YourRootPassword', {
//   host: 'localhost',
//   dialect: 'mysql', 
// });

const sequelize = new Sequelize('marks', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql', 
});

module.exports = sequelize;