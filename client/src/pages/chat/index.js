import MessagesReceived from './messages';
import SendMessage from './send-message';

const Chat = ({ username, room, rubrique, titleConv, socket }) => {
  return (
    <div>
      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} rubrique={rubrique} />
      </div>
    </div>
  );
};

export default Chat;