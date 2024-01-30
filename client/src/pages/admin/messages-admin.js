import { useState, useEffect } from 'react';
import axios from 'axios';

const MessagesAdmin = ({ socket, room, token }) => {
  const [messagesReceived, setMessagesReceived] = useState([]);
  const [messagesDB, setMessagesDB] = useState([]);

  console.log('room = '+room);

  socket.on('join_room_admin', (data) => {
    const { username, roomId } = data; // Include roomId in the destructuring
    console.log('socket_join'+data);
  });

  useEffect(() => {
    axios
      .get(`https://anthony-kalbe.fr/chat/messages/${room}`, { headers: { Authorization: 'Bearer ' + token }})
      .then((res) => {
        console.log('messages conversation '+res.data);
        setMessagesDB(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  socket.on('show_message', (data) => {
    const { room } = data; // Include roomId in the destructuring
    console.log('socket_show'+data);
  });

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    };

    socket.on('receive_message', receiveMessageHandler);

    // Remove event listener on component unmount
    return () => socket.off('receive_message', receiveMessageHandler);
  }, [socket]);

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className='block'>
      <div className="vieux_messages">
      {messagesDB.map((msg, i) => (
        msg.id_user == '99' ? (
          <div key={i} className='message-admin'>
            <div className='flex align-right'>
              <span>{formatDateFromTimestamp(msg.message_date)}</span>
            </div>
            <div>
              <p className='msg admin'>{msg.message_content}</p>
            </div>
            <br />
          </div>
        ) : (
          <div key={i} className='message-client'>
            <div className='flex'>
              <span>{msg.id_user}</span>
              <span>{formatDateFromTimestamp(msg.message_date)}</span>
            </div>
            <div>
              <p className="msg client">{msg.message_content}</p>
            </div>
            <br />
          </div>
        )
      ))}
      </div>
      <div className="nouveaux_messages">
      {messagesReceived.map((msg, i) => (
          msg.username === '99' ? (
            <div key={i} className='message-admin'>
              <div className='flex align-right'>
                <span>{formatDateFromTimestamp(msg.__createdtime__)}</span>
              </div>
              <div>
                <p className='msg admin'>{msg.message}</p>
              </div>
              <br />
            </div>
          ) : (
            <div className='message-client'>
              <div className='flex'>
                <span>{msg.username}</span>
                <span>{formatDateFromTimestamp(msg.__createdtime__)}</span>
              </div>
              <div>
                <p className="msg client">{msg.message}</p>
              </div>
              <br />
            </div>
          )

      ))}
    </div>
    </div>
  );
};

export default MessagesAdmin;
