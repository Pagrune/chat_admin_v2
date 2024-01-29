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
const cookieParser = require("cookie-parser");
const login = require('./services/Login');

app.use(cors(
  {
    credentials: true
  }
)); // Add cors middleware


app.use(cookieParser());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
    cookie : true
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



io.on('connection', (socket) => {
  // console.log(`User connected ${socket.id}`);
  console.log(socket.handshake.headers);

  socket.on('join_room', async (data) => {
    const { token, rubrique, titleConv  } = data; // Include roomId in the destructuring
    const username = login.checkIsLogin(token);
    if(username !=false ){

      const user_data = login.getPayloadData(token);
      let user_id = user_data.id_customer
      try {
            // Utilisez 'await' pour attendre que la conversation soit créée
            const room = await CreateConv(rubrique, titleConv);

            // console.log(room);
            socket.join(room); // Join the user to a socket room

            let __createdtime__ = Date.now();
            // Send message to all users currently in the room, apart from the user that just joined
            socket.to(room).emit('receive_message', {
                message: `${user_data.name_customer} has joined the chat room`,
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
            ;
            allUsers.push({ id: socket.id, user_id, room, rubrique });
            chatRoomUsers = allUsers.filter((user) => user.room === room);
            socket.to(room).emit('chatroom_users', chatRoomUsers);
            socket.emit('chatroom_users', chatRoomUsers);

            socket.on('send_message', (data) => {
              const { message, __createdtime__ } = data;
              console.log(data);
              io.in(room).emit('receive_message', { ...data, room }); // Send to all users in the room, including the sender
              enregistrerMessage(message, user_id, __createdtime__, room) // Save the message in the database
                .then((response) => console.log(response))
                .catch((err) => console.log(err));
            });
          
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    }
    else{
      let __createdtime__ = Date.now();
      socket.emit('receive_message', {
        message: `Erreur d'authentification`,
        rubrique: `Erreur d'authentification`,
        username: CHAT_BOT,
       __createdtime__,
    });

    }
  });





  // Admin qui rejoint le chat
  socket.on('join_room_admin', (data) => {
    const { username, rubrique, titleConv, roomId } = data; // Include roomId in the destructuring
    console.log(data);

    socket.join(roomId); // Join the user to a socket room
    let __createdtime__ = Date.now();
  if (login.checkIsLogin(token, true)){

      const user_data = login.getPayloadData(token);
      let user_id = user_data.id_customer

        socket.to(roomId).emit('receive_message', {
          message: `Un conseiller a rejoins le chat`,
          username: CHAT_BOT,
          __createdtime__,
      });
        // Send welcome msg to the user that just joined chat only
        socket.emit('receive_message', {
          message: `Welcome ${user_data.name_customer}`,
          rubrique: `${rubrique}`,
          username: CHAT_BOT,
          __createdtime__,
        });

        //show messages
        socket.emit('show_message', (data) => {
          const { room } = data; // Include roomId in the destructuring
          console.log(data);
          showMessage(room) // 
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
        });

        const room = roomId;
         // Save the new user to the room
         chatRoom = roomId;
         allUsers.push({ id: socket.id, user_id, room, rubrique });
         chatRoomUsers = allUsers.filter((user) => user.room === room);
         socket.to(room).emit('chatroom_users', chatRoomUsers);
         socket.emit('chatroom_users', chatRoomUsers);

         socket.on('close_conv', () => {
          const roomId = room;
          console.log('salutations'+roomId);
          updateConv(room) // Save the message in the database
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
        });

         socket.on('send_message', (data) => {
           const { message, username, __createdtime__ } = data;
           const admin ="1";
           console.log(data);
           io.in(room).emit('receive_message', { ...data, room }); // Send to all users in the room, including the sender
           enregistrerMessageAdmin(message, user_data.name_customer, __createdtime__, room, admin) // Save the message in the database
             .then((response) => console.log(response))
             .catch((err) => console.log(err));
         });
        }
        else{
          socket.emit('receive_message', {
            message: `ERREUR D'AUTHENTIFICATION`,
            rubrique: `Error`,
            username: CHAT_BOT,
            __createdtime__,
          });
        }
  });
 
  socket.on('room_closed_clicked', (data) => {
    socket.emit('room_closed_clicked', data);
    // console.log('Room closed clicked:', data);
  });
  
});


server.listen(4000, () => 'Server is running on port 4000');
