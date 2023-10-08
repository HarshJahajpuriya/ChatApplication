const Message = require("../models/message");

exports.createMessage = (req, res, next) => {
    let message = {
        senderId: req.session.user.id,
        recieverId: req.body.recieverId,
        content: req.body.content,
        isArrivedAtServer: true,
    }
    Message.create(message).then((message) => {
            res.json(message);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    })
}