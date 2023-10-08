const {DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const Message = sequelize.define('message',{
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING(400),
        allowNull: false,
    },
    isArrivedAtServer: {
        field: "is_arrived_at_server",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isDelivered: {
        field: "is_delivered",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isSeen: {
        field: "is_seen",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isDeletedBySender: {
        field: "is_deleted_by_sender",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isDeletedByReciever: {
        field: "is_deleted_by_reciever",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    updatedAt: false
})

module.exports = Message;