const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const socketIO = require('socket.io');
const http = require('http');
let app = express();
let server = http.createServer(app);


let IO = socketIO(server);
app.use(express.static(publicPath));

server.listen(port, ()=>{console.log(`Started on ${port}`)});
let users = new Map();
IO.on('connection', (socket)=>{
    // console.log('new User connected');
    // IO.emit('ServiceMessage', "New user has join!");//broadcast to all
    console.log("New user opened browser");
    // socket.broadcast.emit('ServiceMessage', "New user has join!");
    socket.on('newUser', (user)=>{
        //IO.emit('ServiceMessage', `User "${user}" has join!`);//broadcast to all
        //save user in map
        users.set(socket.id,user);
        //console.log(users);
        socket.broadcast.emit('ServiceMessage', `User "${user}" has join!`);//broadcast to all except current user
    });
    socket.on('sendMessage', (message,callback)=>{
        console.log(message);
        IO.emit('message',message);
        callback();
    });
    socket.on('disconnect',()=>{
        // console.log('user is disconnected')
        let userName = users.get(socket.id);
        users.delete(socket.id);
        socket.broadcast.emit('ServiceMessage', `User ${userName} leave the chat`);
    });
});



