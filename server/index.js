require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const enregistrerMessage = require('./services/Enregistrer-message');
const enregistrerMessageAdmin = require('./services/Enregistrer-message-admin');
const mysql = require('mysql');
const CreateConv = require('./services/Create-conv');
const updateConv = require('./services/Update-conv');
const showMessage = require('./services/Show-message');
const login = require('./services/Login');

app.use(cors()); // Add cors middleware

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

// routes
app.use("/", require("./router/Routes")); 





// app.get('/login', (req, res) => {
//   // get cookies
//   console.log(req.cookies);
// });


const CHAT_BOT = 'ChatBot';

let chatRoom = ''; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room
// Listen for when the client connects via socket.io-client


// //authentication using header of the socket
io.use((socket, next) => {
  const token = socket.handshake.headers.authorization.split(' ')[1] ? socket.handshake.headers.authorization.split(' ')[1] : null;
  // console.log(token);
  if (login.CheckIsLogin(token)) {
    next();
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on('join_room', async (data) => {
    const { rubrique, titleConv  } = data; // Include roomId in the destructuring
    console.log(data);
    const username = login.getPayloadData(socket.handshake.headers.authorization.split(' ')[1]).id_customer;
    try {
          // Utilisez 'await' pour attendre que la conversation soit créée
          const room = await CreateConv(rubrique, titleConv);

          // console.log(room);
          socket.join(room); // Join the user to a socket room

          socket.emit('room_joined', { room });

          let __createdtime__ = Date.now();
          // Send message to all users currently in the room, apart from the user that just joined
          socket.to(room).emit('receive_message', {
              message: `${username} has joined the chat room`,
              username: CHAT_BOT,
              __createdtime__,
          });
          // Send welcome msg to the user that just joined chat only
          socket.emit('receive_message', {
              message: `Un conseiller va vous répondre dans quelques instants`,
              rubrique: `${rubrique}`,
              username: CHAT_BOT,
              __createdtime__,
          });

          // Save the new user to the room
          chatRoom = room;
          allUsers.push({ id: socket.id, username, room, rubrique });
          chatRoomUsers = allUsers.filter((user) => user.room === room);
          socket.to(room).emit('chatroom_users', chatRoomUsers);
          socket.emit('chatroom_users', chatRoomUsers);

          socket.on('send_message', (data) => {
            const { message, __createdtime__ } = data;
            console.log(data);
            io.in(room).emit('receive_message', { ...data, room }); // Send to all users in the room, including the sender
            enregistrerMessage(message, username, __createdtime__, room) // Save the message in the database
              .then((response) => console.log(response))
              .catch((err) => console.log(err));
          });
        
      } catch (error) {
          console.error('Error creating conversation:', error);
      }
  });

//   socket.on('disconnect_from_all_rooms', () => {
//     socket.rooms.forEach((roomId) => {
//         if (roomId !== socket.id) { // Assurez-vous de ne pas quitter la salle par défaut qui est celle du socket lui-même
//             socket.leave(roomId);
//         }
//     });
//     console.log(`Socket ${socket.id} has left all rooms`);
// });
  socket.on('join_room_admin', (data) => {
    const { rubrique, titleConv, roomId } = data; // Include roomId in the destructuring
    const username = 'admin';
    console.log('salut les pd');

    console.log(roomId);
    socket.join(roomId); // Join the user to a socket room
  
        let __createdtime__ = Date.now();



        socket.to(roomId).emit('receive_message', {
          message: `Un conseiller a rejoins le chat`,
          username: CHAT_BOT,
          __createdtime__,
      });
      
        // console.log(socket);
        //show messages
        socket.emit('show_message', (data) => {
          const { room } = data; // Include roomId in the destructuring
          console.log("salut les gars");
          console.log(room);
          showMessage(room) // 
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
        });

        const room = roomId;
         // Save the new user to the room
         chatRoom = roomId;
        //  allUsers.push({ id: socket.id, username, room, rubrique });
        //  chatRoomUsers = allUsers.filter((user) => user.room === room);
        //  socket.to(room).emit('chatroom_users', chatRoomUsers);
        //  socket.emit('chatroom_users', chatRoomUsers);

        
          // Clear socket send_message event listener
          socket.removeAllListeners('send_message');
          // Join the user to a socket room
         socket.on('send_message', (data) => {
          const { message,username, __createdtime__ } = data;
          const admin ="1";
          console.log('username' + username);
          //broadcast message to all users in the room
          socket.to(room).emit('receive_message', { ...data, room }); // Send to all users in the room, including the sender
          socket.emit('receive_message', { ...data, room }); // Send to all users in the room, including the sender
          enregistrerMessageAdmin(message, username, __createdtime__, room, admin) // Save the message in the database
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
        });

        socket.on('close_conv', () => {
          console.log('salutations' + roomId);
          socket.removeAllListeners('send_message');
          socket.to(room).emit('close_conv');  // Émettre l'événement seulement lorsque vous avez l'intention de fermer la conversation
          updateConv(room)
              .then((response) => console.log(response))
              .catch((err) => console.log(err));
      });

         
  });
 
  socket.on('room_closed_clicked', (data) => {
    socket.emit('room_closed_clicked', data);
    socket.to(data.room).emit('room_closed_clicked', data);
    console.log('Room closed clicked:', data);
  });

  socket.on("reconnect", (data)=>{
    const { token, room } = data;
    console.log("reconnect" + room);
    socket.join(room); // Join the user to a socket room
    socket.on('send_message', (data) => {
      const { message, __createdtime__ } = data;
      console.log(data);
      const username = login.getPayloadData(socket.handshake.headers.authorization.split(' ')[1]).id_customer;
      io.in(room).emit('receive_message', { ...data, room }); // Send to all users in the room, including the sender
      enregistrerMessage(message, username, __createdtime__, room) // Save the message in the database
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    });
  });
  
  socket.on('leave_room', (data) => {
    const { room } = data;
    socket.leave(room);
    console.log(`User ${socket.id} left room ${room}`);
    socket.removeAllListeners('send_message');

  
  });
});


server.listen(4000, () => 'Server is running on port 4000');
