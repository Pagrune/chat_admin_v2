const mysql = require('mysql2/promise');
const { format } = require('date-fns'); // Importez la fonction format de la bibliothèque date-fns

async function enregistrerMessage(message, username, __createdtime__, room) {
  if (message === undefined || username === undefined || message === null || username === null || __createdtime__ === null || __createdtime__ === undefined || room === null || room === undefined) {
    throw new Error('Invalid parameters: All parameters must have valid values.');
  }
  try {
    // Créer un pool de connexions MySQL
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'chatv2',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Obtenir une connexion du pool
    const connection = await pool.getConnection();

    // Formater la date au format MySQL (YYYY-MM-DD HH:MM:SS)
    const formattedDate = format(new Date(__createdtime__), 'yyyy-MM-dd HH:mm:ss');

    // Exécuter la requête d'insertion avec le timestamp formaté
    const [rows, fields] = await connection.execute('INSERT INTO message (id_user, id_conv, message_content, message_date) VALUES (?, ?, ?, ?)', [username, room, message, formattedDate]);

    // Libérer la connexion
    connection.release();

    // Retourner l'ID du message nouvellement inséré
    return rows.insertId;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du message :', error);
    throw error;
  }
}

module.exports = enregistrerMessage;
