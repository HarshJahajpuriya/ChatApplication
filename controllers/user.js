const Message = require("../models/message");
const User = require("../models/user");
const sequelize = require("../utils/database");
const bcrypt = require('bcryptjs');

exports.createUser = (req, res, next) => {
    let user = req.body;
    if (!(user.name && user.name.length >= 2 && user.name.length <= 20
        && user.phone && (/^[5-9][0-9]{9}$/).test(user.phone)
        && user.password && user.password.length <= 8)) {
        res.status(400).json({ message: "Invalid Input" });
        return
    }
    console.log(user.password + " : " + user.password.length)
    user.password =  bcrypt.hashSync(user.password,12);
    console.log(user.password)
    User.create(user).then(user => {
        console.log('user : ' + user)
        req.session.user = user;
        userSocketMap.set(user.id, null);
        let rUser = user.toJSON(); 
        rUser.contacts = []; //problemetic - will not be included in stringified version
        res.json(rUser);
    }).catch(err => {
        if (err.original.code == 'ER_DUP_ENTRY') {
            res.status(409).json({ message: "Mobile Number already registered." })
            return;
        }
        // console.log(err)
        res.status(500).json({ message: "Internal Server Error" });
    });
} 

exports.loginUser = async (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password;
    if(phone.length != 10 || !/(^[0-9]*$)/.test(phone) || !/(^[6-9])/.test(phone) || password.length < 2) {
        res.status(500).json({message : 'Invalid Input'});
        return;
    }
    try {
        let user = await User.findOne({ where: { phone: phone}, raw: true });
        // console.log(password, user.password)
        if (user && bcrypt.compareSync(password, user.password)){
            req.session.user = Object.assign({}, user);
            //await req.session.save()
            userSocketMap.set(user.id, null);
            // user.contacts = [];
            user.contacts = await sequelize.query(`select * from users where id in(
                select distinct recieverId as contactId from messages where senderId = ${user.id} union
                select distinct senderId as contactId from messages where recieverId = ${user.id}
            )`, { model: User, mapToModel: true, raw: true })

            for (let contact of user.contacts) {
                contact.password = undefined;
                // contact.messages = [];
                contact.messages = await sequelize.query(`select * from messages where
                    senderId = ${contact.id} and recieverId = ${user.id} or
                    recieverId = ${contact.id} and senderId = ${user.id}
                    order by createdAt DESC limit 10`,
                    { model: Message, mapToModel: true, raw: true }
                )
            }
            res.json(user);
        } else
            res.status(401).json({ message: "Invalid Credentials" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.isUserLoggedIn = (req, res, next) => {
    if (req.session.user) isLoggedIn = true;
    else isLoggedIn = false;
    res.json({ isLoggedIn: isLoggedIn });
}

exports.getLoggedInUser = async (req, res, next) => {
    let user;
    user = Object.assign({}, req.session.user);
    try {
        user.contacts = await sequelize.query(`select * from users where id in(
            select distinct recieverId as contactId from messages where senderId = ${user.id} union
            select distinct senderId as contactId from messages where recieverId = ${user.id}
        )`, { model: User, mapToModel: true, raw: true })

        for (let contact of user.contacts) {
            contact.password = undefined;
            // contact.messages = [];
            contact.messages = await sequelize.query(`select * from messages where
                senderId = ${contact.id} and recieverId = ${user.id} or
                recieverId = ${contact.id} and senderId = ${user.id}
                order by createdAt DESC limit 10`,
                { model: Message, mapToModel: true, raw: true }
            )
        }
        res.json(user);
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.logoutUser = (req, res, next) => {
    userSocketMap.delete(req.session.user.id);
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" })
        }
        else res.json({ isLoggedIn: false });
    })
}

exports.getUserByPhone = async (req, res, next) => {
    let user;
    try {
        user = await User.findOne({ where: { phone: req.params.phone } })
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
    if (user) {
        user.password = undefined;
        res.json(user);
    } else
        res.status(404).json({ message: "No user is registered with this mobile number" });
}