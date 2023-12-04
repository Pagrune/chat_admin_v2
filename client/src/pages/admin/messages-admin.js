import { useState, useEffect } from 'react';
import axios from 'axios';

const MessagesAdmin = ({ socket, room }) => {
  const [messagesReceived, setMessagesReceived] = useState([]);
  const [messagesDB, setMessagesDB] = useState([]);

  console.log('room = '+room);

  socket.on('join_room_admin', (data) => {
    const { username, roomId } = data; // Include roomId in the destructuring
    console.log('socket_join'+data);
  });

  useEffect(() => {
    axios
      .get(`http://localhost:4000/messages/${room}`)
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
    <div>
      <div className="vieux_messages">
        {messagesDB.map((msg, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{msg.id_user}</span>
              <span>
                {formatDateFromTimestamp(msg.message_date)}
              </span>
            </div>
            <p>{msg.message_content}</p>
            <br />
          </div>
        ))}
      </div>
      {messagesReceived.map((msg, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{msg.username}</span>
            <span>
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>
          <p>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default MessagesAdmin;
