import React, { useEffect, useState } from 'react';
import MessagesAdmin from './messages-admin';
import SendMessageAdmin from './send-message-admin';
import axios from 'axios';

const AdminChat = ({ username, room, rubrique, titleConv, socket }) => {
  useEffect(() => {
    const closeConvHandler = () => {
      socket.emit('close_conv');
      document.querySelector('#close-conv').style.display = 'none';
    };


    document.querySelector('#close-conv').addEventListener('click', closeConvHandler);

  }, [room, socket]);

  const [Conv, setConv] = useState([]);
  // console.log('la petiterooom =', room);


  useEffect(() => {
    axios.get(`http://localhost:4000/rooms/${room}`)
      .then(response => {
        setConv(response.data);
        console.log('la petite conv =', response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des conversations fermées", error);
      });
  }, []); // Ajout du tableau de dépendances vide

  console.log(Conv);

  return (
    <div>
      <h2>Sujet conversation : {Conv[0].conv_title} </h2>
      <div>
        <MessagesAdmin socket={socket} />
        <SendMessageAdmin socket={socket} username={username} room={room} rubrique={rubrique} />
      </div>
      <button id="close-conv">Fermer la conversation</button>
    </div>
  );
};

export default AdminChat;
