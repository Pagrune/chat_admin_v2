import './App.css';
import { useState, useEffect } from 'react'; // Add this
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client'; // Add this
import Home from './pages/home';
import Chat from './pages/chat';
import AdminPage from './pages/admin';
import AdminChat from './pages/admin/chat';
// import axios from 'axios';
import AdminClosedChat from './pages/admin/closed-id';
import AdminConvOpen from './pages/admin/conv-open';
import AdminConvClosed from './pages/admin/conv-closed';

//import style App.css
import './App.css';

const socket = io.connect('http://localhost:4000'); // Add this -- our server will run on port 4000, so we connect to it from here
//configuration de l'envoie des cookies avec les sockets


function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState(''); 
  const [room, setRoom] = useState(''); 
  const [rubrique, setRubrique] = useState('');
  const [titleConv, setTitleConv] = useState('');
  // const [isLogin, setIsLogin] = useState(true);

  //Récupération du cookie mutconnex dans le state token
  useEffect (() => {
  setToken(document.cookie.split(';').find(row => row.startsWith('mutconnex=')).split('=')[1]);
  }, []);

  // useEffect(() => {
  //   // Faites une requête à votre API pour récupérer les rooms
  //   console.log(document.cookie);
  //   const cookie_mutconnex = document.cookie.split(';').find(row => row.startsWith('mutconnex='));
  //   console.log(cookie_mutconnex);
  //   axios.get('http://localhost:4000/login')
  //     .then(response => setIsLogin(response.data))
  //     .catch(error => console.error('Erreur lors de la récupération des rooms :', error));
  // }, []);


  // if(isLogin === false){
  //   console.log('pas bon banania')
  // }
  // else{

    return (
      <Router>
        <div className='App'>
          <Routes>
            <Route
              path='/'
              element={
                <Home
                  token={token}
                  username={username} 
                  setUsername={setUsername} 
                  room={room} 
                  setRoom={setRoom} 
                  rubrique={rubrique}
                  setRubrique={setRubrique}
                  titleConv={titleConv}
                  setTitleConv={setTitleConv}
                  socket={socket} 
                />
              }
            />
            <Route
              path='/chat'
              element={<Chat token={token} username={username} room={room} rubrique={rubrique} titleConv={titleConv} socket={socket} />}
            />
            <Route
              path='/admin'
              element={<AdminPage token={token} username={username} setUsername={setUsername} room={room} setRoom={setRoom} rubrique={rubrique} titleConv={titleConv} socket={socket} />}
            />
            <Route
              path='/admin/conv-open'
              element={<AdminConvOpen token={token} username={username} setUsername={setUsername} room={room} setRoom={setRoom} rubrique={rubrique} titleConv={titleConv} socket={socket} />}
            />
            <Route
              path='/admin/conv-closed'
              element={<AdminConvClosed token={token} username={username} setUsername={setUsername} room={room} setRoom={setRoom} rubrique={rubrique} titleConv={titleConv} socket={socket} />}
            />
            <Route path='/admin/chat' element={<AdminChat username={username} room={room} rubrique={rubrique} titleConv={titleConv} socket={socket} />} />
            <Route path='/admin/closed-id' element={<AdminClosedChat  socket={socket} />} />
          </Routes>
        </div>
      </Router>
    );
  // }
}

export default App;