import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header-admin';

const AdminConvClosed = ({ username, setUsername, token, room, setRoom, rubrique, setRubrique, titleConv, setTitleConv, socket }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [closedRooms, setClosedRooms] = useState([]);
  // const [room, setRoom] = useState('');
  const [sujets, setSujets] = useState([]);
  const [selectedSujet, setSelectedSujet] = useState("");

  useEffect(() => {
    axios.get(`https://serverchat.anthony-kalbe.fr/closed-room`, { headers: { Authorization: 'Bearer ' + token }})
      .then(response => {
        setClosedRooms(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des conversations fermées", error);
      });
  }, []); // Ajout du tableau de dépendances vide

  useEffect(() => {
    axios.get('https://serverchat.anthony-kalbe.fr/rooms', {headers : { Authorization: 'Bearer ' + token }})
      .then(response => setRooms(response.data))
      .catch(error => console.error('Erreur lors de la récupération des rooms :', error));
  }, []); // Ajout du tableau de dépendances vide

  useEffect(() => {
    axios.get('https://serverchat.anthony-kalbe.fr/sujet', {headers : { Authorization: 'Bearer ' + token }})
        .then(response => {
            setSujets(response.data);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des sujets:", error);
        });
  }, []);

  const handleRoomClosedClick = (roomId, convTitle, convStatus) => {
    socket.emit('room_closed_clicked', { roomId, convTitle, convStatus });
    navigate('/fchat/admin/closed-id', { replace: true });

  };

  const handleSujetClick = (sujetId) => {
    // Si le même sujet est cliqué à nouveau, désélectionne
    setSelectedSujet((prevSelected) => (prevSelected === sujetId ? "" : sujetId));
  };

  return (
    <div className='admin-body'>
      <Header token={token}/>
      <div className='container'>
          <h1>Conversations fermées</h1>
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
            {selectedSujet !== "" ? (
              closedRooms.filter(closedRoom => closedRoom.id_sujet === selectedSujet).map(closedRoom => (
                <div key={closedRoom.id_conv} onClick={() => handleRoomClosedClick(closedRoom.id_conv, closedRoom.conv_title, closedRoom.conv_status)}>
                  {closedRoom.conv_title}
                </div>
              ))
            ) : (
              closedRooms.map(closedRoom => (
                <div key={closedRoom.id_conv} onClick={() => handleRoomClosedClick(closedRoom.id_conv, closedRoom.conv_title, closedRoom.conv_status)}>
                  {closedRoom.conv_title}
                </div>
              ))
            )
            }
          </div>
      </div>
    </div>
  );
};

export default AdminConvClosed;
