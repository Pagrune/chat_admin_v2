import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header-admin';
import { set } from 'date-fns';

const AdminConvClosed = ({ username, setUsername, room, setRoom, rubrique, setRubrique, titleConv, setTitleConv, socket }) => {
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


  const handleRoomClosedClick = (roomId, convTitle, convStatus) => {
    socket.emit('room_closed_clicked', { roomId, convTitle, convStatus });
    navigate('/admin/closed-id', { replace: true });

  };

  return (
    <div className='admin-body'>
      <Header />
      <div className='container'>
          <h1>Conversations fermées</h1>
            {closedRooms.map(closedRoom => (
              <div key={closedRoom.id_conv} onClick={() => handleRoomClosedClick(closedRoom.id_conv, closedRoom.conv_title, closedRoom.conv_status)}>
                {closedRoom.conv_title}
              </div>
            ))}
      </div>
    </div>
  );
};

export default AdminConvClosed;
