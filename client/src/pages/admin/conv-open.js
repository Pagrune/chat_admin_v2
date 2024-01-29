import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header-admin';

const AdminConvOpen = ({ username, setUsername,token, room, setRoom, rubrique, setRubrique, titleConv, setTitleConv, socket }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [sujets, setSujets] = useState([]);
  const [selectedSujet, setSelectedSujet] = useState("");

  useEffect(() => {
    axios.get('http://localhost:4000/rooms', { headers: { Authorization: 'Bearer ' + token }})
      .then(response => setRooms(response.data))
      .catch(error => console.error('Erreur lors de la récupération des rooms :', error));
  }, []); // Ajout du tableau de dépendances vide

  useEffect(() => {
    axios.get('http://localhost:4000/sujet',  { headers: { Authorization: 'Bearer ' + token }})
        .then(response => {
            setSujets(response.data);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des sujets:", error);
        });
}, []);

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

  const handleSujetClick = (sujetId) => {
    // Si le même sujet est cliqué à nouveau, désélectionne
    setSelectedSujet((prevSelected) => (prevSelected === sujetId ? "" : sujetId));
  };


  return (
    <div className='admin-body'>
        <Header token={token}/>
        <div className='container'>
          <h1>Conversations en cours</h1>
          <div className='flex half'>
            <p>Filtrer par :</p>
            {sujets.map(sujet => (
              <button
                key={sujet.id_sujet}
                onClick={() => handleSujetClick(sujet.id_sujet)}
                className={sujet.id_sujet === selectedSujet ? 'selected' : ''}
              >
                {sujet.sujet_rubrique}
              </button>
            ))}
          </div>
          <div className='grid3'>
            {
              selectedSujet !== "" ? (
                rooms.filter(room => room.id_sujet === selectedSujet).map(room => (
                  <div key={room.id_conv} onClick={() => handleRoomClick(room.id_conv, room.conv_title, room.conv_status)}>
                    {room.conv_title}
                  </div>
                ))
              ) : (
                rooms.map(room => (
                  <div key={room.id_conv} onClick={() => handleRoomClick(room.id_conv, room.conv_title, room.conv_status)}>
                    {room.conv_title}
                  </div>
                ))
              )
            }
          </div>
        </div>
    </div>
  );
};

export default AdminConvOpen;