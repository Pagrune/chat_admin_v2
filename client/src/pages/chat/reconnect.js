import MessagesReconnect from './messa-reconnect';
import SendMessageReconnect from './send-messa-reconnect';
import icon from '../../img/chat/icon_message.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Reconnect = ({socket}) => {
  const navigate = useNavigate();

  // Récupération du localStorage
    const convData = JSON.parse(localStorage.getItem('conv_open'));
    const { token, room } = convData;
    const room_id = room;
    const token_storage = token;

  // if localStorage is empty, redirect to home
    useEffect(() => {
        const convData = localStorage.getItem('conv_open');
    
        // if convOpen === true, redirect to /reconnect
        if (!convData) navigate('/', { replace: true });
    }, [navigate]);

    // Fonction pour ouvrir/fermer le chat    
    const reconnect_to_room = () => {
        console.log('reconnect' + socket);
        // add class open to le-chat
        document.querySelector('.le-chat').classList.toggle('open');

        if (socket) {
            const convData = JSON.parse(localStorage.getItem('conv_open'));
            const { token, room } = convData;
            socket.emit('reconnect', { token, room });
          } else {
            console.log("Socket not ready or disconnected.");
        }
        };

        useEffect(() => {
            // Écoute l'événement 'close_conv' venant du serveur
            if (socket) {
              socket.on('close_conv', () => {
                navigate('/', { replace: true });
                // clear local storage
                localStorage.removeItem('conv_open');
              });
            }
          }, [socket, navigate]);
        

  return (
    <div className='le-fond'>
      <div className='icone' onClick={reconnect_to_room} >
        <img src={icon} alt="Chat icon"></img>
      </div>
      <div className='le-chat'>
        <MessagesReconnect socket={socket} room={room_id} token={token_storage}/>
        <SendMessageReconnect socket={socket} room={room_id} token={token_storage}/>

      </div>
    </div>
  );
};

export default Reconnect;