const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const login = require('../services/Login');
const { el } = require('date-fns/locale');
 // MySQL Connection
 const connection = mysql.createConnection({
    host: process.env.BDD_HOST,
    user: process.env.BDD_USER,
    password: process.env.BDD_PWD,
    database: process.env.BDD_DB
  });

  connection.connect();


router.get('/chat/', (req, res) => {
  if(login.CheckIsLogin(req.headers.authorization.split(' ')[1])){
    res.send(login.CheckIsLogin(req.headers.authorization.split(' ')[1]));
  }
  else{
    res.status(506).json({ error: 'Vous n\'avez pas les droits pour accéder à cette page' });
  }
  
});

router.get('/chat/sujet', (req, res) => {
  if(login.CheckIsLogin(req.headers.authorization.split(' ')[1])){
    connection.query('SELECT * FROM sujet', (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  }
  else{
    res.status(506).json({ error: 'Vous n\'avez pas les droits pour accéder à cette page' });
  }  
});


// Afficher toutes les conversations qui sont ouvertes
router.get('/chat/rooms', (req, res) => {
  if(login.CheckIsLogin(req.headers.authorization.split(' ')[1])){
    connection.query('SELECT * FROM conv WHERE conv_status = 0', (error, results, fields) => {
      if (error) {
        console.error('Erreur lors de la récupération des rooms depuis la base de données :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rooms' });
      } else {
        res.json(results);
      }
    });
  }
  else{
    res.status(508).json({ error: 'Vous n\'avez pas les droits pour accéder à cette page' });
  }
 
    
  });

  // Afficher toutes les informations d'une conversation précise
  router.get('/chat/rooms/:roomId', (req, res) => {
    if(login.CheckIsLogin(req.headers.authorization.split(' ')[1])){
    const roomId = req.params.roomId;
    connection.query('SELECT * FROM conv WHERE id_conv = ?', [roomId], (error, results, fields) => {
      if (error) {
        console.error('Erreur lors de la récupération des rooms depuis la base de données :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rooms' });
      } else {
        res.json(results);
      }
    });
  } else{
    res.status(508).json({ error: 'Vous n\'avez pas les droits pour accéder à cette page' });
  }
  });

  // Afficher toutes les conversations qui sont fermées
  router.get('/chat/closed-room', (req, res) => {
    if(login.CheckIsLogin(req.headers.authorization.split(' ')[1])){
    connection.query('SELECT * FROM conv WHERE conv_status = 1', (error, results, fields) => {
      if (error) {
        console.error('Erreur lors de la récupération des rooms depuis la base de données :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rooms' });
      } else {
        res.json(results);
      }
    });
    }
    else{
      res.status(508).json({ error: 'Vous n\'avez pas les droits pour accéder à cette page' });
    }
  });

  // Récupérer tous les messages d'une conversation
  router.get('/chat/messages/:roomId', (req, res) => {
    if(login.CheckIsLogin(req.headers.authorization.split(' ')[1])){
    const roomId = req.params.roomId;
    connection.query('SELECT * FROM message WHERE id_conv = ?', [roomId], (error, results, fields) => {
      if (error) {
        console.error('Erreur lors de la récupération des messages depuis la base de données :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
      } else {
        res.json(results);
      } 
    });
  } else{
      res.status(508).json({ error: 'Vous n\'avez pas les droits pour accéder à cette page' });
    }
    
  });

  // Enregistrer un message dans la base de données
  router.post('/chat/messages', (req, res) => {
    if(login.CheckIsLogin(req.headers.authorization.split(' ')[1])){
    const { roomId, message } = req.body;
    connection.query('INSERT INTO message (id_conv, message_content) VALUES (?, ?)', [roomId, message], (error, results, fields) => {
      if (error) {
        console.error('Erreur lors de l\'enregistrement du message dans la base de données :', error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement du message' });
      } else {
        res.json({ message: 'Message enregistré avec succès' });
      }
    });    
  }
  else{
    res.status(508).json({ error: 'Vous n\'avez pas les droits pour accéder à cette page' });
  }
});

module.exports = router;