import MessagesReconnect from './messa-reconnect';
import SendMessageReconnect from './send-messa-reconnect';
import icon from '../../img/chat/icon_message.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Reconnect = ({ socket }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Récupération du localStorage
  const convData = JSON.parse(localStorage.getItem('conv_open') || '{}');
  const { token, room } = convData;

  // if localStorage is empty, redirect to home
  useEffect(() => {
    if (!convData || !convData.room || !convData.token) {
      navigate('/fchat/', { replace: true });
    }
  }, [navigate, convData]);

  // Fonction pour ouvrir/fermer le chat
  const toggleChat = () => {
    setIsOpen(!isOpen); // Mettre à jour l'état isOpen
    document.querySelector('.le-chat').classList.toggle('open');

    if (!isOpen) {
      // Si on ouvre le chat, rejoindre la room
      if (socket) {
        socket.emit('reconnect', { token, room });
      }
    } else {
      // Si on ferme le chat, quitter la room
      if (socket) {
        socket.emit('leave_room', { room });
      }
    }
  };

  useEffect(() => {
    // Écoute l'événement 'close_conv' venant du serveur
    if (socket) {
      const closeConvHandler = () => {
        navigate('/fchat/', { replace: true });
        localStorage.removeItem('conv_open');
      };

      socket.on('close_conv', closeConvHandler);

      // Nettoyage
      return () => socket.off('close_conv', closeConvHandler);
    }
  }, [socket, navigate]);

  return (
    <div className='le-fond'>
      <div className='icone' onClick={toggleChat}>
        <img src={icon} alt="Chat icon"></img>
      </div>
      <div className='le-chat'>
        {isOpen && (
          <>
            <MessagesReconnect socket={socket} room={room} token={token} />
            <SendMessageReconnect socket={socket} room={room} token={token} />
          </>
        )}
      </div>
    </div>
  );
};

export default Reconnect;