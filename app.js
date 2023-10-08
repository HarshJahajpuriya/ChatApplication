const express = require('express');
const session = require('express-session');
const SocketIO = require('socket.io');

const path = require('path');

const User = require('./models/user');
const Message = require('./models/message');
const sequelize = require('./utils/database');
const { messageRouter } = require('./routers/message');
const { userRouter } = require('./routers/user');

const app = express();

global.rootdir = __dirname;
global.userSocketMap = new Map();

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(session({secret: "chat-secret", resave: false, saveUninitialized: false, 
                cookie:{maxAge: 60000*15}}))

app.use(userRouter);
app.use(messageRouter);

sequelize.sync(
    // { force: true }
).then(() => {
    console.log("Sequelize Models Syncronization Done!")
    let httpServer = app.listen(4500);
    let serverSocket = SocketIO(httpServer);
    serverSocket.on('connection', (socket)=>{
        console.log("Client Connected: ",socket.id,);

        socket.on('disconnect',()=>{
            console.log("Client disconnected: ", socket.id);
        })

        socket.on('message', (message)=>{            
            console.log(message);
            if(!message.content.trim().length) return;
            //2) is reciever exists
            //3) Save message to database  
            let recieverSocket =  userSocketMap.get(message.recieverId)
            if(recieverSocket) recieverSocket.emit("messageRecieved", message);
        });

        socket.on('login', (userId)=>{
            if(userSocketMap.get(userId) === undefined) return;
            userSocketMap.set(userId, socket);
        })
    })
}).catch(err => {
    console.log(err);
});
