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

app.use(cors()); // Add cors middleware

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // MySQL Connection
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chatv2'
  });

  connection.connect();
 

// routes
// app.use("/chat/api/", require("./router/Routes")); 
app.get('/', (req, res) => {
    res.send('Hello world');
  });


app.get('/sujet', (req, res) => {
    connection.query('SELECT * FROM sujet', (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
});

// app.get('/login', (req, res) => {
//   // get cookies
//   console.log(req.cookies);
// });


app.get('/rooms', (req, res) => {
  connection.query('SELECT * FROM conv WHERE conv_status = 0', (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de la récupération des rooms depuis la base de données :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des rooms' });
    } else {
      res.json(results);
    }
  });
});

app.get('/rooms/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  connection.query('SELECT * FROM conv WHERE id_conv = ?', [roomId], (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de la récupération des rooms depuis la base de données :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des rooms' });
    } else {
      res.json(results);
    }
  });
});

app.get('/closed-room', (req, res) => {
  connection.query('SELECT * FROM conv WHERE conv_status = 1', (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de la récupération des rooms depuis la base de données :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des rooms' });
    } else {
      res.json(results);
    }
  });
});

app.get('/messages/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  connection.query('SELECT * FROM message WHERE id_conv = ?', [roomId], (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de la récupération des messages depuis la base de données :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    } else {
      res.json(results);
    } 
  });
});

app.post('/messages', (req, res) => {
  const { roomId, message } = req.body;
  connection.query('INSERT INTO message (id_conv, message_content) VALUES (?, ?)', [roomId, message], (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de l\'enregistrement du message dans la base de données :', error);
      res.status(500).json({ error: 'Erreur lors de l\'enregistrement du message' });
    } else {
      res.json({ message: 'Message enregistré avec succès' });
    }
  });
});


const CHAT_BOT = 'ChatBot';

let chatRoom = ''; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room
// Listen for when the client connects via socket.io-client

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on('join_room', async (data) => {
    const { username, rubrique, titleConv  } = data; // Include roomId in the destructuring
    console.log(data);
  
    try {
          // Utilisez 'await' pour attendre que la conversation soit créée
          const room = await CreateConv(rubrique, titleConv);

          // console.log(room);
          socket.join(room); // Join the user to a socket room

          let __createdtime__ = Date.now();
          // Send message to all users currently in the room, apart from the user that just joined
          socket.to(room).emit('receive_message', {
              message: `${username} has joined the chat room`,
              username: CHAT_BOT,
              __createdtime__,
          });
          // Send welcome msg to the user that just joined chat only
          socket.emit('receive_message', {
              message: `Welcome ${username}`,
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
            const { message, username, __createdtime__ } = data;
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

  socket.on('join_room_admin', (data) => {
    const { username, rubrique, titleConv, roomId } = data; // Include roomId in the destructuring
    console.log(data);

    socket.join(roomId); // Join the user to a socket room
  
        let __createdtime__ = Date.now();



        socket.to(roomId).emit('receive_message', {
          message: `Un conseiller a rejoins le chat`,
          username: CHAT_BOT,
          __createdtime__,
      });
        // Send welcome msg to the user that just joined chat only
        socket.emit('receive_message', {
          message: `Welcome ${username}`,
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
         allUsers.push({ id: socket.id, username, room, rubrique });
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
           enregistrerMessageAdmin(message, username, __createdtime__, room, admin) // Save the message in the database
             .then((response) => console.log(response))
             .catch((err) => console.log(err));
         });
  });
 
  
});


server.listen(4000, () => 'Server is running on port 4000');
