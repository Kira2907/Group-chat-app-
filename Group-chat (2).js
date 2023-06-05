const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const userRoutes = require('./Routes/chat');

const app = express();
const server = http.createServer(app); 
const io = socketIO(server);

app.use(bodyParser.json());
app.use(cors());

app.set('io', io); 

app.use('/', userRoutes);

server.listen(4000);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('newMessage', (data) => {
    console.log('New message:', data);
    socket.broadcast.emit('newMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});