const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors : { origin: '*' }});
const path = require("path");


// For serving static files
// Here in " express.static('static') " 'static' inside the paranthesis is a directory name and the other one is the one which appears in the url bar

app.use("/static", express.static("static"));
app.use(express.urlencoded());

// set the template engine as pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// pug endpoint


app.get('/',(req,res) => {
    res.render('index');
})

server.listen(3001,() => {
    console.log("Server running : http://localhost:3001");
})

const users = {};

io.on('connect',(socket)=>{
    socket.on('new-user-joined',(name)=>{
        users[socket.id] = name;
        console.log(name,"joined the chat");
        socket.broadcast.emit("user-joined",name);
    })

    socket.on("send",message => {
        socket.broadcast.emit("receive",{message : message , name : users[socket.id]});
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
})