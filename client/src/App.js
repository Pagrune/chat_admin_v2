import './App.css';
import { useState, useEffect } from 'react'; // Add this
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client'; // Add this
import Home from './pages/home';
import Chat from './pages/chat';
// import Reconnect from './pages/chat/reconnect';
import AdminPage from './pages/admin';
import AdminChat from './pages/admin/chat';
// import axios from 'axios';
import AdminClosedChat from './pages/admin/closed-id';
import AdminConvOpen from './pages/admin/conv-open';
import AdminConvClosed from './pages/admin/conv-closed';

//import style App.css
import './App.css';


// Add this -- our server will run on port 4000, so we connect to it from here
//configuration de l'envoie des cookies avec les sockets

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [rubrique, setRubrique] = useState('');
  const [titleConv, setTitleConv] = useState('');
  const [socket, setSocket] = useState();
  // const [isLogin, setIsLogin] = useState(true); 


  //Récupération du cookie mutconnex dans le state token
  useEffect(() => {
    if (document.cookie.split(';').find(row => row.startsWith('mutconnex='))) {
      const newToken = document.cookie.split(';').find(row => row.startsWith('mutconnex=')).split('=')[1];
      setToken(newToken);
      setSocket(io('https://serverchat.anthony-kalbe.fr/', {
        extraHeaders: {
          Authorization: "Bearer " + newToken,
        }
      }
      ));
    }
  }, []);



  // console.log(token);
  // 

  // if (!socket) return 'att frr';

  // console.log(token);
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/fchat'
            element={<Home token={token} username={username} setUsername={setUsername} room={room} setRoom={setRoom} rubrique={rubrique} setRubrique={setRubrique} titleConv={titleConv} setTitleConv={setTitleConv} socket={socket}
            />
            }
          />
          <Route
            path='/fchat/chat'
            element={<Chat token={token} username={username} room={room} rubrique={rubrique} titleConv={titleConv} socket={socket} />}
          />
         
          <Route
            path='/fchat/admin'
            element={<AdminPage token={token} username={username} setUsername={setUsername} room={room} setRoom={setRoom} rubrique={rubrique} titleConv={titleConv} socket={socket} />}
          />
          <Route
            path='/fchat/admin/conv-open'
            element={<AdminConvOpen token={token} username={username} setUsername={setUsername} room={room} setRoom={setRoom} rubrique={rubrique} titleConv={titleConv} socket={socket} />}
          />
          <Route
            path='/fchat/admin/conv-closed'
            element={<AdminConvClosed token={token} username={username} setUsername={setUsername} room={room} setRoom={setRoom} rubrique={rubrique} titleConv={titleConv} socket={socket} />}
          />
          <Route path='/fchat/admin/chat' element={<AdminChat token={token} username={username} room={room} rubrique={rubrique} titleConv={titleConv} socket={socket} />} />
          <Route path='/fchat/admin/closed-id' element={<AdminClosedChat token={token} socket={socket} />} />
        </Routes>
      </div>
    </Router>
  );
  // }
}

export default App;