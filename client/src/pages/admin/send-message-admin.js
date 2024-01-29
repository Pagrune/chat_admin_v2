import React, { useState } from 'react';

const SendMessageAdmin = ({ socket, username, room}) => {
  const [message, setMessage] = useState('');

  console.log(username);
  const sentMessage = () => {
    if (message !== '') {
      const __createdtime__ = Date.now();
      const username ='99';
      console.log("send admin message");
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit('send_message', { username, message, room, __createdtime__ });
      setMessage('');
    }
  };

  return (
    <div >
      <input
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button className='btn btn-primary' onClick={sentMessage}>
        Send Message
      </button>
    </div>
  );
};

export default SendMessageAdmin;