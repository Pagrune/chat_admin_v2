// import styles from './styles.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = ({ username, setUsername, rubrique, setRubrique, titleConv, setTitleConv, socket}) => {

    const navigate = useNavigate();

    const [sujets, setSujets] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:4000/sujet')
            .then(response => {
                setSujets(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des sujets:", error);
            });
    }, []);

    const joinRoom = () => {
        if (username !== '' && rubrique !== '' && titleConv !== '') {
          socket.emit('join_room', { username, rubrique , titleConv });
        }

        // Redirect to /chat
        navigate('/chat', { replace: true });
      };

  return (
    <div>
      <div>
        <h1>{`<>DevRooms</>`}</h1>
        <input onChange={(e) => setUsername('1')} placeholder='Username...' />

        <select onChange={(e) => setRubrique(e.target.value)}>
            <option>-- Sélectionnez un sujet --</option>
            {sujets.map(sujet => (
                <option key={sujet.id_sujet} value={sujet.id_sujet}>{sujet.sujet_rubrique}</option>
            ))}

        </select>

        <input onChange={(e) => setTitleConv(e.target.value)} placeholder='Sujet de votre demande' />

        <button
          className='btn btn-secondary'
          style={{ width: '100%' }}
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;