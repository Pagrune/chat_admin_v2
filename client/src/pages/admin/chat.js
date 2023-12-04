import React, { useEffect, useState } from 'react';
import MessagesAdmin from './messages-admin';
import SendMessageAdmin from './send-message-admin';
import axios from 'axios';

const AdminChat = ({ username, room, rubrique, titleConv, socket }) => {
  console.log('room =' + room);

  useEffect(() => {
    const closeConvHandler = () => {
      socket.emit('close_conv');
      document.querySelector('#close-conv').style.display = 'none';
    };

    const closeConvButton = document.querySelector('#close-conv');
    if (closeConvButton) {
      closeConvButton.addEventListener('click', closeConvHandler);
    }

    return () => {
      if (closeConvButton) {
        closeConvButton.removeEventListener('click', closeConvHandler);
      }
    };
  }, [room, socket]);

  const [Conv, setConv] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:4000/rooms/${room}`)
      .then(response => {
        setConv(response.data);
        console.log('la petite conv =', response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des conversations fermées", error);
      });
  }, [room]); // Ajout de room comme dépendance

  console.log(Conv);

  //loader
  if (Conv.length === 0) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h2>Sujet conversation : {Conv[0].conv_title} </h2>
        <div>
          <MessagesAdmin socket={socket} room={room} />
          <SendMessageAdmin socket={socket} username={username} room={room} rubrique={rubrique} />
        </div>
        <button id="close-conv">Fermer la conversation</button>
      </div>
    );
  }
};

export default AdminChat;
