// import styles from './styles.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import icon from '../../img/chat/icon_message.png';


const Home = ({ token,username, setUsername, rubrique, setRubrique, titleConv, setTitleConv, socket}) => {

    const navigate = useNavigate();

    const [sujets, setSujets] = useState([]);
    const [isLoading, setisLoading] = useState(true);  

    console.log(token);
    useEffect(() => {
      console.log(token);
      if(token){
        console.log('dans if' +token);
        axios.get('https://serverchat.anthony-kalbe.fr/sujet', { headers: { Authorization: 'Bearer ' + token}})
            .then(response => {
                setSujets(response.data);
                setisLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des sujets:", error);
            });
          }
         
    },[token]) ;

     //récuperation localstorage
//  useEffect(() => {
//   const convData = localStorage.getItem('conv_open');

//   // if convOpen === true, redirect to /reconnect
//   if (convData) {
//     const { convOpen } = JSON.parse(convData);
//     if (convOpen) navigate('/fchat/reconnect', { replace: true });
//   }
// }, [navigate]);

    const joinRoom = () => {
      if ((rubrique === '1' || rubrique === '2') && titleConv !== '') {
       // Émettre l'événement join_room au serveur
        socket.emit('join_room', { rubrique, titleConv, token });

        // Écouter la réponse du serveur avec l'ID de la room
        socket.once('room_joined', (data) => {
          const { room } = data;
          // const convData = { convOpen: true, token, room };
          // localStorage.setItem('conv_open', JSON.stringify(convData));

          // Rediriger vers /chat
          navigate('/fchat/chat', { replace: true });
        });
      }
      else{
        alert('Veuillez remplir tous les champs');
      }
    };
  

      const openChat = () => {
        document.querySelector('.le-chat').classList.toggle('open');
        window.parent.postMessage("toggleClasses", "*");
      };

  return (
    <div className='le-fond'>
      <div className='icone' onClick={openChat}><img src={icon} alt="Chat icon" /></div>
      <div className={`le-chat open ${token ? 'open' : ''}`}>
        {token ? (
          <>
            <h1>Bienvenue sur le chat </h1>
            <p>Nos conseillers sont joignables de 9h à 12h & de 14h à 16h</p>
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
              Envoyer votre demande
            </button>
          </>
        ) : (
          <p>Connectez-vous pour accéder au chat.</p>
        )}
      </div>
    </div>
  );
}


export default Home;