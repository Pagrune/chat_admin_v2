import { useState, useEffect } from 'react';
import axios from 'axios';

const MessagesReconnect = ({ socket, room, token }) => {
  const [messagesReceived, setMessagesReceived] = useState([]);
  const [messagesDB, setMessagesDB] = useState([]);

  console.log('room = '+room);  

  // Charger les messages de la base de données
  useEffect(() => {
    axios.get(`https://anthony-kalbe.fr/chat/messages/${room}`, { 
      headers: { Authorization: 'Bearer ' + token }
    })
    .then((res) => {
      setMessagesDB(res.data);
      console.log('hello' + res.data);
    })
    .catch((err) => console.log(err));
  }, []); // Ajoutez room et token comme dépendances

  // Gérer la réception des nouveaux messages
  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessagesReceived((prevState) => [
        ...prevState,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    };

    socket.on('receive_message', receiveMessageHandler);

    // Nettoyage : enlever l'écouteur d'événements à la désinscription du composant
    return () => socket.off('receive_message', receiveMessageHandler);
  }, [socket]);

  // Formater la date
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className='block reconnect'>
       <div className="vieux_messages">
        {messagesDB.map((msg, i) => (
            msg.id_user == '99' ? (
            <div key={`old-msg-${i}`} className='message-admin'>
                <div className='flex align-right'>
                <span>{formatDateFromTimestamp(msg.message_date)}</span>
                </div>
                <div>
                <p className='msg admin'>{msg.message_content}</p>
                </div>
                <br />
            </div>
            ) : (
            <div key={`old-msg-${i}`} className='message-client'>
                <div className='flex'>
                    <span>{msg.id_user}</span>
                    <span>{formatDateFromTimestamp(msg.message_date)}</span>
                    </div>
                    <div>
                    <p className="msg client">{msg.message_content}</p>
                    </div>
                <br />
            </div>
            )
        ))}
        </div>
        <div className="nouveaux_messages">
        {messagesReceived.map((msg, i) => (
            msg.username === '99' ? (
                <div key={`new-msg-${i}`} className='message-admin'>
                <div className='flex align-right'>
                    <span>{formatDateFromTimestamp(msg.__createdtime__)}</span>
                </div>
                <div>
                    <p className='msg admin'>{msg.message}</p>
                </div>
                <br />
                </div>
            ) : (
                <div className='message-client'>
                <div className='flex'>
                    <span>{msg.username}</span>
                    <span>{formatDateFromTimestamp(msg.__createdtime__)}</span>
                </div>
                <div>
                    <p className="msg client">{msg.message}</p>
                </div>
                <br />
                </div>
            )

        ))}
        </div>
    </div>
  );
};

export default MessagesReconnect;
