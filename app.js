const express=require('express');
const path = require('path');
const port=process.env.PORT || 3000;
const app=express();

const Path = path.join(__dirname, 'public'); 
//is important because it specifies the directory from which the server should serve static files all html and css files should be in this directory
app.use(express.static(Path));

const server=app.listen(port,()=>{
    console.log("Running on port")
})

const io=require('socket.io')(server);
//This line imports the Socket.IO library and initializes it with the HTTP server created by Express. Socket.IO is used for real-time, bidirectional communication between clients and the server.
io.on("connection",connected)  //handle events on the server side

const socketno=new Set()   //used to store all the unique socket ids
function connected(socket){  //function is called whenever socket is connected it handles various events related to socket connection
    socketno.add(socket.id)
    io.emit("clients-total",socketno.size)
    //emit is used to emit an event to the clinet side with data from the server side

//When the client emits an event with a specific name, the server can listen for that event using socket.on and execute a callback function to handle it.
    socket.on('disconnect',()=>{
        socketno.delete(socket.id)
        io.emit("clients-total",socketno.size)
    })

    socket.on('message',(data)=>{
        socket.broadcast.emit('chat-message',data)
    })
    //broadcast sends the message to all the clints except the one that initiated it

    socket.on('status',(data)=>{
        socket.broadcast.emit('status',data)
    })
}
io.on("error", (error) => {
    console.error("Socket.IO error:", error);
});

