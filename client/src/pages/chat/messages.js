import { useState, useEffect } from 'react';

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);

  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

	// Remove event listener on component unmount
    return () => socket.off('receive_message');
  }, [socket]);

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className='block client'>
      {messagesRecieved.map((msg, i) => (
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
        ) : msg.username == 'ChatBot' ? (
          <div key={i} className='message-chatbot'>
            {/* Ajoute ici le contenu spécifique pour le ChatBot */}
            <div className='flex'>
              <span>{msg.username}</span>
              <span>{formatDateFromTimestamp(msg.__createdtime__)}</span>
            </div>
            <div>
              <p className="msg chatbot">{msg.message}</p>
            </div>
            <br />
          </div>
        ) : (
          <div key={i} className='message-client fromclient'>
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
  );  
};

export default Messages;