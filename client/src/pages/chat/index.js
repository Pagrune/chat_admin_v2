import MessagesReceived from './messages';
import SendMessage from './send-message';
import icon from '../../img/chat/icon_message.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Chat = ({ username, room, rubrique, token, titleConv, socket }) => {
  const navigate = useNavigate();

  // Fonction pour ouvrir/fermer le chat
  const toggleChat = () => {
    document.querySelector('.le-chat').classList.toggle('open');
  };


  useEffect(() => {
    // Écoute l'événement 'close_conv' venant du serveur
    socket.on('close_conv', () => {
      navigate('/fchat/', { replace: true });

      window.location.reload();
      // clear local storage
      // localStorage.removeItem('conv_open');
    });

    // Supprime l'écouteur d'événement lors du démontage du composant
    return () => {
      socket.off('close_conv');
    };
  }, [socket, navigate]);

  return (
    <div className='le-fond'>
      <div className='icone' onClick={toggleChat}>
        <img src={icon} alt="Chat icon"></img>
      </div>
      <div className='le-chat open'>
        <MessagesReceived socket={socket} token={token} />
        <SendMessage socket={socket} username={username} token={token} room={room} rubrique={rubrique} />
      </div>
    </div>
  );
};

export default Chat;