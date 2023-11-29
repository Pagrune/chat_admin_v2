const mysql = require('mysql2/promise');

// update conv

async function updateConv(room) {
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

        const connection = await pool.getConnection();

        try {
            // Exécuter la requête d'update
            const [rows, fields] = await connection.execute('UPDATE conv SET conv_status = 1 WHERE id_conv = ?', [room]);

            // Afficher que la mise à jour a fonctionné
            console.log(rows);

            return rows;
        } finally {
            // Libérer la connexion dans tous les cas (même en cas d'erreur)
            connection.release();
        }
    } catch (error) {
        // Gérer les erreurs
        console.error('Error updating conv:', error);
        throw error; // Réexécutez l'erreur pour la capturer à un niveau supérieur si nécessaire
    }
}

module.exports = updateConv;