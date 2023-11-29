const mysql = require('mysql2/promise');
const { format } = require('date-fns');

async function showMessage(room) {
    if (room === undefined || room === null) {
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
        const formattedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

        // Requête SQL pour afficher les messages
        const [rows, fields] = await connection.execute('SELECT * FROM message WHERE id_conv = ?', [room]);

        // Vous pouvez maintenant utiliser les données dans 'rows' pour afficher les messages
        console.log(rows);

        // Libérer la connexion
        connection.release();

        return rows;
    } catch (error) {
        console.error('Error in showMessage:', error);
        throw error; // Propager l'erreur pour la gestion ultérieure
    }
}

module.exports = showMessage;
