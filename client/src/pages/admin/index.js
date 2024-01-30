  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import Header from './header-admin';   
  const AdminPage = ({ username, setUsername,token, room, setRoom, rubrique, setRubrique, titleConv, setTitleConv, socket }) => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [closedRooms, setClosedRooms] = useState([]);
    // const [room, setRoom] = useState('');

    useEffect(() => {
      axios.get(`https://serverchat.anthony-kalbe.fr/closed-room`, { headers: { Authorization: 'Bearer ' + token }})
        .then(response => {
          setClosedRooms(response.data);
        })
        .catch(error => {
         return
        });
    }, [token]); // Ajout du tableau de dépendances vide

    useEffect(() => {
      axios.get('https://serverchat.anthony-kalbe.fr/rooms', { headers: { Authorization: 'Bearer ' + token }})
        .then(response => setRooms(response.data))
        .catch(error => {return});
    }, [token]); // Ajout du tableau de dépendances vide

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

    const handleRoomClosedClick = (roomId, convTitle, convStatus) => {
      socket.emit('room_closed_clicked', { roomId, convTitle, convStatus });
      navigate('/admin/closed-id', { replace: true });

    };

    return (
      <div className='admin-body'>
        <Header token={token}/>
        <div className='container'>
          <h1>Bienvenue sur la page principale d’administration du chat </h1>
          <div>
            <p>Voir les conversations :</p>
            <div className='admin-home-button'>
              <button onClick={() => navigate('/fchat/admin/conv-open', { replace: true })}>Conversations en cours</button>
              <button onClick={() => navigate('/fchat/admin/conv-closed', { replace: true })}>Conversations fermées</button>
            </div>
            
          </div>
        </div>
      </div>
    );
  };

  export default AdminPage;
