import React, { useEffect, useState } from 'react';
import Header from './header-admin';
import axios from 'axios';




const AdminClosedChat = ({ socket, token }) => {
  const [roomId, setRoomId] = useState('');
  const [convTitle, setConvTitle] = useState('');
  const [convStatus, setConvStatus] = useState('');
  const [messagesDB, setMessagesDB] = useState([]);

  useEffect(() => {
    const handleRoomClosedClicked = (data) => {
      const { roomId, convTitle, convStatus } = data;
      setRoomId(roomId);
      setConvTitle(convTitle);
      setConvStatus(convStatus);

      // Effectuez la requête API après avoir récupéré les données depuis le socket
      axios
        .get(`https://anthony-kalbe.fr/chat/messages/${roomId}`, { headers: { Authorization: 'Bearer ' + token }})
        .then((res) => {
          console.log('messages conversation ' + res.data);
          setMessagesDB(res.data);
        })
        .catch((err) => console.log(err));
    };

    socket.on('room_closed_clicked', handleRoomClosedClicked);

    return () => {
      // Nettoyez l'écouteur lors du démontage du composant
      socket.off('room_closed_clicked', handleRoomClosedClicked);
    };
  }, [socket]);

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className='admin-body'>
      <Header token={token}/>
      <div className='container'>
      <h2>Sujet conversation : {convTitle}</h2>
      <div className="vieux_messages">
      {messagesDB.map((msg, i) => (
        msg.id_user == '99' ? (
          <div key={i} className='message-admin'>
            <div className='flex align-right'>
              <span>{formatDateFromTimestamp(msg.message_date)}</span>
            </div>
            <div>
              <p className='msg admin'>{msg.message_content}</p>
            </div>
            <br />
          </div>
        ) : (
          <div key={i} className='message-client'>
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
    </div>
    </div>
  );
};

export default AdminClosedChat;
