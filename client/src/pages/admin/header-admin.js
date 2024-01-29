import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Header = ({token}) => {
    const navigate = useNavigate();
    const [sujets, setSujets] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:4000/sujet', { headers: { Authorization: 'Bearer ' + token }})
            .then(response => {
                setSujets(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des sujets:", error);
            });
    }, []);

        // const navigate = useNavigate();

        return (
            <div className='header'>
                <nav className='menu_navigation'>
                    <button onClick={() => navigate('/admin/', { replace: true })}>Page accueil administration</button>
                    <button onClick={() => navigate('/admin/conv-open', { replace: true, })}>Conversations en cours</button>
                    <button onClick={() => navigate('/admin/conv-closed', { replace: true })}>Conversations fermées</button>
                   
                </nav>
            </div>
        );
    };

export default Header;
