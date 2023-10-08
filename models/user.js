const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database')
const Message = require('./message');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.CHAR(20),
        allowNull: false
    },
    phone: {
        type: DataTypes.CHAR(10),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.CHAR(60),
        allowNull: false
    },
    imgUrl: {
        field: "img_url" ,
        type: DataTypes.CHAR(56)
    } ,
    status: DataTypes.STRING
}, {
    timestamps: false
});

User.hasMany(Message,{
    as: 'sentMessages',
    foreignKey: 'senderId',
});
User.hasMany(Message,{
    as: 'recievedMessages',
    foreignKey: 'recieverId'
});

module.exports = User;