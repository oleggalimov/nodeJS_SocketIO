const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const socketIO = require('socket.io');
const http = require('http');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');



let app = express();
let server = http.createServer(app);
let users = new Users ();

let IO = socketIO(server);
app.use(express.static(publicPath));

server.listen(port, ()=>{console.log(`Started on ${port}`)});
// let users = new Map();
IO.on('connection', (socket)=>{
    // console.log('new User connected');
    // IO.emit('ServiceMessage', "New user has join!");//broadcast to all
    //console.log("New user opened browser");
    // socket.broadcast.emit('ServiceMessage', "New user has join!");
    socket.on ('join', (params, callback)=>{
      if (!isRealString(params.name)||!isRealString(params.room)) {
        return callback('Name and room are required!');
      };
    //   socket.to('Room name').emit(); //сообщить всем в комнате
    //   socket.broadcast.to().emit(); //сообщить всем кроме источника 
      
    
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);
      IO.to(params.room).emit('updateUserList', users.getUserList(params.room));
      socket.emit('ServiceMessage', `Welcome, ${params.name}!`);//сообщить только источнику
      //IO.emit('ServiceMessage', `User "${user}" has join!`);//broadcast to all
        //save user in map
        // users.set(socket.id,user);
        //console.log(users);
        socket.broadcast.to(params.room).emit('ServiceMessage', `User "${params.name}" has join!`);//broadcast to all except current user
      callback();

      //socket.leave();  
    } );
    // socket.on('newUser', (user)=>{
    //     //IO.emit('ServiceMessage', `User "${user}" has join!`);//broadcast to all
    //     //save user in map
    //     users.set(socket.id,user);
    //     //console.log(users);
    //     socket.broadcast.emit('ServiceMessage', `User "${user}" has join!`);//broadcast to all except current user
    // });
    socket.on('sendMessage', (message,callback)=>{
        let user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            IO.to(user.roomName).emit('message',user.userName,message.text,message.date);
        }
        console.log(message);
        
        callback();
    });
    socket.on('disconnect',()=>{
        // console.log('user is disconnected')
        
        let user = users.removeUser(socket.id);
        if (user) {
            IO.to(user.roomName).emit('updateUserList',users.getUserList(user.roomName) );
            IO.to(user.roomName).emit('ServiceMessage', `User ${user.userName} leave the chat`);
        }
    });
});



