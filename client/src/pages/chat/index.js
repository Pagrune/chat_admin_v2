import MessagesReceived from './messages';
import SendMessage from './send-message';
import icon from '../../img/chat/icon_message.png';

const Chat = ({ username, room, rubrique, titleConv, socket }) => {
  const openChat = () => {
    document.querySelector('.le-chat').classList.toggle('open');
  };

  return (
    <div className='le-fond'>
      <div className='icone'  onClick={openChat}><img src={icon}></img></div>
      <div className='le-chat open'>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} rubrique={rubrique} />
      </div>
    </div>
  );
};

export default Chat;