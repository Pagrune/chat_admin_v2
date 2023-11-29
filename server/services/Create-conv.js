const mysql = require('mysql2/promise');

async function CreateConv(rubrique, titleConv) {
  if (titleConv === undefined || rubrique === undefined || rubrique === null || titleConv === null) {
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

    // Exécuter la requête d'insertion
    const [rows, fields] = await connection.execute('INSERT INTO conv (id_sujet, conv_title) VALUES (?, ?)', [rubrique, titleConv]);

    // Retourner l'ID de la conversation nouvellement insérée
    const convId = rows.insertId;
    console.log(convId);

    // Libérer la connexion
    connection.release();

    return convId;
  } catch (error) {
    // Gérer les erreurs (par exemple, imprimer l'erreur)
    console.error('Erreur lors de l\'enregistrement de la conv :', error);
    throw error; // Propager l'erreur pour la gestion ultérieure
  }
}

module.exports = CreateConv;
