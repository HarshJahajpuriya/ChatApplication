const Sequelize = require('sequelize');
const sequelize = new Sequelize('chatdb','chatu','chatp',{
    dialect: 'mysql',
    host: 'localhost'
});
module.exports = sequelize;