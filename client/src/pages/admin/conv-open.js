import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header-admin';
import { set } from 'date-fns';

const AdminConvOpen = ({ username, setUsername, room, setRoom, rubrique, setRubrique, titleConv, setTitleConv, socket }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [closedRooms, setClosedRooms] = useState([]);
  // const [room, setRoom] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:4000/closed-room`)
      .then(response => {
        setClosedRooms(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des conversations fermées", error);
      });
  }, []); // Ajout du tableau de dépendances vide

  useEffect(() => {
    axios.get('http://localhost:4000/rooms')
      .then(response => setRooms(response.data))
      .catch(error => console.error('Erreur lors de la récupération des rooms :', error));
  }, []); // Ajout du tableau de dépendances vide

  const handleRoomClick = (roomId) => {
    const titleConv = room.conv_title;
    const username = '99';
    const rubrique = room.id_sujet;
    // const status = room.conv_status;

      if (username !== '' && rubrique !== '' && titleConv !== '' && roomId !== '') {
        socket.emit('join_room_admin', { username, rubrique, titleConv, roomId });
        setRoom(roomId);
      }
    
      // Redirect to /admin/chat
      navigate('/admin/chat', { replace: true });  
  };

  return (
    <div className='admin-body'>
        <Header />
        <div className='container'>
          <h1>Conversations en cours</h1>

            {rooms.map(room => (
              <div key={room.id_conv} onClick={() => handleRoomClick(room.id_conv, room.conv_title, room.conv_status)}>
                {room.conv_title}
              </div>
            ))}
        </div>
    </div>
  );
};

export default AdminConvOpen;