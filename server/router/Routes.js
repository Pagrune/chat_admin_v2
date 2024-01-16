const express = require('express');
const router = express.Router();
const mysql = require('mysql');


 // MySQL Connection
 const connection = mysql.createConnection({
    host: process.env.BDD_HOST,
    user: process.env.BDD_USER,
    password: process.env.BDD_PWD,
    database: process.env.BDD_DB
  });

  connection.connect();


router.get('/', (req, res) => {
  res.send('Hello world');
  console.log(req.cookies);
});

router.get('/sujet', (req, res) => {
    connection.query('SELECT * FROM sujet', (error, results, fields) => {
      if (error) throw error;
      res.json(results);
      console.log(req.cookies);
    });
});


// Afficher toutes les conversations qui sont ouvertes
router.get('/rooms', (req, res) => {
    connection.query('SELECT * FROM conv WHERE conv_status = 0', (error, results, fields) => {
      if (error) {
        console.error('Erreur lors de la récupération des rooms depuis la base de données :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rooms' });
      } else {
        res.json(results);
      }
    });
  });

  // Afficher toutes les informations d'une conversation précise
  router.get('/rooms/:roomId', (req, res) => {
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

  // Afficher toutes les conversations qui sont fermées
  router.get('/closed-room', (req, res) => {
    connection.query('SELECT * FROM conv WHERE conv_status = 1', (error, results, fields) => {
      if (error) {
        console.error('Erreur lors de la récupération des rooms depuis la base de données :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rooms' });
      } else {
        res.json(results);
      }
    });
  });

  // Récupérer tous les messages d'une conversation
  router.get('/messages/:roomId', (req, res) => {
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

  // Enregistrer un message dans la base de données
  router.post('/messages', (req, res) => {
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

module.exports = router;