import React, { useEffect, useState } from 'react';
import MessagesAdmin from './messages-admin';
import SendMessageAdmin from './send-message-admin';
import axios from 'axios';
import Header from './header-admin';
import { set } from 'date-fns';

const AdminChat = ({ username, room, rubrique, titleConv, socket }) => {
  const [convData, setConvData] = useState([]);


  console.log('room =' + room);
  const closeConvHandler = () => {
    socket.emit('close_conv');
    console.log('close conv');
    setConvData([]); // Efface les données de la conversation pour déclencher le rendu de chargement
  };

  useEffect(() => {
    const closeConvButton = document.querySelector('#close-conv');
    if (closeConvButton) {
      closeConvButton.addEventListener('click', closeConvHandler);
    }

    return () => {
      if (closeConvButton) {
        closeConvButton.removeEventListener('click', closeConvHandler);
      }
    };
  }, [closeConvHandler]);

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
      <div className='admin-body'>
        <Header />
        <div className='container'>
          <div className='flex'>
            <div className='flex title'>
              <div className='circle green'></div>
              <h2>Sujet conversation : {Conv[0].conv_title} </h2>
              
            </div>
            <button id="close-conv">Fermer la conversation</button>
          </div>
          
          <div>
            <MessagesAdmin socket={socket} room={room} />
            <SendMessageAdmin socket={socket} username={username} room={room} rubrique={rubrique} />
          </div>
          
        </div>
      </div>
    );
  }
};

export default AdminChat;
